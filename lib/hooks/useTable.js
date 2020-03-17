"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _immutabilityHelper = _interopRequireDefault(require("immutability-helper"));

var _helper = require("../helper");

var _index = require("../index.d");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * 获取已合并单元格和占位单元格
 * @param elements
 */
function getMergeds(elements) {
  return elements.filter(function (m) {
    return (m.colSpan || 1) + (m.rowSpan || 1) > 2;
  }).map(function (_ref) {
    var row = _ref.row,
        col = _ref.col,
        _ref$rowSpan = _ref.rowSpan,
        rowSpan = _ref$rowSpan === void 0 ? 1 : _ref$rowSpan,
        _ref$colSpan = _ref.colSpan,
        colSpan = _ref$colSpan === void 0 ? 1 : _ref$colSpan;
    return [row, col, row + rowSpan - 1, col + colSpan - 1];
  });
}

function getCellRange(cell, mergeds) {
  var _cell = _slicedToArray(cell, 2),
      row = _cell[0],
      col = _cell[1];

  var range = mergeds.find(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        r = _ref3[0],
        c = _ref3[1];

    return r == row && c === col;
  });
  return range ? range : [row, col, row, col];
}

function range2Cells(range, mergeds) {
  if (!range || !range.length) return []; // console.log("range2Cells", range);

  var _range = _slicedToArray(range, 4),
      r0 = _range[0],
      c0 = _range[1],
      r1 = _range[2],
      c1 = _range[3];

  var _ref4 = r0 < r1 ? [r0, r1] : [r1, r0],
      _ref5 = _slicedToArray(_ref4, 2),
      minRow = _ref5[0],
      maxRow = _ref5[1];

  var _ref6 = c0 < c1 ? [c0, c1] : [c1, c0],
      _ref7 = _slicedToArray(_ref6, 2),
      minCol = _ref7[0],
      maxCol = _ref7[1];

  var res = [];

  var _loop = function _loop(row) {
    var _loop2 = function _loop2(_col) {
      var match = mergeds.find(function (_ref8) {
        var _ref9 = _slicedToArray(_ref8, 4),
            row0 = _ref9[0],
            col0 = _ref9[1],
            row1 = _ref9[2],
            col1 = _ref9[3];

        return row >= row0 && row <= row1 && _col >= col0 && _col <= col1;
      }); // 如果单元格在合并的区域内，只 push 第一个单元格

      if (match) {
        // console.log("selectedCells-match", row, col);
        var _match = _slicedToArray(match, 4),
            row0 = _match[0],
            col0 = _match[1],
            r = _match[2],
            c = _match[3];

        if (row0 === row && col0 === _col) res.push([row, _col, r - row + 1, c - _col + 1]);
        _col = c;
      } else {
        res.push([row, _col]);
      }

      col = _col;
    };

    for (var col = minCol; col <= maxCol; col++) {
      _loop2(col);
    }
  };

  for (var row = minRow; row <= maxRow; row++) {
    _loop(row);
  }

  return res;
}

var useTable = function useTable(data, onChange) {
  var _useState = (0, _react.useState)(_index.MOUSE.UP),
      _useState2 = _slicedToArray(_useState, 2),
      mouse = _useState2[0],
      setMouse = _useState2[1]; // 鼠标单击状态


  var _useState3 = (0, _react.useState)({
    mergeds: []
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      state = _useState4[0],
      setState = _useState4[1];

  var _useState5 = (0, _react.useState)([]),
      _useState6 = _slicedToArray(_useState5, 2),
      selection = _useState6[0],
      setSelection = _useState6[1]; // 选中的开始单元格和结束单元格


  var _useState7 = (0, _react.useState)([]),
      _useState8 = _slicedToArray(_useState7, 2),
      selectedCells = _useState8[0],
      setSelectedCells = _useState8[1]; // 选中的要高亮的单元格


  var _useState9 = (0, _react.useState)([]),
      _useState10 = _slicedToArray(_useState9, 2),
      selectedRange = _useState10[0],
      setSelectedRange = _useState10[1]; // 当前选中的区域


  var mergeds = state.mergeds; // elements 发生变化，重新生成 mergeds、placeholders

  (0, _react.useEffect)(function () {
    var _mergeds = getMergeds(data.elements); // const _placeholders = mergeds2Placeholders(_mergeds);
    // console.log("reset-getMergeds");


    setState(function (prev) {
      return _extends(_extends({}, prev), {
        mergeds: _mergeds
      });
    });
  }, [data.elements]); // 选区发生变化=> 改变选中的单元格

  (0, _react.useEffect)(function () {
    // console.log("selectedCells", { selectedRange, selectedCells });
    // if (!selectedRange.length) return;
    setSelectedCells(selectedRange.length ? range2Cells(selectedRange, mergeds) : []);
  }, [selectedRange, mergeds]);
  var onCellMouseLeftDown = (0, _react.useCallback)(function (i, j) {
    return function (_e) {
      // 鼠标点击后，确定开始坐标
      // console.log("onCellMouseLeftDown", i, j);
      var startRange = getCellRange([i, j], mergeds);
      setSelection(function () {
        return [i, j];
      });
      setSelectedRange(startRange);
      setMouse(_index.MOUSE.DOWN);
    };
  }, [mergeds]); // console.log("selectedCells", { selectedRange, selectedCells });

  var onCellMouseOver = (0, _react.useCallback)(function (r1, c1) {
    return function () {
      //
      if (mouse !== _index.MOUSE.DOWN) return false;
      if (!selection.length) return false;

      var _selection = _slicedToArray(selection, 2),
          r0 = _selection[0],
          c0 = _selection[1]; // 比较大小，避免从右到左选择合并不对的情况


      var _ref10 = r0 < r1 ? [r0, r1] : [r1, r0],
          _ref11 = _slicedToArray(_ref10, 2),
          row0 = _ref11[0],
          row1 = _ref11[1];

      var _ref12 = c0 < c1 ? [c0, c1] : [c1, c0],
          _ref13 = _slicedToArray(_ref12, 2),
          col0 = _ref13[0],
          col1 = _ref13[1]; // 同一个选中的局域返回


      if (r0 === r1 && c0 === c1) return;
      var nextRange = (0, _helper.getMaxRange)([row0, col0, row1, col1], mergeds);
      setSelectedRange(nextRange);
      setSelection([r0, c0, row1, col1]); // setSelectedCells(range2Cells(nextRange));
    };
  }, [mergeds, mouse, selection]);

  var onCellMouseUp = function onCellMouseUp() {
    return setMouse(_index.MOUSE.UP);
  }; // 合并单元格


  var onMergeCell = (0, _react.useCallback)(function () {
    if (selectedRange.length != 4) return;

    var _selectedRange = _slicedToArray(selectedRange, 4),
        r0 = _selectedRange[0],
        c0 = _selectedRange[1],
        r1 = _selectedRange[2],
        c1 = _selectedRange[3];

    var _ref14 = r0 < r1 ? [r0, r1] : [r1, r0],
        _ref15 = _slicedToArray(_ref14, 2),
        row0 = _ref15[0],
        row1 = _ref15[1];

    var _ref16 = c0 < c1 ? [c0, c1] : [c1, c0],
        _ref17 = _slicedToArray(_ref16, 2),
        col0 = _ref17[0],
        col1 = _ref17[1];

    var rowSpan = row1 - row0;
    var colSpan = col1 - col0;
    /**
     * 合并后，如果的目标单元格，没有在 data 中，则插入一条数据，记录单元格的合并情况
     *  同时，被合并的单元格，如果在 data 中有数据则要删除
     */
    // console.log("onMergeCell", row0, row1, rowSpan, colSpan);
    // 删除合并范围内的单元格

    var nextData = data.elements.filter(function (_ref18) {
      var row = _ref18.row,
          col = _ref18.col;
      return row < row0 || row > row1 || col < col0 || col > col1 || row === row0 && col === col0;
    });
    var i = nextData.findIndex(function (m) {
      return m.row === row0 && m.col === col0;
    }); // 更新 rowSpan、colSpan

    var next = _extends(_extends({}, rowSpan >= 1 ? {
      rowSpan: rowSpan + 1
    } : {}), colSpan >= 1 ? {
      colSpan: colSpan + 1
    } : {}); // 目标单元格，已经存在，更新 rowSpan、colSpan


    var command = i > -1 ? _defineProperty({}, i, {
      $merge: next
    }) : {
      // 目标单元格，没有在 data 中，插入一条数据
      $push: [_extends({
        row: row0,
        col: col0
      }, next)]
    };

    var changedValue = _extends(_extends({}, data), {
      elements: (0, _immutabilityHelper["default"])(nextData, command)
    });

    onChange && onChange(changedValue);
    setSelection([]);
    setSelectedRange([]);
  }, [data, selectedRange]); // console.log("onSplitCell", data.elements);
  // 拆分单元格

  var onSplitCell = (0, _react.useCallback)(function () {
    var _selectedRange2 = _slicedToArray(selectedRange, 2),
        row = _selectedRange2[0],
        col = _selectedRange2[1];

    var index = data.elements.findIndex(function (m) {
      return m.row === row && m.col === col;
    });
    if (index < 0) return;
    var _data$elements$index = data.elements[index],
        _data$elements$index$ = _data$elements$index.rowSpan,
        rowSpan = _data$elements$index$ === void 0 ? 1 : _data$elements$index$,
        _data$elements$index$2 = _data$elements$index.colSpan,
        colSpan = _data$elements$index$2 === void 0 ? 1 : _data$elements$index$2;
    if (rowSpan <= 1 && colSpan <= 1) return;

    var changedValue = _extends(_extends({}, data), {
      elements: (0, _immutabilityHelper["default"])(data.elements, _defineProperty({}, index, {
        $merge: {
          rowSpan: 1,
          colSpan: 1
        }
      }))
    });

    onChange && onChange(changedValue);
    setSelection([]);
    setSelectedRange([]);
  }, [data, selectedRange]); // console.log("selection", data.elements);
  // 添加行，从选区最小的行上方添加一行

  var onAddRow = (0, _react.useCallback)(function () {
    // console.log("onAddRow", selectedRange);
    // 没有选中区域，返回
    if (selectedRange.length <= 0) return;
    /**
     * 执行data.rows + 1；同时要把 data.elements 中，当前后行及行后的数据的 row + 1;
     */

    var _selectedRange3 = _slicedToArray(selectedRange, 1),
        row = _selectedRange3[0];

    if (row === undefined) return; // console.log("onAddRow", selectedRange, row);

    var changedValue = _extends(_extends({}, data), {
      rows: data.rows + 1,
      elements: data.elements.map(function (item) {
        // 当前后的数据的 row + 1;
        if (item.row < row) return item;
        return _extends(_extends({}, item), {
          row: item.row + 1
        });
      })
    });

    setSelectedRange([]);
    onChange && onChange(changedValue);
  }, [data, selectedRange]); // 添加列，既向选中的单元格左侧添加一列

  var onAddCol = (0, _react.useCallback)(function () {
    // 没有选中区域，返回
    if (selectedRange.length < 1) return;
    /**
     * 执行 cols + 1；同时要把 data.elements 中，当前后行及行后的数据的 col + 1;
     */

    var _selectedRange4 = _slicedToArray(selectedRange, 2),
        col = _selectedRange4[1];

    if (col === undefined) return;

    var changedValue = _extends(_extends({}, data), {
      cols: data.cols + 1,
      elements: data.elements.map(function (item) {
        // 当前后的数据的 row + 1;
        if (item.col < col) return item;
        return _extends(_extends({}, item), {
          col: item.col + 1
        });
      })
    });

    setSelectedRange([]);
    onChange && onChange(changedValue);
  }, [data, selectedRange]); // 删除选中的行

  var onDelRow = (0, _react.useCallback)(function () {
    // 没有选中区域，返回
    if (selectedRange.length < 1) return;
    /**
     * 执行 rows- rowSpan，移除 data 中相关数据，同时当前 row 后的数据的 row - rowSpan;
     */

    var _selectedRange5 = _slicedToArray(selectedRange, 3),
        row0 = _selectedRange5[0],
        row1 = _selectedRange5[2];

    if (row0 === undefined || row1 === undefined) return;
    var rowSpan = row1 - row0 + 1;

    var changedValue = _extends(_extends({}, data), {
      rows: data.rows - rowSpan <= 0 ? 1 : data.rows - rowSpan,
      elements: data.elements.filter(function (m) {
        return m.row < row0 || m.row > row1;
      }).map(function (m) {
        return m.row < row0 ? m : _extends(_extends({}, m), {
          row: m.row - rowSpan
        });
      })
    });

    onChange && onChange(changedValue);
    setSelection([]);
    setSelectedRange([]);
  }, [data, selectedRange]); // 删除选中的列

  var onDelCol = (0, _react.useCallback)(function () {
    // 没有选中区域，返回
    if (selectedRange.length < 1) return;
    /**
     * 执行 cols - colSpan ，移除 data 中相关数据，同时当前 col 后的数据的 col - colSpan;
     */

    var _selectedRange6 = _slicedToArray(selectedRange, 4),
        col0 = _selectedRange6[1],
        col1 = _selectedRange6[3];

    if (col0 === undefined || col1 === undefined) return;
    var colSpan = col1 - col0 + 1;

    var changedValue = _extends(_extends({}, data), {
      cols: data.cols - colSpan <= 0 ? 1 : data.cols - colSpan,
      elements: data.elements.filter(function (m) {
        return m.col < col0 || m.col > col1;
      }).map(function (m) {
        return m.col < col0 ? m : _extends(_extends({}, m), {
          col: m.col - colSpan
        });
      })
    });

    onChange && onChange(changedValue);
    setSelection([]);
  }, [data, selectedRange]); // 清楚选中

  var onClean = (0, _react.useCallback)(function () {
    setSelection([]);
    setSelectedRange([]);
  }, []);
  return {
    mouse: mouse,
    mergeds: mergeds,
    selection: selection,
    selectedCells: selectedCells,
    selectedRange: selectedRange,
    onCellMouseLeftDown: onCellMouseLeftDown,
    onCellMouseOver: onCellMouseOver,
    onCellMouseUp: onCellMouseUp,
    onMergeCell: onMergeCell,
    onSplitCell: onSplitCell,
    onAddRow: onAddRow,
    onAddCol: onAddCol,
    onDelRow: onDelRow,
    onDelCol: onDelCol,
    onClean: onClean
  };
};

var _default = useTable;
exports["default"] = _default;