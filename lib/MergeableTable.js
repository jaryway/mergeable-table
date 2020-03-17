"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _rcDropdown = _interopRequireDefault(require("rc-dropdown"));

var _rcMenu = _interopRequireWildcard(require("rc-menu"));

var _useTable2 = _interopRequireDefault(require("./hooks/useTable"));

var _helper = require("./helper");

require("rc-dropdown/assets/index.css");

require("./style");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

function getIsPlaceholder(row, col, mergeds) {
  // console.log("getIsPlaceholder000");
  // 合并区域内除了第一个，其他的都是空白
  return mergeds.some(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 4),
        r0 = _ref2[0],
        c0 = _ref2[1],
        r1 = _ref2[2],
        c1 = _ref2[3];

    return row >= r0 && row <= r1 && col >= c0 && col <= c1 && !(row === r0 && col === c0);
  });
}

function MergeableTable(_a) {
  var _a$showHeader = _a.showHeader,
      showHeader = _a$showHeader === void 0 ? true : _a$showHeader,
      data = _a.value,
      onChange = _a.onChange,
      forwardedRef = _a.forwardedRef,
      rest = __rest(_a, ["showHeader", "value", "onChange", "forwardedRef"]);

  if (!data) return null;

  var _useTable = (0, _useTable2["default"])(data, onChange),
      mouse = _useTable.mouse,
      mergeds = _useTable.mergeds,
      selectedCells = _useTable.selectedCells,
      onCellMouseLeftDown = _useTable.onCellMouseLeftDown,
      onCellMouseOver = _useTable.onCellMouseOver,
      onCellMouseUp = _useTable.onCellMouseUp,
      onMergeCell = _useTable.onMergeCell,
      onSplitCell = _useTable.onSplitCell,
      onAddRow = _useTable.onAddRow,
      onDelRow = _useTable.onDelRow,
      onDelCol = _useTable.onDelCol,
      onAddCol = _useTable.onAddCol,
      onClean = _useTable.onClean;

  var actions = (0, _react.useMemo)(function () {
    return {
      merge: onMergeCell,
      split: onSplitCell,
      addrow: onAddRow,
      addcol: onAddCol,
      delrow: onDelRow,
      delcol: onDelCol,
      clean: onClean
    };
  }, [onMergeCell, onSplitCell, onAddRow, onDelRow, onDelCol, onAddCol, onClean]);
  var memoizedCell = (0, _react.useCallback)(function (r, c) {
    return data.elements.find(function (m) {
      return m.row === r && m.col === c;
    }) || {};
  }, [data.elements]);
  var memoizedIsSelected = (0, _react.useCallback)(function (r, c) {
    return selectedCells.some(function (m) {
      return m[0] === r && m[1] === c;
    });
  }, [selectedCells]);
  var memoizedOverlay = (0, _react.useMemo)(function () {
    if (!selectedCells.length) return _react["default"].createElement("div", null);
    if (!data) return _react["default"].createElement("div", null);

    var _selectedCells = _slicedToArray(selectedCells, 1),
        _selectedCells$ = _slicedToArray(_selectedCells[0], 4),
        row = _selectedCells$[0],
        col = _selectedCells$[1],
        _selectedCells$$ = _selectedCells$[2],
        rowSpan = _selectedCells$$ === void 0 ? 1 : _selectedCells$$,
        _selectedCells$$2 = _selectedCells$[3],
        colSpan = _selectedCells$$2 === void 0 ? 1 : _selectedCells$$2;

    var cell = memoizedCell(row, col); // data.elements.find((m: any) => m.row === row && m.col === col) || {};
    // const { rowSpan = 1, colSpan = 1 } = cell;
    // console.log("memoizedOverlay",selectedCells, colSpan, rowSpan);

    var hasSpan = rowSpan + colSpan > 2; // 是否选中了多个单元格，选中了多个单元格后拆分单元格不能使用

    var canMergeCell = selectedCells.length > 1;
    var canSplitCell = selectedCells.length === 1 && hasSpan;
    return _react["default"].createElement(_rcMenu["default"], {
      style: {
        width: 120
      },
      onClick: function onClick(_ref3) {
        var key = _ref3.key;
        // console.log("key", key, actions);
        actions[key](cell);
      }
    }, _react["default"].createElement(_rcMenu.MenuItem, {
      key: "merge",
      disabled: !canMergeCell
    }, "\u5408\u5E76\u5355\u5143\u683C"), _react["default"].createElement(_rcMenu.MenuItem, {
      key: "split",
      disabled: !canSplitCell
    }, "\u62C6\u5206\u5355\u5143\u683C"), _react["default"].createElement(_rcMenu.Divider, {
      key: "d1"
    }), _react["default"].createElement(_rcMenu.MenuItem, {
      key: "addrow"
    }, "\u6DFB\u52A0\u884C"), _react["default"].createElement(_rcMenu.MenuItem, {
      key: "delrow"
    }, "\u5220\u9664\u884C"), _react["default"].createElement(_rcMenu.Divider, {
      key: "d2"
    }), _react["default"].createElement(_rcMenu.MenuItem, {
      key: "addcol"
    }, "\u6DFB\u52A0\u5217"), _react["default"].createElement(_rcMenu.MenuItem, {
      key: "delcol"
    }, "\u5220\u9664\u5217"), _react["default"].createElement(_rcMenu.Divider, {
      key: "d3"
    }), _react["default"].createElement(_rcMenu.MenuItem, {
      key: "clean"
    }, "\u6E05\u7A7A\u9009\u62E9"));
  }, [actions, selectedCells, data]);
  var memoizedIsPlaceholder = (0, _react.useCallback)(function (row, col) {
    return getIsPlaceholder(row, col, mergeds); // const deps = [row, col, mergeds];
    // return useMemo(() => getIsPlaceholder(row, col, mergeds), deps);
  }, [mergeds]); // console.log("selectedRange", selection, selectedCells);

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
  return _react["default"].createElement("div", _extends({}, rest, {
    className: (0, _classnames["default"])("mergeable-table-component", rest.className)
  }), _react["default"].createElement("table", {
    className: "mergeable-table"
  }, showHeader && _react["default"].createElement("thead", null, _react["default"].createElement("tr", null, cols.map(function (col) {
    return _react["default"].createElement("th", {
      key: col
    }, (0, _helper.getHeadChar)(col));
  }))), _react["default"].createElement(_rcDropdown["default"], {
    overlay: memoizedOverlay,
    trigger: ["contextMenu"],
    animation: "slide-up",
    alignPoint: true
  }, _react["default"].createElement("tbody", null, rows.map(function (i) {
    return _react["default"].createElement("tr", {
      key: i
    }, cols.map(function (j) {
      var cell = memoizedCell(i, j);
      var isPlaceholder = memoizedIsPlaceholder(i, j); // 占位单元格不渲染

      if (isPlaceholder) return null;
      var _cell$colSpan = cell.colSpan,
          colSpan = _cell$colSpan === void 0 ? 1 : _cell$colSpan,
          _cell$rowSpan = cell.rowSpan,
          rowSpan = _cell$rowSpan === void 0 ? 1 : _cell$rowSpan;
      var selected = memoizedIsSelected(i, j);

      var _onCellMouseLeftDown = onCellMouseLeftDown(i, j); // console.log("children: cell.children,", colSpan, rowSpan);


      var colWidth = getWidth((data.style || {})[j]);
      var colStyle = colWidth ? {
        width: colWidth
      } : {};
      return _react["default"].createElement("td", _extends({
        style: _extends({}, colStyle),
        "data-id": "".concat(i, "-").concat(j),
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

          if (selected && e.button === _helper.BUTTON_CODE.RIGHT) return;

          _onCellMouseLeftDown(e);
        }
      }), cell && cell.render && cell.render(cell));
    }));
  })))));
}

var Uncontrolled = function Uncontrolled(_a) {
  var defaultValue = _a.defaultValue,
      onChange = _a.onChange,
      rest = __rest(_a, ["defaultValue", "onChange"]);

  var _useState = (0, _react.useState)(defaultValue),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var _onChange = (0, _react.useCallback)(function (e) {
    setValue(e);
    onChange && onChange(e);
  }, [onChange]);

  return _react["default"].createElement(MergeableTable, _extends({}, rest, {
    value: value,
    onChange: _onChange
  }));
};

var _default = _react["default"].forwardRef(function (_a, ref) {
  var value = _a.value,
      rest = __rest(_a, ["value"]);

  if (value === undefined) return _react["default"].createElement(Uncontrolled, _extends({}, rest, {
    forwardedRef: ref
  }));
  return _react["default"].createElement(MergeableTable, {
    showHeader: false,
    value: value,
    forwardedRef: ref
  });
});

exports["default"] = _default;