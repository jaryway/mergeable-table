"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

require("./style");

var _react = _interopRequireDefault(require("react"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

function MergeableTable(_ref) {
  var _ref$showHeader = _ref.showHeader,
      showHeader = _ref$showHeader === void 0 ? true : _ref$showHeader,
      data = _ref.data;
  var columns = new Array(data.cols).fill(1);
  return _react["default"].createElement("div", {
    className: "mergeable-table-component"
  }, _react["default"].createElement("table", {
    className: "mergeable-table"
  }, showHeader && _react["default"].createElement("thead", null, _react["default"].createElement("tr", null, columns.map(function (_cell, j) {
    return _react["default"].createElement("th", {
      key: j
    }, (0, _utils.getHeadChar)(j));
  }))), _react["default"].createElement("tbody", null, new Array(data.rows).fill(1).map(function (_row, i) {
    return _react["default"].createElement("tr", {
      key: i
    }, columns.map(function (_cell, j) {
      var key = (0, _utils.getKey)(i, j);
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
      return _react["default"].createElement("td", _extends({
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

function _default(_a) {
  var config = _a.config,
      defaultConfig = _a.defaultConfig,
      rest = __rest(_a, ["config", "defaultConfig"]);

  return _react["default"].createElement(MergeableTable, _extends({}, rest, {
    data: config || defaultConfig
  }));
}