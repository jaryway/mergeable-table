function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

import React, { useState, useCallback, useMemo } from "react";
import classnames from "classnames";
import Dropdown from "rc-dropdown";
import Menu, { MenuItem, Divider } from "rc-menu";
import useTable from "./hooks/useTable";
import { getHeadChar, BUTTON_CODE } from "./helper";
import "rc-dropdown/assets/index.css";
import "./style";

var getWidth = function getWidth(v) {
  return isNaN(Number(v)) ? v : "".concat(Number(v), "px");
};

function getIsPlaceholder(row, col, mergeds) {
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

  var _useTable = useTable(data, onChange),
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

  var actions = useMemo(function () {
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
  var memoizedCell = useCallback(function (r, c) {
    return data.elements.find(function (m) {
      return m.row === r && m.col === c;
    }) || {};
  }, [data.elements]);
  var memoizedIsSelected = useCallback(function (r, c) {
    return selectedCells.some(function (m) {
      return m[0] === r && m[1] === c;
    });
  }, [selectedCells]);
  var memoizedOverlay = useMemo(function () {
    if (!selectedCells.length) return React.createElement("div", null);
    if (!data) return React.createElement("div", null);

    var _selectedCells = _slicedToArray(selectedCells, 1),
        _selectedCells$ = _slicedToArray(_selectedCells[0], 4),
        row = _selectedCells$[0],
        col = _selectedCells$[1],
        _selectedCells$$ = _selectedCells$[2],
        rowSpan = _selectedCells$$ === void 0 ? 1 : _selectedCells$$,
        _selectedCells$$2 = _selectedCells$[3],
        colSpan = _selectedCells$$2 === void 0 ? 1 : _selectedCells$$2;

    var cell = memoizedCell(row, col);
    var hasSpan = rowSpan + colSpan > 2;
    var canMergeCell = selectedCells.length > 1;
    var canSplitCell = selectedCells.length === 1 && hasSpan;
    return React.createElement(Menu, {
      style: {
        width: 120
      },
      onClick: function onClick(_ref3) {
        var key = _ref3.key;
        actions[key](cell);
      }
    }, React.createElement(MenuItem, {
      key: "merge",
      disabled: !canMergeCell
    }, "\u5408\u5E76\u5355\u5143\u683C"), React.createElement(MenuItem, {
      key: "split",
      disabled: !canSplitCell
    }, "\u62C6\u5206\u5355\u5143\u683C"), React.createElement(Divider, {
      key: "d1"
    }), React.createElement(MenuItem, {
      key: "addrow"
    }, "\u6DFB\u52A0\u884C"), React.createElement(MenuItem, {
      key: "delrow"
    }, "\u5220\u9664\u884C"), React.createElement(Divider, {
      key: "d2"
    }), React.createElement(MenuItem, {
      key: "addcol"
    }, "\u6DFB\u52A0\u5217"), React.createElement(MenuItem, {
      key: "delcol"
    }, "\u5220\u9664\u5217"), React.createElement(Divider, {
      key: "d3"
    }), React.createElement(MenuItem, {
      key: "clean"
    }, "\u6E05\u7A7A\u9009\u62E9"));
  }, [actions, selectedCells, data]);
  var memoizedIsPlaceholder = useCallback(function (row, col) {
    return getIsPlaceholder(row, col, mergeds);
  }, [mergeds]);
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
  return React.createElement("div", _extends({}, rest, {
    className: classnames("mergeable-table-component", rest.className)
  }), React.createElement("table", {
    className: "mergeable-table"
  }, showHeader && React.createElement("thead", null, React.createElement("tr", null, cols.map(function (col) {
    return React.createElement("th", {
      key: col
    }, getHeadChar(col));
  }))), React.createElement(Dropdown, {
    overlay: memoizedOverlay,
    trigger: ["contextMenu"],
    animation: "slide-up",
    alignPoint: true
  }, React.createElement("tbody", null, rows.map(function (i) {
    return React.createElement("tr", {
      key: i
    }, cols.map(function (j) {
      var cell = memoizedCell(i, j);
      var isPlaceholder = memoizedIsPlaceholder(i, j);
      if (isPlaceholder) return null;
      var _cell$colSpan = cell.colSpan,
          colSpan = _cell$colSpan === void 0 ? 1 : _cell$colSpan,
          _cell$rowSpan = cell.rowSpan,
          rowSpan = _cell$rowSpan === void 0 ? 1 : _cell$rowSpan;
      var selected = memoizedIsSelected(i, j);

      var _onCellMouseLeftDown = onCellMouseLeftDown(i, j);

      var colWidth = getWidth((data.style || {})[j]);
      var colStyle = colWidth ? {
        width: colWidth
      } : {};
      return React.createElement("td", _extends({
        style: _extends({}, colStyle),
        "data-id": "".concat(i, "-").concat(j),
        key: "".concat(i, "-").concat(j),
        className: classnames({
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
          e.stopPropagation();
          if (selected && e.button === BUTTON_CODE.RIGHT) return;

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

  var _useState = useState(defaultValue),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var _onChange = useCallback(function (e) {
    setValue(e);
    onChange && onChange(e);
  }, [onChange]);

  return React.createElement(MergeableTable, _extends({}, rest, {
    value: value,
    onChange: _onChange
  }));
};

export default React.forwardRef(function (_a, ref) {
  var value = _a.value,
      rest = __rest(_a, ["value"]);

  if (value === undefined) return React.createElement(Uncontrolled, _extends({}, rest, {
    forwardedRef: ref
  }));
  return React.createElement(MergeableTable, _extends({}, rest, {
    value: value,
    forwardedRef: ref
  }));
});