import React from "react";

import MergeableTable, { Preview as MergeableTablePreview } from "../src/index";
// import "antd/dist/antd.css";

function App() {
  return (
    <div>
      <MergeableTable
        className="fregata-control"
        style={{ maxHeight: "100vh" }}
        defaultValue={{ elements: [], cols: 30, rows: 30 }}
        showHeader={true}
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
