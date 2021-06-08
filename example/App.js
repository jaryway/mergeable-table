import React from "react";

import MergeableTable, { Preview as MergeableTablePreview } from "../es/index";
// import "antd/dist/antd.css";

function App() {
  // console.log('reac',React);
  return (
    <div>
      <MergeableTable
        className="fregata-control"
        style={{ maxHeight: "100vh" }}
        defaultValue={{
          id: "a0f0c78b1550f",
          type: "Table",
          name: "表格布局",
          rows: 3,
          cols: 3,
          style: {},
          elements: [
            {
              id: "211593e9e728f",
              type: "TableCell",
              row: 0,
              col: 0,
              pid: "a0f0c78b1550f"
            },
            {
              id: "cb2dc21ab3437",
              type: "TableCell",
              row: 0,
              col: 1,
              pid: "a0f0c78b1550f"
            },
            {
              id: "f4c1de3df3f5c",
              type: "TableCell",
              row: 0,
              col: 2,
              pid: "a0f0c78b1550f"
            },
            {
              id: "0a45586b52b7",
              type: "TableCell",
              row: 1,
              col: 0,
              pid: "a0f0c78b1550f"
            },
            {
              id: "892af6ef5c1ff",
              type: "TableCell",
              row: 1,
              col: 1,
              pid: "a0f0c78b1550f"
            },
            {
              id: "6c29e1de8c1d9",
              type: "TableCell",
              row: 1,
              col: 2,
              pid: "a0f0c78b1550f"
            },
            {
              id: "db5db27cbdafa",
              type: "TableCell",
              row: 2,
              col: 0,
              pid: "a0f0c78b1550f"
            },
            {
              id: "d7e2ecc12dc9d",
              type: "TableCell",
              row: 2,
              col: 1,
              pid: "a0f0c78b1550f"
            },
            {
              id: "cfd40386d6b6a",
              type: "TableCell",
              row: 2,
              col: 2,
              pid: "a0f0c78b1550f"
            }
          ]
        }}
        // showHeader={true}
        // onChange={v => console.log("xxx", v)}
      />
      {/* <MergeableTablePreview
        className="fregata-control"
        style={{ maxHeight: "100vh" }}
        defaultValue={{ elements: [], cols: 30, rows: 30 }}
        showHeader={false}
      /> */}
    </div>
  );
}

export default App;
