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

// [row,col,rowSpan,colSpan]
type SelectedCell = [number, number, number?, number?];

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

function range2Cells(range: Range): SelectedCell[] {
  if (!range || !range.length) return [];

  // console.log("range2Cells", range);

  const [r0, c0, r1, c1] = range;
  const [minRow, maxRow] = r0 < r1 ? [r0, r1] : [r1, r0];
  const [minCol, maxCol] = c0 < c1 ? [c0, c1] : [c1, c0];

  // console.log("range2Cells", minRow, maxRow);

  const res: SelectedCell[] = [];

  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      // const match = mergeds.find(([r, c]) => row === r && c === col);
      console.log("range2Cells");
      // if (match) {
      //   const [row0, col0, row1, col1] = match;
      //   const rowSpan = row1 - row + 1;
      //   const colSpan = col1 - col + 1;
      //   row = row1;
      //   col = col1;
      //   // console.log("range2Cells-1", row, col, rowSpan, colSpan);
      //   res.push([row0, col0, rowSpan, colSpan]);
      // } else {
      res.push([row, col]);
      // }
    }
  }

  return res;
}

const useTable = (data: any, onChange: any) => {
  const [mouse, setMouse] = useState(MOUSE.UP); // 鼠标单击状态
  const [state, setState] = useState<any>({ mergeds: [], placeholders: [] });
  const [startCell, setStartCell] = useState<Cell | []>([]); // 选中的开始单元格和结束单元格
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]); // 选中的要高亮的单元格
  const [selectedRange, setSelectedRange] = useState<any>([]); // 选中的最大区域

  const { mergeds, placeholders } = state;

  // elements 发生变化，重新生成 mergeds、placeholders
  useEffect(() => {
    const _mergeds = getMergeds(data.elements);
    const _placeholders = mergeds2Placeholders(_mergeds);
    // console.log("reset-getMergeds");
    setState((prev: any) => ({
      ...prev,
      mergeds: _mergeds,
      placeholders: _placeholders
    }));
  }, [data.elements]);

  // 选区发生变化=> 改变选中的单元格
  useEffect(() => {
    console.log("useEffect-----", selectedRange);
    setSelectedCells(range2Cells(selectedRange));
  }, [selectedRange]);

  const onCellMouseLeftDown = useCallback(
    (i, j) => {
      return () => {
        // 鼠标点击后，确定开始坐标
        // console.log("onCellMouseLeftDown", i, j);
        const startRange = getCellRange([i, j], mergeds);

        setStartCell(() => [i, j]);
        setSelectedRange(startRange);
        // setSelectedCells(range2Cells(startRange));
        setMouse(MOUSE.DOWN);
      };
    },
    [mergeds]
  );

  // console.log("selectedRange", selectedRange, selectedCells, mergeds);

  const onCellMouseOver = useCallback(
    (r1, c1) => {
      return () => {
        //
        if (mouse !== MOUSE.DOWN) return false;
        if (!startCell.length) return false;
        const [r0, c0] = startCell;
        // 比较大小，避免从右到左选择合并不对的情况
        const [row0, row1] = r0 < r1 ? [r0, r1] : [r1, r0];
        const [col0, col1] = c0 < c1 ? [c0, c1] : [c1, c0];

        if (r0 === r1 && c0 === c1) return;

        // 注意：单元有可能已经合并过

        const [nextRange] = getMaxRange([row0, col0, row1, col1], mergeds);
        setSelectedRange(nextRange);
        setStartCell(row0, col0, row1, col1);
        // setSelectedCells(range2Cells(nextRange));
      };
    },
    [placeholders, mergeds, mouse, startCell]
  );

  const onCellMouseUp = () => setMouse(MOUSE.UP);

  // 合并单元格
  const onMergeCell = useCallback(() => {
    if (selectedRange.length != 4) return;
    const [r0, c0, r1, c1] = selectedRange;

    const [row0, row1] = r0 < r1 ? [r0, r1] : [r1, r0];
    const [col0, col1] = c0 < c1 ? [c0, c1] : [c1, c0];

    const rowSpan = row1 - row0;
    const colSpan = col1 - col0;

    /**
     * 合并后，如果的目标单元格，没有在 data 中，则插入一条数据，记录单元格的合并情况
     *  同时，被合并的单元格，如果在 data 中有数据则要删除
     */

    // console.log("onMergeCell", row0, row1, rowSpan, colSpan);

    // 删除合并范围内的单元格
    const nextData = data.elements.filter(
      ({ row, col }: any) =>
        row < row0 ||
        row > row1 ||
        col < col0 ||
        col > col1 ||
        (row === row0 && col === col0)
    );

    const i = nextData.findIndex((m: any) => m.row === row0 && m.col === col0);

    // 更新 rowSpan、colSpan
    const next = {
      ...(rowSpan >= 1 ? { rowSpan: rowSpan + 1 } : {}),
      ...(colSpan >= 1 ? { colSpan: colSpan + 1 } : {})
    };

    // 目标单元格，已经存在，更新 rowSpan、colSpan
    const command =
      i > -1
        ? { [i]: { $merge: next } }
        : {
            // 目标单元格，没有在 data 中，插入一条数据
            $push: [{ row: row0, col: col0, ...next }]
          };
    const changedValue = { ...data, elements: update(nextData, command) };
    onChange && onChange(changedValue);

    setStartCell([]);
    setSelectedRange([]);
  }, [data, selectedRange]);

  // 拆分单元格
  const onSplitCell = useCallback(() => {
    const [[row, col]] = selectedCells;
    const index = data.elements.findIndex(
      (m: Element) => m.row === row && m.col === col
    );

    if (index < 0) return;

    const { rowSpan = 1, colSpan = 1 } = data.elements[index];

    if (rowSpan <= 1 && colSpan <= 1) return;

    const changedValue = {
      ...data,
      elements: update(data.elements, {
        [index]: { $merge: { rowSpan: 1, colSpan: 1 } }
      })
    };

    onChange && onChange(changedValue);
    setStartCell([]);
    setSelectedRange([]);
  }, [data]);

  // console.log("startCell", data.elements);

  // 添加行，从选区最小的行上方添加一行
  const onAddRow = useCallback(() => {
    // console.log("onAddRow", selectedRange);
    // 没有选中区域，返回
    if (selectedRange.length < 1) return;

    /**
     * 执行data.rows + 1；同时要把 data.elements 中，当前后行及行后的数据的 row + 1;
     */
    const [row] = selectedRange;

    // console.log("onAddRow", selectedRange, row);

    const changedValue = {
      ...data,
      rows: data.rows + 1,
      elements: data.elements.map((item: Element) => {
        // 当前后的数据的 row + 1;
        if (item.row < row) return item;
        return { ...item, row: item.row + 1 };
      })
    };

    onChange && onChange(changedValue);
  }, [data, selectedRange]);

  // 添加列，既向选中的单元格左侧添加一列
  const onAddCol = useCallback(() => {
    // 没有选中区域，返回
    if (selectedRange.length < 1) return;

    /**
     * 执行 cols + 1；同时要把 data.elements 中，当前后行及行后的数据的 col + 1;
     */

    const [, col] = selectedRange;

    const changedValue = {
      ...data,
      cols: data.cols + 1,
      elements: data.elements.map((item: Element) => {
        // 当前后的数据的 row + 1;
        if (item.col < col) return item;
        return { ...item, col: item.col + 1 };
      })
    };

    onChange && onChange(changedValue);
  }, [data, selectedRange]);

  // 删除选中的行
  const onDelRow = useCallback(() => {
    // 没有选中区域，返回
    if (selectedRange.length < 1) return;

    /**
     * 执行 rows- rowSpan，移除 data 中相关数据，同时当前 row 后的数据的 row - rowSpan;
     */

    const [row0, , row1] = selectedRange;
    const rowSpan = row1 - row0 + 1;

    const changedValue = {
      ...data,
      rows: data.rows - rowSpan <= 0 ? 1 : data.rows - rowSpan, // 至少保留一行
      elements: data.elements
        .filter((m: Element) => m.row < row0 || m.row > row1)
        .map((m: Element) =>
          m.row < row0 ? m : { ...m, row: m.row - rowSpan }
        )
    };

    onChange && onChange(changedValue);
    setStartCell([]);

    setSelectedRange([]);
  }, [data, selectedRange]);

  // 删除选中的列
  const onDelCol = useCallback(() => {
    // 没有选中区域，返回
    if (selectedRange.length < 1) return;

    /**
     * 执行 cols - colSpan ，移除 data 中相关数据，同时当前 col 后的数据的 col - colSpan;
     */

    const [, col0, , col1] = selectedRange;
    const colSpan = col1 - col0 + 1;

    const changedValue = {
      ...data,
      cols: data.cols - colSpan <= 0 ? 1 : data.cols - colSpan, // 至少保留一行
      elements: data.elements
        .filter((m: Element) => m.col < col0 || m.col > col1)
        .map((m: Element) =>
          m.col < col0 ? m : { ...m, col: m.col - colSpan }
        )
    };

    onChange && onChange(changedValue);

    setStartCell([]);
  }, [data, selectedRange]);

  // 清楚选中
  const onClean = useCallback(() => {
    setStartCell([]);

    setSelectedRange([]);
  }, []);

  return {
    mouse,
    startCell,
    selectedCells,
    range: selectedRange,
    mergeds,
    placeholders,

    onCellMouseLeftDown,
    onCellMouseOver,
    onCellMouseUp,

    onMergeCell
    // onSplitCell,
    // onAddRow,
    // onAddCol,
    // onDelRow,
    // onDelCol,
    // onClean
  };
};

export default useTable;