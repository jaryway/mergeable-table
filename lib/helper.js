"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHeadChar = getHeadChar;
exports.isInRange = isInRange;
exports.checkOverAndGetNewRange = checkOverAndGetNewRange;
exports.getMaxRange = getMaxRange;
exports.BUTTON_CODE = exports.MOUSE = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * ----------------------------------→ col
 * |
 * |
 * |
 * |
 * |
 * |
 * |
 * |
 * ↓
 * row
 */
var MOUSE;
exports.MOUSE = MOUSE;

(function (MOUSE) {
  MOUSE[MOUSE["UP"] = 0] = "UP";
  MOUSE[MOUSE["DOWN"] = 1] = "DOWN";
})(MOUSE || (exports.MOUSE = MOUSE = {}));

var BUTTON_CODE;
exports.BUTTON_CODE = BUTTON_CODE;

(function (BUTTON_CODE) {
  BUTTON_CODE[BUTTON_CODE["LEFT"] = 0] = "LEFT";
  BUTTON_CODE[BUTTON_CODE["MIDDLE"] = 1] = "MIDDLE";
  BUTTON_CODE[BUTTON_CODE["RIGHT"] = 2] = "RIGHT";
})(BUTTON_CODE || (exports.BUTTON_CODE = BUTTON_CODE = {}));

var letters = "ABCDEFGHIJKLMNOPQRSTYVWXYZ".split("");

function getHeadChar(index) {
  // 28 => AC
  var times = Math.floor(index / letters.length);
  var res = letters[index % letters.length];
  if (times > 0) return getHeadChar(times - 1) + res;
  return res;
} // /**
//  *
//  * @param range 区域转坐标点
//  * @returns 返回区域的四个点坐标，左上角为起始坐标，顺时针计算 [lt,rt,rb,lb]
//  */
// function range2Points(range: Range) {
//   const [r0, c0, r1, c1] = range;
//   // 0,0 1,1=>[0,0] [0,1] [1,1] [1,0]
//   // console.log("range", r0, c0, r1, c1, range);
//   return [
//     [r0, c0],
//     [r0, c1],
//     [r1, c1],
//     [r1, c0]
//   ];
// }


function isInRange(cell, range) {
  if (!range || !range.length) return false;
  if (!cell || !cell.length) return false;

  var _ref = cell || [],
      _ref2 = _slicedToArray(_ref, 2),
      row = _ref2[0],
      col = _ref2[1];

  var _ref3 = range || [],
      _ref4 = _slicedToArray(_ref3, 4),
      r0 = _ref4[0],
      c0 = _ref4[1],
      r1 = _ref4[2],
      c1 = _ref4[3];

  return row >= r0 && row <= r1 && col >= c0 && col <= c1;
} // function isRange(range: Range) {
//   // console.log("range", range);
//   const [r0, c0, r1, c1] = range;
//   // 第二坐标不为空，并且不等于第一坐标
//   // return true;
//   return r1 && c1 && (r0 !== r1 || c0 !== c1);
// }


function isSamgeRange(range1, range2) {
  var _range = _slicedToArray(range1, 4),
      r0 = _range[0],
      c0 = _range[1],
      r1 = _range[2],
      c1 = _range[3];

  var _range2 = _slicedToArray(range2, 4),
      r2 = _range2[0],
      c2 = _range2[1],
      r3 = _range2[2],
      c3 = _range2[3];

  return r0 === r2 && c0 === c2 && r1 === r3 && c1 === c3;
} // export function getPlaceholders(mergedRange: Range): Cell[] {
//   const [r0, c0, r1, c1] = mergedRange;
//   const cells: Cell[] = [];
//   for (let row = r0; row <= r1; row++) {
//     for (let col = c0; col <= c1; col++) {
//       if (row !== r0 || col !== c0) cells.push([row, col]);
//     }
//   }
//   return cells;
// }

/**
 * 判断两个区域是否有交集，并返回新区域
 * @param range1 区域1
 * @param range2 区域2
 * 返回: 如果两个区域有交集 [true,newRange]，没有交集返回 [false]
 */


function checkOverAndGetNewRange(range1, range2) {
  var _range3 = _slicedToArray(range1, 4),
      r0 = _range3[0],
      c0 = _range3[1],
      r1 = _range3[2],
      c1 = _range3[3];

  var _range4 = _slicedToArray(range2, 4),
      r2 = _range4[0],
      c2 = _range4[1],
      r3 = _range4[2],
      c3 = _range4[3]; // a.range1 在 rang2 左边，并且有交接
  // b.range1 在 rang2 右边，并且有交接
  // c.range1、range2 相互包含


  var xAxisHasOver = r1 >= r2 && r1 <= r3 || r0 >= r2 && r0 <= r3 || // 包含在里边的情况
  r0 <= r2 && r1 >= r3 || r0 >= r2 && r1 <= r3;
  var yAxisHasOver = c1 >= c2 && c1 <= c3 || c0 >= c2 && c0 <= c3 || // 包含在里边的情况
  c0 <= c2 && c1 >= c3 || c0 >= c2 && c1 <= c3; // x 轴和 y 轴都有交接，证明两个区域存在交集

  if (xAxisHasOver && yAxisHasOver) {
    var minX = Math.min(r0, r1, r2, r3);
    var maxX = Math.max(r0, r1, r2, r3);
    var minY = Math.min(c0, c1, c2, c3);
    var maxY = Math.max(c0, c1, c2, c3);
    return [true, [minX, minY, maxX, maxY]];
  }

  return [false];
}
/**
 * 判断指定选区是否跟已有的选区存在交集，并返回交集的最大选区和新的选区集合
 * @param range 选中的区域 格式:[左上坐标看，右下角坐标]
 * @param mergeds 已经合并的区域集合
 */


function getMaxRange(range, mergeds) {
  // range=[r0,c0,r1,c1]

  /**
   * 轮询已经合并的区域集合，依次判断集合项是否与选中的区域存在交集，
   * 如果两个区域存在交集，取这两个区域的最大区域，并用新的区域替换 mergeds 中的旧区域
   */
  var index = 0;
  var current = mergeds[index];

  while (current) {
    index++;

    var _checkOverAndGetNewRa = checkOverAndGetNewRange(range, current),
        _checkOverAndGetNewRa2 = _slicedToArray(_checkOverAndGetNewRa, 2),
        hasOver = _checkOverAndGetNewRa2[0],
        nextRange = _checkOverAndGetNewRa2[1]; // console.log("nextMergeds-0", hasOver, nextRange);
    // 存在交集的情况


    if (hasOver && nextRange) {
      var nextMergeds = mergeds.slice(0, index - 1).concat(mergeds.slice(index)); // console.log("nextMergeds-1", hasOver, range, nextRange, nextMergeds);
      // 两者是同一个区域，并且是最后一个

      if (isSamgeRange(range, nextRange) && nextMergeds.length === 0) return nextRange;
      return getMaxRange(nextRange, nextMergeds);
    }

    current = mergeds[index];
  } // console.log("mergeds", mergeds);


  return range;
}