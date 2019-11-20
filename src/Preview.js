import "./style";
import React from "react";
// import classnames from "classnames";

// import { Dropdown } from 'antd';
// import useTable from './hooks/useTable';
import { getKey, getHeadChar } from "./utils";

const getWidth = v => (isNaN(Number(v)) ? v : `${Number(v)}px`);

function MergeableTable({ showHeader = true, data }) {
  const columns = new Array(data.cols).fill(1);

  return (
    <div className="mergeable-table-component">
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

                  const colWidth = getWidth((data.style || {})[j]);
                  const colStyle = colWidth ? { width: colWidth } : {};

                  return (
                    <td
                      style={{ ...colStyle }}
                      data-id={cell.id}
                      key={key}
                      // className={classnames({ selected })}
                      {...{ rowSpan, colSpan }}
                    >
                      {cell.render && cell.render(cell)}
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

export default function({ config, defaultConfig, ...rest }) {
  return <MergeableTable {...rest} data={config || defaultConfig} />;
}
