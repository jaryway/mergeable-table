function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

export var MOUSE;

(function (MOUSE) {
  MOUSE[MOUSE["UP"] = 0] = "UP";
  MOUSE[MOUSE["DOWN"] = 1] = "DOWN";
})(MOUSE || (MOUSE = {}));

export var BUTTON_CODE;

(function (BUTTON_CODE) {
  BUTTON_CODE[BUTTON_CODE["LEFT"] = 0] = "LEFT";
  BUTTON_CODE[BUTTON_CODE["MIDDLE"] = 1] = "MIDDLE";
  BUTTON_CODE[BUTTON_CODE["RIGHT"] = 2] = "RIGHT";
})(BUTTON_CODE || (BUTTON_CODE = {}));

var letters = "ABCDEFGHIJKLMNOPQRSTYVWXYZ".split("");
export function getHeadChar(index) {
  var times = Math.floor(index / letters.length);
  var res = letters[index % letters.length];
  if (times > 0) return getHeadChar(times - 1) + res;
  return res;
}
export function isInRange(cell, range) {
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
}

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
}

export function checkOverAndGetNewRange(range1, range2) {
  var _range3 = _slicedToArray(range1, 4),
      r0 = _range3[0],
      c0 = _range3[1],
      r1 = _range3[2],
      c1 = _range3[3];

  var _range4 = _slicedToArray(range2, 4),
      r2 = _range4[0],
      c2 = _range4[1],
      r3 = _range4[2],
      c3 = _range4[3];

  var xAxisHasOver = r1 >= r2 && r1 <= r3 || r0 >= r2 && r0 <= r3 || r0 <= r2 && r1 >= r3 || r0 >= r2 && r1 <= r3;
  var yAxisHasOver = c1 >= c2 && c1 <= c3 || c0 >= c2 && c0 <= c3 || c0 <= c2 && c1 >= c3 || c0 >= c2 && c1 <= c3;

  if (xAxisHasOver && yAxisHasOver) {
    var minX = Math.min(r0, r1, r2, r3);
    var maxX = Math.max(r0, r1, r2, r3);
    var minY = Math.min(c0, c1, c2, c3);
    var maxY = Math.max(c0, c1, c2, c3);
    return [true, [minX, minY, maxX, maxY]];
  }

  return [false];
}
export function getMaxRange(range, mergeds) {
  var index = 0;
  var current = mergeds[index];

  while (current) {
    index++;

    var _checkOverAndGetNewRa = checkOverAndGetNewRange(range, current),
        _checkOverAndGetNewRa2 = _slicedToArray(_checkOverAndGetNewRa, 2),
        hasOver = _checkOverAndGetNewRa2[0],
        nextRange = _checkOverAndGetNewRa2[1];

    if (hasOver && nextRange) {
      var nextMergeds = mergeds.slice(0, index - 1).concat(mergeds.slice(index));
      if (isSamgeRange(range, nextRange) && nextMergeds.length === 0) return nextRange;
      return getMaxRange(nextRange, nextMergeds);
    }

    current = mergeds[index];
  }

  return range;
}