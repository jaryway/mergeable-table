// type Range = [number, number, number, number];

/**
 *
 * @param range 区域转坐标点
 * @returns 返回区域的四个点坐标，左上角为起始坐标，顺时针计算 [lt,rt,rb,lb]
 */
function range2Points(range) {
  const [x0, y0, x2, y2] = range;
  // console.log("range", x0, y0, x2, y2, range);

  return [
    [x0, y0],
    [x2, y0],
    [x2, y2],
    [x0, y2]
  ];
}

function isRange(range) {
  console.log("range", range);
  const [x0, y0, x1, y1] = range;
  // 第二坐标不为空，并且不等于第一坐标
  // return true;
  return x1 && y1 && (x0 !== x1 || y0 !== y1);
}

function isSamgeRange(range1, range2) {
  // const [lt0, rt0, rb0, lb0] = range1; // 区域1的4个坐标点
  // const [lt1, rt1, rb1, lb1] = range2; // 区域2的4个坐标点

  return (
    range1[0] === range2[0] &&
    range1[1] === range2[1] &&
    range1[2] === range2[2] &&
    range1[3] === range2[3]
  );
}

/**
 * 判断两个区域是否有交集，并返回新区域
 * @param range1 区域1
 * @param range2 区域2
 * 返回: 如果两个区域有交集 [true,newRange]，没有交集返回 [false]
 */
export function checkOverAndGetNewRange(range1, range2) {
  const [lt0, rt0, rb0] = range2Points(range1); // 区域1的4个坐标点
  const [lt1, rt1, rb1] = range2Points(range2); // 区域2的4个坐标点

  const [x0, x1] = [lt0[0], rt0[0]];
  const [x2, x3] = [lt1[0], rt1[0]];

  const [y0, y1] = [rt0[1], rb0[1]];
  const [y2, y3] = [rt1[1], rb1[1]];

  // a.range1 在 rang2 左边，并且有交接
  // b.range1 在 rang2 右边，并且有交接
  // c.range1、range2 相互包含
  const xAxisHasOver =
    (x1 >= x2 && x1 <= x3) ||
    (x0 >= x2 && x0 <= x3) ||
    // 包含在里边的情况
    (x0 <= x2 && x1 >= x3) ||
    (x0 >= x2 && x1 <= x3);

  const yAxisHasOver =
    (y1 >= y2 && y1 <= y3) ||
    (y0 >= y2 && y0 <= y3) ||
    // 包含在里边的情况
    (y0 <= y2 && y1 >= y3) ||
    (y0 >= y2 && y1 <= y3);

  // x 轴和 y 轴都有交接，证明两个区域存在交集
  if (xAxisHasOver && yAxisHasOver) {
    const minX = Math.min(x0, x1, x2, x3);
    const maxX = Math.max(x0, x1, x2, x3);
    const minY = Math.min(y0, y1, y2, y3);
    const maxY = Math.max(y0, y1, y2, y3);

    return [true, [minX, minY, maxX, maxY]];
  }

  return [false];
}

/**
 * 判断指定选区是否跟已有的选区存在交集，并返回交集的最大选区和新的选区集合
 * @param range 选中的区域 格式:[左上坐标看，右下角坐标]
 * @param mergeds 已经合并的区域集合
 */
export function getMaxRange(range, mergeds) {
  // range=[x0,y0,x2,y2]
  /**
   * 轮询已经合并的区域集合，依次判断集合项是否与选中的区域存在交集，
   * 如果两个区域存在交集，取这两个区域的最大区域，并用新的区域替换 mergeds 中的旧区域
  */


  let index = 0;
  let current = mergeds[index];

  while (current) {
    index++;
    const [hasOver, nextRange] = checkOverAndGetNewRange(range, current);

    const nextMergeds = mergeds
      .slice(0, index - 1)
      .concat(mergeds.slice(index), [nextRange]);

    // console.log("nextMergeds", nextMergeds);

    // 存在交集的情况
    if (hasOver) {
      // 两者是同一个区域，同一个区域不在轮询
      if (isSamgeRange(range, nextRange)) return [nextRange, nextMergeds];

      return getMaxRange(nextRange, nextMergeds);
    }

    current = mergeds[index];
  }
  // console.log("mergeds", mergeds);
  return [range, isRange(range) ? [...mergeds, range] : mergeds];
}
