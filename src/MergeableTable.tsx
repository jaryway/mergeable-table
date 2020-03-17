import React, { useState, useCallback, useMemo } from "react";
import classnames from "classnames";
// import { Dropdown, Menu } from "antd";
import Dropdown from "rc-dropdown";
import Menu, { MenuItem, Divider } from "rc-menu";
import useTable from "./hooks/useTable";
import { getHeadChar } from "./helper";
import { BUTTON_CODE, MergeableTableProps, Element, Range } from "./index.d";

import "rc-dropdown/assets/index.css";

import "./style";

const getWidth = (v: number) => (isNaN(Number(v)) ? v : `${Number(v)}px`);

function getIsPlaceholder(row: number, col: number, mergeds: Range[]) {
  // console.log("getIsPlaceholder000");
  // 合并区域内除了第一个，其他的都是空白
  return mergeds.some(
    ([r0, c0, r1, c1]: number[]) =>
      row >= r0 &&
      row <= r1 &&
      col >= c0 &&
      col <= c1 &&
      !(row === r0 && col === c0)
  );
}

function MergeableTable({
  showHeader = true,
  value: data,
  onChange,
  forwardedRef,
  ...rest
}: MergeableTableProps) {
  if (!data) return null;

  const {
    mouse,
    mergeds,
    selectedCells,

    onCellMouseLeftDown,
    onCellMouseOver,
    onCellMouseUp,
    onMergeCell,
    onSplitCell,
    onAddRow,
    onDelRow,
    onDelCol,
    onAddCol,
    onClean
  } = useTable(data, onChange);

  const actions: any = useMemo(() => {
    return {
      merge: onMergeCell,
      split: onSplitCell,
      addrow: onAddRow,
      addcol: onAddCol,
      delrow: onDelRow,
      delcol: onDelCol,
      clean: onClean
    };
  }, [
    onMergeCell,
    onSplitCell,
    onAddRow,
    onDelRow,
    onDelCol,
    onAddCol,
    onClean
  ]);

  const memoizedCell = useCallback(
    (r: number, c: number) =>
      data.elements.find((m: any) => m.row === r && m.col === c) || {},
    [data.elements]
  );

  const memoizedIsSelected = useCallback(
    (r: number, c: number) => selectedCells.some(m => m[0] === r && m[1] === c),
    [selectedCells]
  );

  const memoizedOverlay = useMemo(() => {
    if (!selectedCells.length) return <div />;
    if (!data) return <div />;

    const [[row, col, rowSpan = 1, colSpan = 1]] = selectedCells;

    const cell = memoizedCell(row, col);
    // data.elements.find((m: any) => m.row === row && m.col === col) || {};
    // const { rowSpan = 1, colSpan = 1 } = cell;
    // console.log("memoizedOverlay",selectedCells, colSpan, rowSpan);
    const hasSpan = rowSpan + colSpan > 2;

    // 是否选中了多个单元格，选中了多个单元格后拆分单元格不能使用
    const canMergeCell = selectedCells.length > 1;
    const canSplitCell = selectedCells.length === 1 && hasSpan;

    return (
      <Menu
        style={{ width: 120 }}
        onClick={({ key }) => {
          // console.log("key", key, actions);
          actions[key](cell);
        }}
      >
        <MenuItem key="merge" disabled={!canMergeCell}>
          合并单元格
        </MenuItem>
        <MenuItem key="split" disabled={!canSplitCell}>
          拆分单元格
        </MenuItem>
        <Divider key="d1" />
        <MenuItem key="addrow">添加行</MenuItem>
        <MenuItem key="delrow">删除行</MenuItem>
        <Divider key="d2" />
        <MenuItem key="addcol">添加列</MenuItem>
        <MenuItem key="delcol">删除列</MenuItem>
        <Divider key="d3" />
        <MenuItem key="clean">清空选择</MenuItem>
      </Menu>
    );
  }, [actions, selectedCells, data]);

  const memoizedIsPlaceholder = useCallback(
    (row: number, col: number) => {
      return getIsPlaceholder(row, col, mergeds);
      // const deps = [row, col, mergeds];
      // return useMemo(() => getIsPlaceholder(row, col, mergeds), deps);
    },
    [mergeds]
  );

  // console.log("selectedRange", selection, selectedCells);

  const rows = Array.apply<any, any, any>(null, { length: data.rows }).map(
    (_: any, i: number) => i
  );
  const cols = Array.apply<any, any, any>(null, { length: data.cols }).map(
    (_: any, i: number) => i
  );

  return (
    <div
      {...rest}
      className={classnames("mergeable-table-component", rest.className)}
    >
      <table className="mergeable-table">
        {showHeader && (
          <thead>
            <tr>
              {cols.map((col: number) => (
                <th key={col}>{getHeadChar(col)}</th>
              ))}
            </tr>
          </thead>
        )}
        <Dropdown
          overlay={memoizedOverlay}
          trigger={["contextMenu"]}
          animation="slide-up"
          alignPoint
        >
          <tbody>
            {rows.map((i: number) => {
              return (
                <tr key={i}>
                  {cols.map((j: number) => {
                    const cell: Element | any = memoizedCell(i, j);
                    const isPlaceholder = memoizedIsPlaceholder(i, j);

                    // 占位单元格不渲染
                    if (isPlaceholder) return null;

                    const { colSpan = 1, rowSpan = 1 } = cell;
                    const selected = memoizedIsSelected(i, j);
                    const _onCellMouseLeftDown = onCellMouseLeftDown(i, j);
                    // console.log("children: cell.children,", colSpan, rowSpan);

                    const colWidth = getWidth((data.style || {})[j]);
                    const colStyle = colWidth ? { width: colWidth } : {};

                    return (
                      <td
                        style={{ ...colStyle }}
                        data-id={`${i}-${j}`}
                        key={`${i}-${j}`}
                        className={classnames({ selected })}
                        {...{ rowSpan, colSpan }}
                        onMouseOver={
                          mouse
                            ? onCellMouseOver(i + rowSpan - 1, j + colSpan - 1)
                            : undefined
                        }
                        onMouseUp={onCellMouseUp}
                        onMouseDown={e => {
                          e.preventDefault();
                          e.stopPropagation();

                          // 当前已经选中，并且是右键操作直接显示右键菜单
                          if (selected && e.button === BUTTON_CODE.RIGHT)
                            return;

                          _onCellMouseLeftDown(e);
                        }}
                      >
                        {/* {i}-{j} */}
                        {cell && cell.render && cell.render(cell)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Dropdown>
      </table>
    </div>
  );
}

const Uncontrolled = ({
  defaultValue,
  onChange,
  ...rest
}: MergeableTableProps) => {
  const [value, setValue] = useState<any>(defaultValue);
  const _onChange = useCallback(
    e => {
      setValue(e);
      onChange && onChange(e);
    },
    [onChange]
  );

  return <MergeableTable {...rest} value={value} onChange={_onChange} />;
};

export default React.forwardRef<any, MergeableTableProps>(
  ({ value, ...rest }: MergeableTableProps, ref: any) => {
    if (value === undefined)
      return <Uncontrolled {...rest} forwardedRef={ref} />;

    return (
      <MergeableTable showHeader={false} value={value} forwardedRef={ref} />
    );
  }
);
