import "./style";
import React, { useCallback } from "react";
import classnames from "classnames";
import { getHeadChar } from "./helper";

const getWidth = (v: any) => (isNaN(Number(v)) ? v : `${Number(v)}px`);

function MergeableTablePreview({
  showHeader = true,
  value: data,
  ...rest
}: any) {
  if (!data) return <div />;

  const rows = Array.apply<any, any, any>(null, { length: data.rows }).map(
    (_: any, i: number) => i
  );
  const cols = Array.apply<any, any, any>(null, { length: data.cols }).map(
    (_: any, i: number) => i
  );
  const memoizedCell = useCallback(
    (r: number, c: number) =>
      data.elements.find((m: any) => m.row === r && m.col === c) || {},
    [data.elements]
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
        <tbody>
          {rows.map((i: number) => {
            return (
              <tr key={i}>
                {cols.map((j: number) => {
                  // const key = getKey(i, j);
                  const cell = memoizedCell(i, j);
                  const { colSpan = 1, rowSpan = 1 } = cell;

                  const colWidth = getWidth((data.style || {})[j]);
                  const colStyle = colWidth ? { width: colWidth } : {};
                  // console.log("xxxxxxxx0", i, j);
                  return (
                    <td
                      style={{ ...colStyle }}
                      data-id={cell.id}
                      key={`${i}_${j}`}
                      // className={classnames({ selected })}
                      {...{ rowSpan, colSpan }}
                    >
                      {cell && cell.render && cell.render(cell)}
                    </td>
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

export default function({ value, defaultValue, ...rest }: any) {
  return <MergeableTablePreview {...rest} value={value || defaultValue} />;
}
