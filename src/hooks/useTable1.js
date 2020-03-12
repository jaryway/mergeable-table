/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useMemo } from 'react';
import update from 'immutability-helper';
import { Menu } from 'antd';
import { range2Cells, getRange, getMergedPlace, getCellRange, MOUSE } from '../utils';

const useTable = (config, onChange) => {
  const [mouse, setMouse] = useState(MOUSE.UP); // 鼠标单击状态
  const [selection, setSelection] = useState([]); // 选择的开始单元格和结束单元格
  const [selectedCells, setSelectedCells] = useState({}); // 选中的要高亮的单元格
  const [range, setRange] = useState([]); // 选中的最大区域

  const { place: memoizedPlaceCells, merged: memoizedMergedCells } = useMemo(() => {
    // 获取合并单元格和占位单元格
    return getMergedPlace(config.elements);
  }, [config]);

  const onCellMouseLeftDown = useCallback(
    (i, j) => {
      return () => {
        // e.preventDefault();
        const [a, b, c, d] = getCellRange([i, j], memoizedMergedCells, memoizedPlaceCells);
        setSelectedCells(range2Cells([i, j]));
        setSelection(() => [[i, j]]);
        setRange([[a, b], [c, d]]);
        setMouse(1);
      };
    },
    [memoizedMergedCells, memoizedPlaceCells]
  );
  const onCellMouseUp = e => {
    setMouse(0);
  };

  const onCellMouseOver = useCallback(
    (i, j) => {
      return _e => {
        if (mouse !== 1) return false;
        // 已经选中了，跳过
        const [[m, n]] = selection;
        if (m === i && n === j) return false;

        // 注意：单元有可能已经合并过

        const next = [[m, n], [i, j]];
        const maxRange = getRange(...next, memoizedMergedCells, memoizedPlaceCells);
        setSelection(next);
        setRange(maxRange);
        setSelectedCells(range2Cells(...maxRange));

        // console.log('onCellMouseOver', maxRange, next);
      };
    },
    [memoizedPlaceCells, memoizedMergedCells, mouse, selection]
  );

  // 合并单元格
  const onMergeCell = useCallback(() => {
    // console.log('onMergeCell', range);
    if (range.length < 1) return;

    const [cell1, cell2] = range;

    if (!cell2) return;

    const [row1, col1] = cell1;
    const [row2, col2] = cell2;

    const rowSpan = Math.abs(row1 - row2);
    const colSpan = Math.abs(col1 - col2);

    /**
     * 合并后，如果的目标单元格，没有在 data 中，则插入一条数据，记录单元格的合并情况
     *  同时，被合并的单元格，如果在 data 中有数据则要删除
     */

    const nextData = config.elements.filter(
      m =>
        m.row < row1 ||
        m.row > row2 ||
        m.col < col1 ||
        m.col > col2 ||
        (m.row === row1 && m.col === col1)
    );

    const index = nextData.findIndex(m => m.row === row1 && m.col === col1);

    // console.log('onMergeCell', index, cell1, cell2, nextData);

    const command =
      index > -1
        ? {
            // 目标单元格，已经存在，更新 rowSpan、colSpan
            [index]: {
              $merge: {
                ...(rowSpan >= 1 ? { rowSpan: rowSpan + 1 } : {}),
                ...(colSpan >= 1 ? { colSpan: colSpan + 1 } : {}),
              },
            },
          }
        : {
            // 目标单元格，没有在 data 中，插入一条数据
            $push: [
              {
                key: [row1, col1].join('_'),
                row: row1,
                col: col1,
                ...(rowSpan >= 1 ? { rowSpan: rowSpan + 1 } : {}),
                ...(colSpan >= 1 ? { colSpan: colSpan + 1 } : {}),
              },
            ],
          };
    const changedValue = { ...config, elements: update(nextData, command) };
    onChange && onChange(changedValue);
    // setState(prev => ({ ...prev, elements: update(nextData, command) }));
    setSelectedCells([]);
    setSelection([]);
    setRange([]);
    // console.log('onMergeCell', config, changedValue);
  }, [config, range]);

  // 拆分单元格
  const onSplitCell = useCallback(
    cell => {
      // console.log('onSplitCell', range);
      const { rowSpan = 1, colSpan = 1, row, col } = cell;

      if (rowSpan <= 1 && colSpan <= 1) return;

      const index = config.elements.findIndex(m => m.row === row && m.col === col);

      // console.log('onSplitCell', rowSpan, colSpan);

      const command = {
        [index]: { $merge: { rowSpan: undefined, colSpan: undefined } },
      };
      onChange && onChange({ ...config, elements: update(config.elements, command) });
      // onChange(prev => ({ ...prev, elements: update(prev.elements, command) }));
      setSelectedCells([]);
      setSelection([]);
      setRange([]);

      // setSelection([[row, col], [row + rowSpan - 1, col + colSpan - 1]]);
    },
    [config, range]
  );

  // 添加行，既向选中的单元格下方添加一行
  const onAddRow = useCallback(() => {
    console.log('onAddRow', range);
    // 没有选中区域，返回
    if (range.length < 1) return;

    /**
     * 执行 rows+1；同时要把 data 中，当前后的数据的 row +1;
     */

    const [, [row]] = range;

    // console.log('onAddRow', range, row);
    const command = {
      $apply: data => {
        return data.map(item => {
          // 当前后的数据的 row + 1;
          if (item.row <= row) return item;
          return { ...item, row: item.row + 1 };
        });
      },
    };

    onChange &&
      onChange({ ...config, rows: config.rows + 1, elements: update(config.elements, command) });
  }, [config, range]);

  // 添加列，既向选中的单元格右侧添加一列
  const onAddCol = useCallback(() => {
    // 没有选中区域，返回
    if (range.length < 1) return;

    /**
     * 执行 rows+1；同时要把 data 中，当前后的数据的 row +1;
     */

    const [ [, col]] = range;

    // console.log('onAddCol', range, col);
    const command = {
      $apply: data => {
        return data.map(item => {
          // 当前后的数据的 col + 1;
          if (item.col <= col) return item;
          return { ...item, col: item.col + 1 };
        });
      },
    };

    onChange &&
      onChange({ ...config, cols: config.cols + 1, elements: update(config.elements, command) });
  }, [config, range]);

  // 移除选中的行
  const onDelRow = useCallback(() => {
    // 没有选中区域，返回
    if (range.length < 1) return;

    /**
     * 执行 rows- rowSpan，移除 data 中相关数据，同时当前 row 后的数据的 row - rowSpan;
     */

    const [[row1], [row2]] = range;
    const rowSpan = row2 - row1 + 1;

    const command = {
      $apply: data =>
        data
          .filter(m => m.row < row1 || m.row > row2)
          .map(m => (m.row < row2 ? m : { ...m, row: m.row - rowSpan })),
    };

    // setState(prev => ({
    //   ...prev,
    //   rows: prev.rows - rowSpan < 1 ? 1 : prev.rows - rowSpan,
    //   data: update(prev.data, command),
    // }));
    const rows = config.rows - rowSpan < 1 ? 1 : config.rows - rowSpan;
    onChange && onChange({ ...config, rows, elements: update(config.elements, command) });
    setSelection([]);
    setSelectedCells([]);
    // console.log('onDelRow', row1, row2, rowSpan);
  }, [config, range]);

  // 删除选中的列
  const onDelCol = useCallback(() => {
    // 没有选中区域，返回
    if (range.length < 1) return;

    /**
     * 执行 cols - colSpan ，移除 data 中相关数据，同时当前 col 后的数据的 col - colSpan;
     */

    const [[, col1], [, col2]] = range;
    const colSpan = col2 - col1 + 1;

    const command = {
      $apply: data =>
        data
          .filter(m => m.col < col1 || m.col > col2)
          // 当前 col 后的数据的 col - colSpan
          .map(m => (m.col < col2 ? m : { ...m, col: m.col - colSpan })),
    };

    const cols = config.cols - colSpan < 1 ? 1 : config.cols - colSpan;
    onChange && onChange({ ...config, cols, elements: update(config.elements, command) });
    setSelectedCells([]);
    setSelection([]);
  }, [config, range]);

  // 清楚选中
  const onClean = useCallback(() => {
    setSelectedCells([]);
    setSelection([]);
    setRange([]);
  }, []);

  const actions = useMemo(() => {
    // console.log('range', range);
    return {
      merge: onMergeCell,
      split: onSplitCell,
      addrow: onAddRow,
      addcol: onAddCol,
      delrow: onDelRow,
      delcol: onDelCol,
      clean: onClean,
    };
  }, [onMergeCell, onSplitCell, onAddRow, onDelRow, onDelCol, onAddCol, onClean]);

  const getOverlay = useCallback(
    cell => {
      const { rowSpan = 1, colSpan = 1 } = cell;
      const selectedMulti = selection.length > 1;
      const canSplit = !selectedMulti && rowSpan + colSpan > 3;
      // console.log('getOverlay', canSplit, cell, selection);
      return (
        <Menu
          style={{ width: 120 }}
          onClick={({ key }) => {
            console.log('key', key);
            actions[key](cell);
          }}
        >
          <Menu.Item key="merge" disabled={!selectedMulti}>
            合并单元格
          </Menu.Item>
          <Menu.Item key="split" disabled={!canSplit}>
            拆分单元格
          </Menu.Item>
          <Menu.Divider key="d1" />
          <Menu.Item key="addrow">添加行</Menu.Item>
          <Menu.Item key="delrow">删除行</Menu.Item>
          <Menu.Divider key="d2" />
          <Menu.Item key="addcol">添加列</Menu.Item>
          <Menu.Item key="delcol">删除列</Menu.Item>
          <Menu.Divider key="d3" />
          <Menu.Item key="clean">清空选择</Menu.Item>
        </Menu>
      );
    },
    [actions, selection]
  );

  return {
    mouse,
    selection,
    selectedCells,
    range,
    getOverlay,
    memoizedPlaceCells,
    memoizedMergedCells,

    onCellMouseLeftDown,
    onCellMouseOver,
    onCellMouseUp,
    onMergeCell,
    onSplitCell,
    onAddRow,
    onDelRow,
    onDelCol,
    onAddCol,
    onClean,
  };
};

export default useTable;
