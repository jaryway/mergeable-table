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
import React, { useCallback } from "react";
import classnames from "classnames";
import { getHeadChar } from "./helper";

var getWidth = function getWidth(v) {
  return isNaN(Number(v)) ? v : "".concat(Number(v), "px");
};

function MergeableTablePreview(_a) {
  var _a$showHeader = _a.showHeader,
      showHeader = _a$showHeader === void 0 ? true : _a$showHeader,
      data = _a.value,
      rest = __rest(_a, ["showHeader", "value"]);

  if (!data) return React.createElement("div", null);
  var rows = Array.apply(null, {
    length: data.rows
  }).map(function (_, i) {
    return i;
  });
  var cols = Array.apply(null, {
    length: data.cols
  }).map(function (_, i) {
    return i;
  });
  var memoizedCell = useCallback(function (r, c) {
    return data.elements.find(function (m) {
      return m.row === r && m.col === c;
    }) || {};
  }, [data.elements]);
  return React.createElement("div", _extends({}, rest, {
    className: classnames("mergeable-table-component", rest.className)
  }), React.createElement("table", {
    className: "mergeable-table"
  }, showHeader && React.createElement("thead", null, React.createElement("tr", null, cols.map(function (col) {
    return React.createElement("th", {
      key: col
    }, getHeadChar(col));
  }))), React.createElement("tbody", null, rows.map(function (i) {
    return React.createElement("tr", {
      key: i
    }, cols.map(function (j) {
      var cell = memoizedCell(i, j);
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
        key: "".concat(i, "_").concat(j)
      }, {
        rowSpan: rowSpan,
        colSpan: colSpan
      }), cell && cell.render && cell.render(cell));
    }));
  }))));
}

export default function (_a) {
  var value = _a.value,
      defaultValue = _a.defaultValue,
      rest = __rest(_a, ["value", "defaultValue"]);

  return React.createElement(MergeableTablePreview, _extends({}, rest, {
    value: value || defaultValue
  }));
}