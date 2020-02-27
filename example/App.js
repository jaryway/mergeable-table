import React from "react";

import MergeableTable from "../src/index";
import "antd/dist/antd.css";

function App() {
  return (
    <div>
      <MergeableTable
        className="fregata-control"
        config={{ elements: [], cols: 2 }}
        //   onChange={onChange}
        showHeader={true}
      />
    </div>
  );
}

export default App;
