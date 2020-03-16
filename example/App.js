import React from "react";

import MergeableTable from "../src/index";
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
    </div>
  );
}

export default App;
