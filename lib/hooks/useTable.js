"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("antd/lib/menu/style");

var _menu = _interopRequireDefault(require("antd/lib/menu"));

var _react = _interopRequireWildcard(require("react"));

var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));

var _utils = require("../utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useTable = function useTable(config, onChange) {
  var _useState = (0, _react.useState)(_utils.MOUSE.UP),
      _useState2 = _slicedToArray(_useState, 2),
      mouse = _useState2[0],
      setMouse = _useState2[1]; // 鼠标单击状态


  var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      selection = _useState4[0],
      setSelection = _useState4[1]; // 选择的开始单元格和结束单元格


  var _useState5 = (0, _react.useState)({}),
      _useState6 = _slicedToArray(_useState5, 2),
      selectedCells = _useState6[0],
      setSelectedCells = _useState6[1]; // 选中的要高亮的单元格


  var _useState7 = (0, _react.useState)([]),
      _useState8 = _slicedToArray(_useState7, 2),
      range = _useState8[0],
      setRange = _useState8[1]; // 选中的最大区域


  var _useMemo = (0, _react.useMemo)(function () {
    // 获取合并单元格和占位单元格
    return (0, _utils.getMergedPlace)(config.elements);
  }, [config]),
      memoizedPlaceCells = _useMemo.place,
      memoizedMergedCells = _useMemo.merged;

  var onCellMouseLeftDown = (0, _react.useCallback)(function (i, j) {
    return function () {
      // e.preventDefault();
      var _getCellRange = (0, _utils.getCellRange)([i, j], memoizedMergedCells, memoizedPlaceCells),
          _getCellRange2 = _slicedToArray(_getCellRange, 4),
          a = _getCellRange2[0],
          b = _getCellRange2[1],
          c = _getCellRange2[2],
          d = _getCellRange2[3];

      setSelectedCells((0, _utils.range2Cells)([i, j]));
      setSelection(function () {
        return [[i, j]];
      });
      setRange([[a, b], [c, d]]);
      setMouse(1);
    };
  }, [memoizedMergedCells, memoizedPlaceCells]);

  var onCellMouseUp = function onCellMouseUp(e) {
    setMouse(0);
  };

  var onCellMouseOver = (0, _react.useCallback)(function (i, j) {
    return function (_e) {
      if (mouse !== 1) return false; // 已经选中了，跳过

      var _selection = _slicedToArray(selection, 1),
          _selection$ = _slicedToArray(_selection[0], 2),
          m = _selection$[0],
          n = _selection$[1];

      if (m === i && n === j) return false; // 注意：单元有可能已经合并过

      var next = [[m, n], [i, j]];

      var maxRange = _utils.getRange.apply(void 0, next.concat([memoizedMergedCells, memoizedPlaceCells]));

      setSelection(next);
      setRange(maxRange);
      setSelectedCells(_utils.range2Cells.apply(void 0, _toConsumableArray(maxRange))); // console.log('onCellMouseOver', maxRange, next);
    };
  }, [memoizedPlaceCells, memoizedMergedCells, mouse, selection]); // 合并单元格

  var onMergeCell = (0, _react.useCallback)(function () {
    // console.log('onMergeCell', range);
    if (range.length < 1) return;

    var _range = _slicedToArray(range, 2),
        cell1 = _range[0],
        cell2 = _range[1];

    if (!cell2) return;

    var _cell = _slicedToArray(cell1, 2),
        row1 = _cell[0],
        col1 = _cell[1];

    var _cell2 = _slicedToArray(cell2, 2),
        row2 = _cell2[0],
        col2 = _cell2[1];

    var rowSpan = Math.abs(row1 - row2);
    var colSpan = Math.abs(col1 - col2);
    /**
     * 合并后，如果的目标单元格，没有在 data 中，则插入一条数据，记录单元格的合并情况
     *  同时，被合并的单元格，如果在 data 中有数据则要删除
     */

    var nextData = config.elements.filter(function (m) {
      return m.row < row1 || m.row > row2 || m.col < col1 || m.col > col2 || m.row === row1 && m.col === col1;
    });
    var index = nextData.findIndex(function (m) {
      return m.row === row1 && m.col === col1;
    }); // console.log('onMergeCell', index, cell1, cell2, nextData);

    var command = index > -1 ? _defineProperty({}, index, {
      $merge: _extends(_extends({}, rowSpan >= 1 ? {
        rowSpan: rowSpan + 1
      } : {}), colSpan >= 1 ? {
        colSpan: colSpan + 1
      } : {})
    }) : {
      // 目标单元格，没有在 data 中，插入一条数据
      $push: [_extends(_extends({
        key: [row1, col1].join('_'),
        row: row1,
        col: col1
      }, rowSpan >= 1 ? {
        rowSpan: rowSpan + 1
      } : {}), colSpan >= 1 ? {
        colSpan: colSpan + 1
      } : {})]
    };

    var changedValue = _extends(_extends({}, config), {
      elements: (0, _immutabilityHelper["default"])(nextData, command)
    });

    onChange && onChange(changedValue); // setState(prev => ({ ...prev, elements: update(nextData, command) }));

    setSelectedCells([]);
    setSelection([]);
    setRange([]); // console.log('onMergeCell', config, changedValue);
  }, [config, range]); // 拆分单元格

  var onSplitCell = (0, _react.useCallback)(function (cell) {
    // console.log('onSplitCell', range);
    var _cell$rowSpan = cell.rowSpan,
        rowSpan = _cell$rowSpan === void 0 ? 1 : _cell$rowSpan,
        _cell$colSpan = cell.colSpan,
        colSpan = _cell$colSpan === void 0 ? 1 : _cell$colSpan,
        row = cell.row,
        col = cell.col;
    if (rowSpan <= 1 && colSpan <= 1) return;
    var index = config.elements.findIndex(function (m) {
      return m.row === row && m.col === col;
    }); // console.log('onSplitCell', rowSpan, colSpan);

    var command = _defineProperty({}, index, {
      $merge: {
        rowSpan: undefined,
        colSpan: undefined
      }
    });

    onChange && onChange(_extends(_extends({}, config), {
      elements: (0, _immutabilityHelper["default"])(config.elements, command)
    })); // onChange(prev => ({ ...prev, elements: update(prev.elements, command) }));

    setSelectedCells([]);
    setSelection([]);
    setRange([]); // setSelection([[row, col], [row + rowSpan - 1, col + colSpan - 1]]);
  }, [config, range]); // 添加行，既向选中的单元格下方添加一行

  var onAddRow = (0, _react.useCallback)(function () {
    console.log('onAddRow', range); // 没有选中区域，返回

    if (range.length < 1) return;
    /**
     * 执行 rows+1；同时要把 data 中，当前后的数据的 row +1;
     */

    var _range2 = _slicedToArray(range, 2),
        _range2$ = _slicedToArray(_range2[1], 1),
        row = _range2$[0]; // console.log('onAddRow', range, row);


    var command = {
      $apply: function $apply(data) {
        return data.map(function (item) {
          // 当前后的数据的 row + 1;
          if (item.row <= row) return item;
          return _extends(_extends({}, item), {
            row: item.row + 1
          });
        });
      }
    };
    onChange && onChange(_extends(_extends({}, config), {
      rows: config.rows + 1,
      elements: (0, _immutabilityHelper["default"])(config.elements, command)
    }));
  }, [config, range]); // 添加列，既向选中的单元格右侧添加一列

  var onAddCol = (0, _react.useCallback)(function () {
    // 没有选中区域，返回
    if (range.length < 1) return;
    /**
     * 执行 rows+1；同时要把 data 中，当前后的数据的 row +1;
     */

    var _range3 = _slicedToArray(range, 1),
        _range3$ = _slicedToArray(_range3[0], 2),
        col = _range3$[1]; // console.log('onAddCol', range, col);


    var command = {
      $apply: function $apply(data) {
        return data.map(function (item) {
          // 当前后的数据的 col + 1;
          if (item.col <= col) return item;
          return _extends(_extends({}, item), {
            col: item.col + 1
          });
        });
      }
    };
    onChange && onChange(_extends(_extends({}, config), {
      cols: config.cols + 1,
      elements: (0, _immutabilityHelper["default"])(config.elements, command)
    }));
  }, [config, range]); // 移除选中的行

  var onDelRow = (0, _react.useCallback)(function () {
    // 没有选中区域，返回
    if (range.length < 1) return;
    /**
     * 执行 rows- rowSpan，移除 data 中相关数据，同时当前 row 后的数据的 row - rowSpan;
     */

    var _range4 = _slicedToArray(range, 2),
        _range4$ = _slicedToArray(_range4[0], 1),
        row1 = _range4$[0],
        _range4$2 = _slicedToArray(_range4[1], 1),
        row2 = _range4$2[0];

    var rowSpan = row2 - row1 + 1;
    var command = {
      $apply: function $apply(data) {
        return data.filter(function (m) {
          return m.row < row1 || m.row > row2;
        }).map(function (m) {
          return m.row < row2 ? m : _extends(_extends({}, m), {
            row: m.row - rowSpan
          });
        });
      }
    }; // setState(prev => ({
    //   ...prev,
    //   rows: prev.rows - rowSpan < 1 ? 1 : prev.rows - rowSpan,
    //   data: update(prev.data, command),
    // }));

    var rows = config.rows - rowSpan < 1 ? 1 : config.rows - rowSpan;
    onChange && onChange(_extends(_extends({}, config), {
      rows: rows,
      elements: (0, _immutabilityHelper["default"])(config.elements, command)
    }));
    setSelection([]);
    setSelectedCells([]); // console.log('onDelRow', row1, row2, rowSpan);
  }, [config, range]); // 删除选中的列

  var onDelCol = (0, _react.useCallback)(function () {
    // 没有选中区域，返回
    if (range.length < 1) return;
    /**
     * 执行 cols - colSpan ，移除 data 中相关数据，同时当前 col 后的数据的 col - colSpan;
     */

    var _range5 = _slicedToArray(range, 2),
        _range5$ = _slicedToArray(_range5[0], 2),
        col1 = _range5$[1],
        _range5$2 = _slicedToArray(_range5[1], 2),
        col2 = _range5$2[1];

    var colSpan = col2 - col1 + 1;
    var command = {
      $apply: function $apply(data) {
        return data.filter(function (m) {
          return m.col < col1 || m.col > col2;
        }) // 当前 col 后的数据的 col - colSpan
        .map(function (m) {
          return m.col < col2 ? m : _extends(_extends({}, m), {
            col: m.col - colSpan
          });
        });
      }
    };
    var cols = config.cols - colSpan < 1 ? 1 : config.cols - colSpan;
    onChange && onChange(_extends(_extends({}, config), {
      cols: cols,
      elements: (0, _immutabilityHelper["default"])(config.elements, command)
    }));
    setSelectedCells([]);
    setSelection([]);
  }, [config, range]); // 清楚选中

  var onClean = (0, _react.useCallback)(function () {
    setSelectedCells([]);
    setSelection([]);
    setRange([]);
  }, []);
  var actions = (0, _react.useMemo)(function () {
    // console.log('range', range);
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
  var getOverlay = (0, _react.useCallback)(function (cell) {
    var _cell$rowSpan2 = cell.rowSpan,
        rowSpan = _cell$rowSpan2 === void 0 ? 1 : _cell$rowSpan2,
        _cell$colSpan2 = cell.colSpan,
        colSpan = _cell$colSpan2 === void 0 ? 1 : _cell$colSpan2;
    var selectedMulti = selection.length > 1;
    var canSplit = !selectedMulti && rowSpan + colSpan > 3; // console.log('getOverlay', canSplit, cell, selection);

    return _react["default"].createElement(_menu["default"], {
      style: {
        width: 120
      },
      onClick: function onClick(_ref2) {
        var key = _ref2.key;
        console.log('key', key);
        actions[key](cell);
      }
    }, _react["default"].createElement(_menu["default"].Item, {
      key: "merge",
      disabled: !selectedMulti
    }, "\u5408\u5E76\u5355\u5143\u683C"), _react["default"].createElement(_menu["default"].Item, {
      key: "split",
      disabled: !canSplit
    }, "\u62C6\u5206\u5355\u5143\u683C"), _react["default"].createElement(_menu["default"].Divider, {
      key: "d1"
    }), _react["default"].createElement(_menu["default"].Item, {
      key: "addrow"
    }, "\u6DFB\u52A0\u884C"), _react["default"].createElement(_menu["default"].Item, {
      key: "delrow"
    }, "\u5220\u9664\u884C"), _react["default"].createElement(_menu["default"].Divider, {
      key: "d2"
    }), _react["default"].createElement(_menu["default"].Item, {
      key: "addcol"
    }, "\u6DFB\u52A0\u5217"), _react["default"].createElement(_menu["default"].Item, {
      key: "delcol"
    }, "\u5220\u9664\u5217"), _react["default"].createElement(_menu["default"].Divider, {
      key: "d3"
    }), _react["default"].createElement(_menu["default"].Item, {
      key: "clean"
    }, "\u6E05\u7A7A\u9009\u62E9"));
  }, [actions, selection]);
  return {
    mouse: mouse,
    selection: selection,
    selectedCells: selectedCells,
    range: range,
    getOverlay: getOverlay,
    memoizedPlaceCells: memoizedPlaceCells,
    memoizedMergedCells: memoizedMergedCells,
    onCellMouseLeftDown: onCellMouseLeftDown,
    onCellMouseOver: onCellMouseOver,
    onCellMouseUp: onCellMouseUp,
    onMergeCell: onMergeCell,
    onSplitCell: onSplitCell,
    onAddRow: onAddRow,
    onDelRow: onDelRow,
    onDelCol: onDelCol,
    onAddCol: onAddCol,
    onClean: onClean
  };
};

var _default = useTable;
exports["default"] = _default;