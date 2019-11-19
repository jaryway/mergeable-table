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

export function getSpan(input) {
  if (input === null || input === undefined || input <= 1) return 1;
  return Number(input);
}
export function getKey(row, col) {
  return [row, col].join('_');
}
export function getHeadChar(index) {
  var letters = 'ABCDEFGHIJKLMNOPQRSTYVWXYZ'.split(''); // 28 => AC

  var times = Math.floor(index / letters.length);
  var res = letters[index % letters.length];
  if (times > 0) return getHeadChar(times - 1) + res;
  return res;
}
/**
 *
 * @param {Point} cell1 选区坐标点
 * @param {Point} cell2 选区坐标点
 */

export function range2Cells(cell1, cell2) {
  var _ref = cell1 || [],
      _ref2 = _slicedToArray(_ref, 2),
      row1 = _ref2[0],
      col1 = _ref2[1];

  var _ref3 = cell2 || [],
      _ref4 = _slicedToArray(_ref3, 2),
      row2 = _ref4[0],
      col2 = _ref4[1];

  var res = {}; // console.log('range2Cells', row2, col2);

  if (!cell2) {
    res[getKey(row1, col1)] = 1;
    return res;
  }

  var minRow = Math.min(row1, row2);
  var maxRow = Math.max(row1, row2);
  var minCol = Math.min(col1, col2);
  var maxCol = Math.max(col1, col2);

  for (var i = minRow; i <= maxRow; i++) {
    for (var j = minCol; j <= maxCol; j++) {
      res[getKey(i, j)] = 1;
    }
  }

  return res;
}
export function getLineCells(cell1, cell2) {
  var mergedCells = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var placeCells = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  // console.log('getLineCells', cell1, cell2, mergedCells, placeCells);
  // 两个对角单元格的最大区域
  var _getCellsRange = getCellsRange(cell1, cell2, mergedCells, placeCells),
      _getCellsRange2 = _slicedToArray(_getCellsRange, 4),
      minRow = _getCellsRange2[0],
      minCol = _getCellsRange2[1],
      maxRow = _getCellsRange2[2],
      maxCol = _getCellsRange2[3];

  return [[minRow, minCol], [minRow, maxCol], [maxRow, maxCol], [maxRow, minCol]].reduce(function (prev, current, index, arr) {
    var even = (index + 1) % 2 === 0; // 偶数

    var next = arr[index < arr.length - 1 ? index + 1 : 0];
    var res = [current];

    var _current = _slicedToArray(current, 2),
        rowIndex = _current[0],
        colIndex = _current[1]; // 偶数，移动 row， 奇数移动 cell


    var len = even ? rowIndex - next[0] : colIndex - next[1];

    for (var i = 1; i < Math.abs(len); i++) {
      res.push(even ? [rowIndex + (len < 0 ? +i : -i), colIndex] : [rowIndex, colIndex + (len < 0 ? +i : -i)]);
    }

    return [].concat(_toConsumableArray(prev), res);
  }, []);
}
/**
 * helper methods
 */
// 根据两个选定的单元格，获取选中的区域

/**
 *
 * @param {Object} cell1 {row,col,r,c,rowSpan,colSpan}
 * @param {Object} cell2 {row,col,r,c,rowSpan,colSpan}
 * @param {Object} mergedCells
 * @param {Object} placeCells
 */

export function getRange(cell1, cell2) {
  var mergedCells = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var placeCells = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  // console.log('getRange', JSON.stringify({ cell1, cell2 }));

  /**
   * 原理：
   * 两个坐标组成一个区域，依次沿着该区域的四条边查找是否有空白单元格（有空白单元格，表示该单元格被合并了），
   * 若找到空白单元格，找到实际合并的单元格，拿到它的 colSpan 、rowSpan，并重新计算选中的单元格
   */
  var _cell = _slicedToArray(cell1, 2),
      row1 = _cell[0],
      col1 = _cell[1];

  var _cell2 = _slicedToArray(cell2, 2),
      row2 = _cell2[0],
      col2 = _cell2[1];

  var minRow = Math.min(row1, row2);
  var maxRow = Math.max(row1, row2);
  var minCol = Math.min(col1, col2);
  var maxCol = Math.max(col1, col2); // 得到四条边上的单元格

  var lineCells = getLineCells(cell1, cell2, mergedCells, placeCells); // console.log('lineCells', lineCells);

  var rangeHasChanged = false; // 轮询四条边上的单元格，找到最大范围

  for (var i = 0; i < lineCells.length; i++) {
    var cell = lineCells[i]; // console.log('lineCells-for ', lineCells);

    var _getCellRange = getCellRange(cell, mergedCells, placeCells),
        _getCellRange2 = _slicedToArray(_getCellRange, 4),
        row = _getCellRange2[0],
        col = _getCellRange2[1],
        _row = _getCellRange2[2],
        _col = _getCellRange2[3]; // console.log('getCellRange', cell, row, col, _row, _col);


    var _minRow = Math.min(row, _row, minRow);

    var _minCol = Math.min(col, _col, minCol);

    var _maxRow = Math.max(row, _row, maxRow);

    var _maxCol = Math.max(col, _col, maxCol); // console.log('getCellRange', cell, row, col, _row, _col);


    if (_minRow !== minRow || _minCol !== minCol || _maxRow !== maxRow || _maxCol !== maxCol) {
      rangeHasChanged = true;
      minRow = _minRow;
      minCol = _minCol;
      maxRow = _maxRow;
      maxCol = _maxCol;
      break;
    }
  }

  if (rangeHasChanged) {
    return getRange([minRow, minCol], [maxRow, maxCol], mergedCells, placeCells);
  } // console.log('getRange', [[minRow, minCol], [maxRow, maxCol]]);


  return [[minRow, minCol], [maxRow, maxCol]];
}
/**
 * 获取合并单元格和占位单元格
 * @param {Object} data table 数据
 */

export function getMergedPlace(data) {
  // console.log('getMergedPlace', data);
  // console.time('getMergedPlace');
  var res = data.reduce(function (prev, _ref5) {
    var r = _ref5.row,
        c = _ref5.col,
        rSpan = _ref5.rowSpan,
        cSpan = _ref5.colSpan;
    var rowSpan = getSpan(rSpan);
    var colSpan = getSpan(cSpan); // 计算 colSpan 大于 1 的情况

    for (var i = 1; i < colSpan; i++) {
      for (var j = 0; j < rowSpan; j++) {
        var row = r + j,
            col = c + i;
        prev.place = _extends(_extends({}, prev.place), _defineProperty({}, getKey(row, col), {
          row: row,
          col: col,
          r: r,
          c: c,
          colSpan: colSpan,
          rowSpan: rowSpan
        }));
      }
    } // 计算 rowSpan 大于 1 的情况


    for (var _i2 = 1; _i2 < rowSpan; _i2++) {
      for (var _j = 0; _j < colSpan; _j++) {
        var _row3 = r + _i2,
            _col3 = c + _j;

        prev.place = _extends(_extends({}, prev.place), _defineProperty({}, getKey(_row3, _col3), {
          row: _row3,
          col: _col3,
          r: r,
          c: c,
          colSpan: colSpan,
          rowSpan: rowSpan
        }));
      }
    }

    if (rowSpan > 1 || colSpan > 1) {
      prev.merged = _extends(_extends({}, prev.merged), _defineProperty({}, getKey(r, c), {
        row: r,
        col: c,
        rowSpan: rowSpan,
        colSpan: colSpan
      }));
    }

    return prev;
  }, {
    place: {},
    merged: {}
  }); // console.timeEnd('getMergedPlace');

  return res;
}
export function getCellsRange(cell1, cell2) {
  var mergedCells = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var placeCells = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  // console.log('getCellsRange', cell1, cell2, mergedCells, placeCells);
  var _getCellRange3 = getCellRange(cell1, mergedCells, placeCells),
      _getCellRange4 = _slicedToArray(_getCellRange3, 4),
      row1 = _getCellRange4[0],
      col1 = _getCellRange4[1],
      _row1 = _getCellRange4[2],
      _col1 = _getCellRange4[3];

  var _getCellRange5 = getCellRange(cell2, mergedCells, placeCells),
      _getCellRange6 = _slicedToArray(_getCellRange5, 4),
      row2 = _getCellRange6[0],
      col2 = _getCellRange6[1],
      _row2 = _getCellRange6[2],
      _col2 = _getCellRange6[3]; // 如果当前单元格已经合并过


  var minRow = Math.min(row1, row2, _row1, _row2);
  var maxRow = Math.max(row1, row2, _row1, _row2);
  var minCol = Math.min(col1, col2, _col1, _col2);
  var maxCol = Math.max(col1, col2, _col1, _col2);
  return [minRow, minCol, maxRow, maxCol];
}
/**
 * 获取某个单元格的区域
 * @param {Object} cell 单元格
 * @param {Object} mergedCells
 * @param {Object} placeCells
 */

export function getCellRange(cell) {
  var mergedCells = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var placeCells = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _cell3 = _slicedToArray(cell, 2),
      row = _cell3[0],
      col = _cell3[1];

  var key = getKey(row, col); // 已经合并的单元格

  if (mergedCells[key]) {
    var _mergedCells$key = mergedCells[key],
        rowSpan = _mergedCells$key.rowSpan,
        colSpan = _mergedCells$key.colSpan;
    return [row, col, row + getSpan(rowSpan) - 1, col + getSpan(colSpan) - 1];
  }

  if (placeCells[key]) {
    var _placeCells$key = placeCells[key],
        r = _placeCells$key.r,
        c = _placeCells$key.c,
        _rowSpan = _placeCells$key.rowSpan,
        _colSpan = _placeCells$key.colSpan;
    return [r, c, r + getSpan(_rowSpan) - 1, c + getSpan(_colSpan) - 1];
  }

  return [row, col, row, col];
}
export var MOUSE = function (o) {
  o[o['UP'] = 0] = 'UP';
  o[o['DOWN'] = 1] = 'DOWN';
  return o;
}({});
export var BUTTON_CODE = function (o) {
  o[o['LEFT'] = 0] = 'LEFT';
  o[o['MIDDLE'] = 1] = 'MIDDLE';
  o[o['RIGHT'] = 2] = 'RIGHT';
  return o;
}({});