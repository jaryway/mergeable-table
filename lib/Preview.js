"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

require("./style");

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _helper = require("./helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var getWidth = function getWidth(v) {
  return isNaN(Number(v)) ? v : "".concat(Number(v), "px");
};

function MergeableTablePreview(_a) {
  var _a$showHeader = _a.showHeader,
      showHeader = _a$showHeader === void 0 ? true : _a$showHeader,
      data = _a.value,
      rest = __rest(_a, ["showHeader", "value"]);

  if (!data) return _react["default"].createElement("div", null);
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
  var memoizedCell = (0, _react.useCallback)(function (r, c) {
    return data.elements.find(function (m) {
      return m.row === r && m.col === c;
    }) || {};
  }, [data.elements]);
  return _react["default"].createElement("div", _extends({}, rest, {
    className: (0, _classnames["default"])("mergeable-table-component", rest.className)
  }), _react["default"].createElement("table", {
    className: "mergeable-table"
  }, showHeader && _react["default"].createElement("thead", null, _react["default"].createElement("tr", null, cols.map(function (col) {
    return _react["default"].createElement("th", {
      key: col
    }, (0, _helper.getHeadChar)(col));
  }))), _react["default"].createElement("tbody", null, rows.map(function (i) {
    return _react["default"].createElement("tr", {
      key: i
    }, cols.map(function (j) {
      // const key = getKey(i, j);
      var cell = memoizedCell(i, j);
      var _cell$colSpan = cell.colSpan,
          colSpan = _cell$colSpan === void 0 ? 1 : _cell$colSpan,
          _cell$rowSpan = cell.rowSpan,
          rowSpan = _cell$rowSpan === void 0 ? 1 : _cell$rowSpan;
      var colWidth = getWidth((data.style || {})[j]);
      var colStyle = colWidth ? {
        width: colWidth
      } : {}; // console.log("xxxxxxxx0", i, j);

      return _react["default"].createElement("td", _extends({
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

function _default(_a) {
  var value = _a.value,
      defaultValue = _a.defaultValue,
      rest = __rest(_a, ["value", "defaultValue"]);

  return _react["default"].createElement(MergeableTablePreview, _extends({}, rest, {
    value: value || defaultValue
  }));
}