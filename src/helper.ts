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
import { Cell, Range } from "./index.d";

const letters = "ABCDEFGHIJKLMNOPQRSTYVWXYZ".split("");
export function getHeadChar(index: number): string {
  // 28 => AC
  const times = Math.floor(index / letters.length);
  const res = letters[index % letters.length];

  if (times > 0) return getHeadChar(times - 1) + res;

  return res;
}

// /**
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

export function isInRange(cell: Cell, range: Range) {
  if (!range || !range.length) return false;
  if (!cell || !cell.length) return false;

  const [row, col] = cell || [];
  const [r0, c0, r1, c1] = range || [];
  return row >= r0 && row <= r1 && col >= c0 && col <= c1;
}

// function isRange(range: Range) {
//   // console.log("range", range);
//   const [r0, c0, r1, c1] = range;
//   // 第二坐标不为空，并且不等于第一坐标
//   // return true;
//   return r1 && c1 && (r0 !== r1 || c0 !== c1);
// }

function isSamgeRange(range1: Range, range2: Range) {
  const [r0, c0, r1, c1] = range1;
  const [r2, c2, r3, c3] = range2;
  return r0 === r2 && c0 === c2 && r1 === r3 && c1 === c3;
}

export function getPlaceholders(mergedRange: Range): Cell[] {
  const [r0, c0, r1, c1] = mergedRange;
  const cells: Cell[] = [];
  for (let row = r0; row <= r1; row++) {
    for (let col = c0; col <= c1; col++) {
      if (row !== r0 || col !== c0) cells.push([row, col]);
    }
  }

  return cells;
}

/**
 * 判断两个区域是否有交集，并返回新区域
 * @param range1 区域1
 * @param range2 区域2
 * 返回: 如果两个区域有交集 [true,newRange]，没有交集返回 [false]
 */
export function checkOverAndGetNewRange(
  range1: Range,
  range2: Range
): [boolean, Range?] {
  const [r0, c0, r1, c1] = range1;
  const [r2, c2, r3, c3] = range2;

  // a.range1 在 rang2 左边，并且有交接
  // b.range1 在 rang2 右边，并且有交接
  // c.range1、range2 相互包含
  const xAxisHasOver =
    (r1 >= r2 && r1 <= r3) ||
    (r0 >= r2 && r0 <= r3) ||
    // 包含在里边的情况
    (r0 <= r2 && r1 >= r3) ||
    (r0 >= r2 && r1 <= r3);

  const yAxisHasOver =
    (c1 >= c2 && c1 <= c3) ||
    (c0 >= c2 && c0 <= c3) ||
    // 包含在里边的情况
    (c0 <= c2 && c1 >= c3) ||
    (c0 >= c2 && c1 <= c3);

  // x 轴和 y 轴都有交接，证明两个区域存在交集
  if (xAxisHasOver && yAxisHasOver) {
    const minX = Math.min(r0, r1, r2, r3);
    const maxX = Math.max(r0, r1, r2, r3);
    const minY = Math.min(c0, c1, c2, c3);
    const maxY = Math.max(c0, c1, c2, c3);

    return [true, [minX, minY, maxX, maxY]];
  }

  return [false];
}

/**
 * 判断指定选区是否跟已有的选区存在交集，并返回交集的最大选区和新的选区集合
 * @param range 选中的区域 格式:[左上坐标看，右下角坐标]
 * @param mergeds 已经合并的区域集合
 */
export function getMaxRange(range: Range, mergeds: Range[]): [Range] {
  // range=[r0,c0,r1,c1]
  /**
   * 轮询已经合并的区域集合，依次判断集合项是否与选中的区域存在交集，
   * 如果两个区域存在交集，取这两个区域的最大区域，并用新的区域替换 mergeds 中的旧区域
   */

  let index = 0;
  let current = mergeds[index];

  while (current) {
    index++;
    const [hasOver, nextRange] = checkOverAndGetNewRange(range, current);

    // console.log("nextMergeds-0", hasOver, nextRange);

    // 存在交集的情况
    if (hasOver && nextRange) {
      const nextMergeds = mergeds
        .slice(0, index - 1)
        .concat(mergeds.slice(index));

      // console.log("nextMergeds-1", hasOver, range, nextRange, nextMergeds);

      // 两者是同一个区域，同一个区域不在轮询
      if (isSamgeRange(range, nextRange) && nextMergeds.length === 0)
        return [nextRange];

      return getMaxRange(nextRange, nextMergeds);
    }

    current = mergeds[index];
  }
  console.log("mergeds", mergeds);
  return [range];
}
