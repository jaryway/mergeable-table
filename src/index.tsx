import React, { useState, useCallback, useMemo } from "react";
import classnames from "classnames";
// import { Dropdown, Menu } from "antd";
import Dropdown from "rc-dropdown";
import Menu, { MenuItem, Divider } from "rc-menu";
import useTable from "./hooks/useTable";
// import { getKey, getHeadChar, BUTTON_CODE } from "./utils";
// import { isInRange } from "./helper";
import { getHeadChar } from "./helper";
import { BUTTON_CODE, MergeableTableProps, Element } from "./index.d";

import "rc-dropdown/assets/index.css";

import "./style";

export { default as Preview } from "./Preview";
// console.log("xxxxxxxx", Dropdown, Menu);
// const noop = () => {};
// let instanceRef = React.createRef();
const getWidth = (v: number) => (isNaN(Number(v)) ? v : `${Number(v)}px`);

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
    // selection,
    // range: selectedRange,
    selectedCells,
    placeholders,
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
    // getOverlay
  } = useTable(data, onChange);

  const actions: any = useMemo(() => {
    // console.log('range', range);
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

  const memorizedOverlay = useMemo(() => {
    if (!selectedCells.length) return <div />;
    if (!data) return;

    const [[row, col, rowSpan = 1, colSpan = 1]] = selectedCells;

    const cell =
      data.elements.find((m: any) => m.row === row && m.col === col) || {};
    // const { rowSpan = 1, colSpan = 1 } = cell;
    // console.log("memorizedOverlay",selectedCells, colSpan, rowSpan);
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

  // console.log("selectedRange", selection, selectedCells);

  var rows = Array.apply<any, any, any>(null, { length: data.rows }).map(
    (_: any, i: number) => i
  );
  var cols = Array.apply<any, any, any>(null, { length: data.cols }).map(
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
          // disabled={!selectedCells.length}
          overlay={memorizedOverlay}
          trigger={["contextMenu"]}
          animation="slide-up"
          alignPoint
        >
          <tbody>
            {rows.map((i: number) => {
              return (
                <tr key={i}>
                  {cols.map((j: number) => {
                    // const key = getKey(i, j);
                    const cell: Element | any =
                      data.elements.find(
                        (m: any) => m.row === i && m.col === j
                      ) || {};
                    const isPlaceholder = placeholders.some(
                      (m: any) => m[0] === i && m[1] === j
                    );

                    // 占位单元格不渲染
                    if (isPlaceholder) return null;

                    const { colSpan = 1, rowSpan = 1 } = cell;

                    const selected = selectedCells.some(
                      m => m[0] === i && m[1] === j
                    );
                    const _onCellMouseLeftDown = onCellMouseLeftDown(i, j);
                    // console.log("children: cell.children,", colSpan, rowSpan);
                    // 占位单元格不渲染
                    // if (placeholders[key]) return null;
                    const colWidth = getWidth((data.style || {})[j]);
                    const colStyle = colWidth ? { width: colWidth } : {};

                    return (
                      <td
                        style={{ ...colStyle }}
                        data-id={(cell || {}).id}
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
                          // if (e.button === BUTTON_CODE.LEFT) {
                          //   onCellMouseLeftDown(i, j)(e);
                          // }
                          // if (e.button === BUTTON_CODE.RIGHT) {
                          //   //   that.onCellMouseRightDown(e);
                          // }
                        }}
                      >
                        {i}-{j}
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
