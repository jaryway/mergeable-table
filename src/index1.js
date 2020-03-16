import React, { useState, useCallback, useMemo } from "react";
import classnames from "classnames";
import { Dropdown, Menu } from "antd";
import useTable from "./hooks/useTable";
import { getKey, getHeadChar, BUTTON_CODE } from "./utils";
import { isInRange } from "./helper";

import "./style";

export { default as Preview } from "./Preview";

// const noop = () => {};
// let instanceRef = React.createRef();
const getWidth = v => (isNaN(Number(v)) ? v : `${Number(v)}px`);

function MergeableTable({
  showHeader = true,
  value: data,
  onChange,
  forwardedRef,
  ...rest
}) {
  const {
    mouse,
    selection,
    range: selectedRange,
    // selectedCells,
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

  const actions = useMemo(() => {
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

  const getOverlay = useCallback(() => {
    if (!selection.length) return <div />;

    const [row, col, row1, col1] = selectedRange;
    const cell = data.elements.find(m => m.row === row && m.col === col) || {};
    const { rowSpan = 1, colSpan = 1 } = cell;
    const hasSpan = rowSpan + colSpan > 2;
    // console.log("getOverlay", selectedCells);
    // 是否选中了多个单元格，选中了多个单元格后拆分单元格不能使用
    const canMergeCell = (row !== row1 || col !== col1) && !hasSpan;
    const canSplitCell =
      row + rowSpan - 1 === row1 && col + colSpan - 1 === col1 && hasSpan;

    // console.log("getOverlay", row, col, row1, col1, canSplitCell);

    return (
      <Menu
        style={{ width: 120 }}
        onClick={({ key }) => {
          // console.log("key", key, actions);
          actions[key](cell);
        }}
      >
        <Menu.Item key="merge" disabled={!canMergeCell}>
          合并单元格
        </Menu.Item>
        <Menu.Item key="split" disabled={!canSplitCell}>
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
  }, [actions, selection, selectedRange, data]);

  console.log("selectedRange", selection, selectedRange);

  var rows = Array.apply(null, { length: data.rows }).map((_, i) => i);
  var cols = Array.apply(null, { length: data.cols }).map((_, i) => i);

  return (
    <div
      {...rest}
      className={classnames("mergeable-table-component", rest.className)}
    >
      <table className="mergeable-table">
        {showHeader && (
          <thead>
            <tr>
              {cols.map(col => (
                <th key={col}>{getHeadChar(col)}</th>
              ))}
            </tr>
          </thead>
        )}
        <Dropdown
          disabled={!selection.length}
          overlay={getOverlay()}
          trigger={["contextMenu"]}
        >
          <tbody>
            {rows.map(i => {
              return (
                <tr key={i}>
                  {cols.map(j => {
                    // const key = getKey(i, j);
                    const cell =
                      data.elements.find(m => m.row === i && m.col === j) || {};
                    const isPlaceholder = placeholders.some(
                      m => m[0] === i && m[1] === j
                    );

                    // 占位单元格不渲染
                    if (isPlaceholder) return null;

                    const { colSpan = 1, rowSpan = 1 } = cell;

                    const selected = isInRange([i, j], selectedRange);
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

const Uncontrolled = ({ defaultValue, onChange, ...rest }) => {
  const [value, setValue] = useState(defaultValue);
  const _onChange = useCallback(
    e => {
      setValue(e);
      onChange && onChange(e);
    },
    [onChange]
  );

  return <MergeableTable {...rest} value={value} onChange={_onChange} />;
};
export default React.forwardRef(({ value, ...rest }, ref) => {
  if (value === undefined) return <Uncontrolled {...rest} forwardedRef={ref} />;

  return <MergeableTable {...rest} value={value} forwardedRef={ref} />;
});
