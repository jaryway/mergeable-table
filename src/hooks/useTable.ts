// /* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useMemo, useEffect } from "react";
import update from "immutability-helper";
import { Menu } from "antd";
import {
  // range2Cells,
  getRange,
  getMergedPlace
  // getCellRange
  // MOUSE
} from "../utils";
import { Range, Cell, getMaxRange, getPlaceholders } from "../helper";

interface Element {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

type StartEndCell = [] | [number, number] | [number, number, number, number];

enum MOUSE {
  UP,
  DOWN
}

enum BUTTON_CODE {
  LEFT,
  MIDDLE,
  RIGHT
}

/**
 * 获取已合并单元格和占位单元格
 * @param elements
 */
function getMergeds(elements: Element[]): Range[] {
  return elements
    .filter(m => (m.colSpan || 1) + (m.rowSpan || 1) > 2)
    .map(({ row, col, rowSpan = 1, colSpan = 1 }) => [
      row,
      col,
      row + rowSpan - 1,
      col + colSpan - 1
    ]);
}

function mergeds2Placeholders(mergeds: Range[]): Cell[] {
  return mergeds.reduce((prev: Cell[], current: Range) => {
    return [...prev, ...getPlaceholders(current)];
  }, []);
}

function getCellRange(cell: Cell, mergeds: Range[]): Range {
  const [row, col] = cell;
  const range = mergeds.find(([r, c]) => r == row && c === col);
  return range ? range : [row, col, row, col];
}

function range2Cells(range: Range): Cell[] {
  const [r0, c0, r1, c1] = range;
  const minRow = Math.min(r0, r1);
  const maxRow = Math.max(r0, r1);
  const minCol = Math.min(c0, c1);
  const maxCol = Math.max(c0, c1);
  const res: Cell[] = [];
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      res.push([row, col]);
    }
  }

  return res;
}

const useTable = (data: any, onChange: any) => {
  const [mouse, setMouse] = useState(MOUSE.UP); // 鼠标单击状态
  const [state, setState] = useState<any>({ mergeds: [], placeholders: [] });
  const [selection, setSelection] = useState<StartEndCell>([]); // 选中的开始单元格和结束单元格
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]); // 选中的要高亮的单元格
  const [selectedRange, setSelectedRange] = useState<any>([]); // 选中的最大区域

  const { mergeds, placeholders } = state;

  // const {
  //   place: memoizedPlaceCells,
  //   merged: memoizedMergedCells
  // } = useMemo(() => {
  //   // 获取合并单元格和占位单元格
  //   return getMergedPlace(data.elements);
  // }, [data]);

  useEffect(() => {
    const _mergeds = getMergeds(data.elements);
    const _placeholders = mergeds2Placeholders(_mergeds);
    console.log("reset-getMergeds");
    setState((prev: any) => ({
      ...prev,
      mergeds: _mergeds,
      placeholders: _placeholders
    }));
  }, [data.elements]);

  const onCellMouseLeftDown = useCallback(
    (i, j) => {
      return () => {
        // 鼠标点击后，确定开始坐标
        console.log("onCellMouseLeftDown", i, j);
        const startRange = getCellRange([i, j], mergeds);
        const selectedCell: Cell = [i, j];

        setSelection(() => [i, j]);
        setSelectedCells([selectedCell]);
        setSelectedRange(startRange);
        setMouse(MOUSE.DOWN);
      };
    },
    [mergeds]
  );

  console.log("placeholders", selection, mergeds, placeholders, selectedCells);

  const onCellMouseOver = useCallback(
    (i, j) => {
      return (_e: any) => {
        //
        if (mouse !== MOUSE.DOWN) return false;
        if (!selection.length) return false;
        const [m, n] = selection;

        // 已经选中了，跳过
        // if (m === i && n === j) {
        //   setSelection([m, n, i, j]);
        //   console.log("onCellMouseOver0", selection);
        //   return false;
        // }

        console.log("onCellMouseOver1", selection);
        // 注意：单元有可能已经合并过

        const [nextRange, _nextMergeds] = getMaxRange([m, n, i, j], mergeds);

        setSelectedRange(nextRange);
        setSelectedCells(range2Cells(nextRange));
        // console.log("onCellMouseOver", nextRange, range2Cells(nextRange));
      };
    },
    [placeholders, mergeds, mouse, selection]
  );

  const onCellMouseUp = () => setMouse(0);

  // 合并单元格
  const onMergeCell = useCallback(() => {
    console.log("onMergeCell", selectedRange);
    if (selectedRange.length != 4) return;
    const [r0, c0, r1, c1] = selectedRange;

    const rowSpan = Math.abs(r0 - r1);
    const colSpan = Math.abs(c0 - c1);

    /**
     * 合并后，如果的目标单元格，没有在 data 中，则插入一条数据，记录单元格的合并情况
     *  同时，被合并的单元格，如果在 data 中有数据则要删除
     */

    // 删除合并范围内的单元格
    const nextData = data.elements.filter(
      (m: any) =>
        m.row < r0 ||
        m.row > r1 ||
        m.col < c0 ||
        m.col > c1 ||
        (m.row === r0 && m.col === c0)
    );

    const index = nextData.findIndex((m: any) => m.row === r0 && m.col === c0);

    const command =
      index > -1
        ? {
            // 目标单元格，已经存在，更新 rowSpan、colSpan
            [index]: {
              $merge: {
                ...(rowSpan >= 1 ? { rowSpan: rowSpan + 1 } : {}),
                ...(colSpan >= 1 ? { colSpan: colSpan + 1 } : {})
              }
            }
          }
        : {
            // 目标单元格，没有在 data 中，插入一条数据
            $push: [
              {
                key: [r0, c0].join("_"),
                row: r0,
                col: c0,
                ...(rowSpan >= 1 ? { rowSpan: rowSpan + 1 } : {}),
                ...(colSpan >= 1 ? { colSpan: colSpan + 1 } : {})
              }
            ]
          };
    const changedValue = { ...data, elements: update(nextData, command) };
    onChange && onChange(changedValue);
    // setState(prev => ({ ...prev, elements: update(nextData, command) }));
    setSelection([]);
    setSelectedCells([]);
    setSelectedRange([]);
    // console.log("onMergeCell-changedValue", data, changedValue);
  }, [data, selectedRange]);

  // // 拆分单元格
  // const onSplitCell = useCallback(
  //   cell => {
  //     // console.log('onSplitCell', range);
  //     const { rowSpan = 1, colSpan = 1, row, col } = cell;

  //     if (rowSpan <= 1 && colSpan <= 1) return;

  //     const index = data.elements.findIndex(
  //       (m: any) => m.row === row && m.col === col
  //     );

  //     // console.log('onSplitCell', rowSpan, colSpan);

  //     const command = {
  //       [index]: { $merge: { rowSpan: undefined, colSpan: undefined } }
  //     };
  //     onChange &&
  //       onChange({ ...data, elements: update(data.elements, command) });
  //     // onChange(prev => ({ ...prev, elements: update(prev.elements, command) }));
  //     setSelectedCells([]);
  //     setSelection([]);
  //     setRange([]);

  //     // setSelection([[row, col], [row + rowSpan - 1, col + colSpan - 1]]);
  //   },
  //   [data, range]
  // );

  // // 添加行，既向选中的单元格下方添加一行
  // const onAddRow = useCallback(() => {
  //   console.log("onAddRow", range);
  //   // 没有选中区域，返回
  //   if (range.length < 1) return;

  //   /**
  //    * 执行 rows+1；同时要把 data 中，当前后的数据的 row +1;
  //    */

  //   const [, [row]] = range;

  //   // console.log('onAddRow', range, row);
  //   const command = {
  //     $apply: data => {
  //       return data.map(item => {
  //         // 当前后的数据的 row + 1;
  //         if (item.row <= row) return item;
  //         return { ...item, row: item.row + 1 };
  //       });
  //     }
  //   };

  //   onChange &&
  //     onChange({
  //       ...data,
  //       rows: data.rows + 1,
  //       elements: update(data.elements, command)
  //     });
  // }, [data, range]);

  // // 添加列，既向选中的单元格右侧添加一列
  // const onAddCol = useCallback(() => {
  //   // 没有选中区域，返回
  //   if (range.length < 1) return;

  //   /**
  //    * 执行 rows+1；同时要把 data 中，当前后的数据的 row +1;
  //    */

  //   const [[, col]] = range;

  //   // console.log('onAddCol', range, col);
  //   const command = {
  //     $apply: data => {
  //       return data.map(item => {
  //         // 当前后的数据的 col + 1;
  //         if (item.col <= col) return item;
  //         return { ...item, col: item.col + 1 };
  //       });
  //     }
  //   };

  //   onChange &&
  //     onChange({
  //       ...data,
  //       cols: data.cols + 1,
  //       elements: update(data.elements, command)
  //     });
  // }, [data, range]);

  // // 移除选中的行
  // const onDelRow = useCallback(() => {
  //   // 没有选中区域，返回
  //   if (range.length < 1) return;

  //   /**
  //    * 执行 rows- rowSpan，移除 data 中相关数据，同时当前 row 后的数据的 row - rowSpan;
  //    */

  //   const [[row1], [row2]] = range;
  //   const rowSpan = row2 - row1 + 1;

  //   const command = {
  //     $apply: data =>
  //       data
  //         .filter(m => m.row < row1 || m.row > row2)
  //         .map(m => (m.row < row2 ? m : { ...m, row: m.row - rowSpan }))
  //   };

  //   // setState(prev => ({
  //   //   ...prev,
  //   //   rows: prev.rows - rowSpan < 1 ? 1 : prev.rows - rowSpan,
  //   //   data: update(prev.data, command),
  //   // }));
  //   const rows = data.rows - rowSpan < 1 ? 1 : data.rows - rowSpan;
  //   onChange &&
  //     onChange({ ...data, rows, elements: update(data.elements, command) });
  //   setSelection([]);
  //   setSelectedCells([]);
  //   // console.log('onDelRow', row1, row2, rowSpan);
  // }, [data, range]);

  // // 删除选中的列
  // const onDelCol = useCallback(() => {
  //   // 没有选中区域，返回
  //   if (range.length < 1) return;

  //   /**
  //    * 执行 cols - colSpan ，移除 data 中相关数据，同时当前 col 后的数据的 col - colSpan;
  //    */

  //   const [[, col1], [, col2]] = range;
  //   const colSpan = col2 - col1 + 1;

  //   const command = {
  //     $apply: data =>
  //       data
  //         .filter(m => m.col < col1 || m.col > col2)
  //         // 当前 col 后的数据的 col - colSpan
  //         .map(m => (m.col < col2 ? m : { ...m, col: m.col - colSpan }))
  //   };

  //   const cols = data.cols - colSpan < 1 ? 1 : data.cols - colSpan;
  //   onChange &&
  //     onChange({ ...data, cols, elements: update(data.elements, command) });
  //   setSelectedCells([]);
  //   setSelection([]);
  // }, [data, range]);

  // // 清楚选中
  // const onClean = useCallback(() => {
  //   setSelectedCells([]);
  //   setSelection([]);
  //   setRange([]);
  // }, []);

  return {
    mouse,
    selection,
    selectedCells,
    range: selectedRange,
    // getOverlay,
    mergeds,
    placeholders,

    onCellMouseLeftDown,
    onCellMouseOver,
    onCellMouseUp,
    onMergeCell,
    onSplitCell: () => {},
    onAddRow: () => {},
    onDelRow: () => {},
    onDelCol: () => {},
    onAddCol: () => {},
    onClean: () => {}
  };
};

export default useTable;
