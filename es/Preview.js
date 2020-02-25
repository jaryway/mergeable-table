function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

import "./style";
import React from "react";
import classnames from "classnames";
import { getKey, getHeadChar } from "./utils";

var getWidth = function getWidth(v) {
  return isNaN(Number(v)) ? v : "".concat(Number(v), "px");
};

function MergeableTable(_a) {
  var _a$showHeader = _a.showHeader,
      showHeader = _a$showHeader === void 0 ? true : _a$showHeader,
      data = _a.data,
      rest = __rest(_a, ["showHeader", "data"]);

  var columns = new Array(data.cols).fill(1);
  return React.createElement("div", _extends({}, rest, {
    className: classnames("mergeable-table-component", rest.className)
  }), React.createElement("table", {
    className: "mergeable-table"
  }, showHeader && React.createElement("thead", null, React.createElement("tr", null, columns.map(function (_cell, j) {
    return React.createElement("th", {
      key: j
    }, getHeadChar(j));
  }))), React.createElement("tbody", null, new Array(data.rows).fill(1).map(function (_row, i) {
    return React.createElement("tr", {
      key: i
    }, columns.map(function (_cell, j) {
      var key = getKey(i, j);
      var cell = data.elements.find(function (m) {
        return m.row === i && m.col === j;
      }) || {};
      var _cell$colSpan = cell.colSpan,
          colSpan = _cell$colSpan === void 0 ? 1 : _cell$colSpan,
          _cell$rowSpan = cell.rowSpan,
          rowSpan = _cell$rowSpan === void 0 ? 1 : _cell$rowSpan;
      var colWidth = getWidth((data.style || {})[j]);
      var colStyle = colWidth ? {
        width: colWidth
      } : {};
      return React.createElement("td", _extends({
        style: _extends({}, colStyle),
        "data-id": cell.id,
        key: key
      }, {
        rowSpan: rowSpan,
        colSpan: colSpan
      }), cell.render && cell.render(cell));
    }));
  }))));
}

export default function (_a) {
  var config = _a.config,
      defaultConfig = _a.defaultConfig,
      rest = __rest(_a, ["config", "defaultConfig"]);

  return React.createElement(MergeableTable, _extends({}, rest, {
    data: config || defaultConfig
  }));
}