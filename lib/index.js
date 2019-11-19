"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

require("antd/lib/dropdown/style");

var _dropdown = _interopRequireDefault(require("antd/lib/dropdown"));

require("./style");

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _useTable2 = _interopRequireDefault(require("./hooks/useTable"));

var _utils = require("./utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

// const noop = () => {};
// let instanceRef = React.createRef();
var getWidth = function getWidth(v) {
  return isNaN(Number(v)) ? v : "".concat(Number(v), "px");
};

function TableBuilder(_ref) {
  var _ref$showHeader = _ref.showHeader,
      showHeader = _ref$showHeader === void 0 ? true : _ref$showHeader,
      data = _ref.data,
      readOnly = _ref.readOnly,
      onChange = _ref.onChange;

  var _useTable = (0, _useTable2["default"])(data, onChange),
      mouse = _useTable.mouse,
      selectedCells = _useTable.selectedCells,
      memoizedPlaceCells = _useTable.memoizedPlaceCells,
      onCellMouseLeftDown = _useTable.onCellMouseLeftDown,
      onCellMouseOver = _useTable.onCellMouseOver,
      onCellMouseUp = _useTable.onCellMouseUp,
      getOverlay = _useTable.getOverlay;

  var columns = new Array(data.cols).fill(1);
  return _react["default"].createElement("div", {
    className: "mergeable-table-component",
    style: {
      zIndex: 200
    }
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
      var selected = !!selectedCells[key];

      var _onCellMouseLeftDown = onCellMouseLeftDown(i, j); // console.log('children: cell.children,', cell.children);
      // 占位单元格不渲染


      if (memoizedPlaceCells[key]) return null;
      var colWidth = getWidth((data.style || {})[j]);
      var colStyle = colWidth ? {
        width: colWidth
      } : {}; // console.log('cell', colStyle, data.style);

      if (readOnly) {
        return _react["default"].createElement("td", _extends({
          style: _extends({}, colStyle),
          "data-id": cell.id,
          key: "".concat(i, "-").concat(j),
          className: (0, _classnames["default"])({
            selected: selected
          })
        }, {
          rowSpan: rowSpan,
          colSpan: colSpan
        }), cell.render && cell.render(cell));
      }

      return _react["default"].createElement(_dropdown["default"], {
        key: "".concat(i, "-").concat(j),
        disabled: !selected,
        overlay: getOverlay(cell),
        trigger: ['contextMenu']
      }, _react["default"].createElement("td", _extends({
        style: _extends({}, colStyle),
        "data-id": cell.id,
        key: "".concat(i, "-").concat(j),
        className: (0, _classnames["default"])({
          selected: selected
        })
      }, {
        rowSpan: rowSpan,
        colSpan: colSpan
      }, {
        onMouseOver: mouse ? onCellMouseOver(i + rowSpan - 1, j + colSpan - 1) : undefined,
        onMouseUp: onCellMouseUp,
        onMouseDown: function onMouseDown(e) {
          e.preventDefault();
          e.stopPropagation(); // 当前已经选中，并且是右键操作直接显示右键菜单

          if (selected && e.button === _utils.BUTTON_CODE.RIGHT) return;

          _onCellMouseLeftDown(e); // if (e.button === BUTTON_CODE.LEFT) {
          //   onCellMouseLeftDown(i, j)(e);
          // }
          // if (e.button === BUTTON_CODE.RIGHT) {
          //   //   that.onCellMouseRightDown(e);
          // }

        }
      }), cell.render && cell.render(cell)));
    }));
  }))));
}

function _default(_a) {
  var config = _a.config,
      defaultConfig = _a.defaultConfig,
      onChange = _a.onChange,
      rest = __rest(_a, ["config", "defaultConfig", "onChange"]);

  if (config) {
    return _react["default"].createElement(TableBuilder, _extends({}, rest, {
      data: config,
      onChange: onChange
    }));
  }

  var _useState = (0, _react.useState)(defaultConfig),
      _useState2 = _slicedToArray(_useState, 2),
      _data = _useState2[0],
      onValueChange = _useState2[1];

  (0, _react.useEffect)(function () {
    onValueChange(defaultConfig);
  }, [defaultConfig]);

  var _onChange = function _onChange(changedValue) {
    onValueChange(changedValue);
    onChange && onChange(changedValue);
  };

  return _react["default"].createElement(TableBuilder, _extends({}, rest, {
    data: _data,
    onChange: _onChange
  }));
}