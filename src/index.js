import "./style";
import React, { useState, useCallback } from "react";
import classnames from "classnames";

import { Dropdown } from "antd";
import useTable from "./hooks/useTable1";
import { getKey, getHeadChar, BUTTON_CODE } from "./utils";

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
    selectedCells,
    memoizedPlaceCells,
    onCellMouseLeftDown,
    onCellMouseOver,
    onCellMouseUp,
    getOverlay
  } = useTable(data, onChange);

  const columns = new Array(data.cols).fill(1);

  return (
    <div
      {...rest}
      className={classnames("mergeable-table-component", rest.className)}
    >
      <table className="mergeable-table">
        {showHeader && (
          <thead>
            <tr>
              {columns.map((_cell, j) => (
                <th key={j}>{getHeadChar(j)}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {new Array(data.rows).fill(1).map((_row, i) => {
            return (
              <tr key={i}>
                {columns.map((_cell, j) => {
                  const key = getKey(i, j);
                  const cell =
                    data.elements.find(m => m.row === i && m.col === j) || {};
                  const { colSpan = 1, rowSpan = 1 } = cell;
                  const selected = !!selectedCells[key];
                  const _onCellMouseLeftDown = onCellMouseLeftDown(i, j);
                  // console.log('children: cell.children,', cell.children);
                  // 占位单元格不渲染
                  if (memoizedPlaceCells[key]) return null;
                  const colWidth = getWidth((data.style || {})[j]);
                  const colStyle = colWidth ? { width: colWidth } : {};

                  return (
                    <Dropdown
                      key={`${i}-${j}`}
                      disabled={!selected}
                      overlay={getOverlay(cell)}
                      trigger={["contextMenu"]}
                    >
                      <td
                        style={{ ...colStyle }}
                        data-id={cell.id}
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
                        {cell.render && cell.render(cell)}
                      </td>
                    </Dropdown>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
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
