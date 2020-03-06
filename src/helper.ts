type Range = [number, number, number, number];

/**
 *
 * @param range 区域转坐标点
 * @returns 返回区域的四个点坐标，左上角为起始坐标，顺时针计算 [lt,rt,rb,lb]
 */
export function range2Points(range: Range) {
  const [x0, y0, x2, y2] = range;

  return [
    [x0, y0],
    [x2, y0],
    [x2, y2],
    [x0, y2]
  ];
}

/**
 * 判断两个区域是否有交集，并返回新区域
 * @param range1 区域1
 * @param range2 区域2
 * 返回: 如果两个区域有交集 [true,newRange]，没有交集返回 [false]
 */
function checkOverAndGetNewRange(
  range1: Range,
  range2: Range
): [boolean, Range?] {
  const [lt0, rt0, rb0] = range2Points(range1); // 区域1的4个坐标点
  const [lt1, rt1, rb1] = range2Points(range2); // 区域2的4个坐标点

  const [x0, x1] = [lt0[0], rt0[0]];
  const [x2, x3] = [lt1[0], rt1[0]];

  const [y0, y1] = [rt0[1], rb0[0]];
  const [y2, y3] = [rt0[0], rb1[0]];

  // a.range1 在 rang2 左边，并且有交接
  // b.range1 在 rang2 右边，并且有交接
  // c.range1、range2 相互包含
  const xAxisHasOver =
    (x0 <= x2 && x1 <= x3) ||
    (x0 >= x2 && x1 >= x3) ||
    (x0 <= x2 && x1 >= x3) ||
    (x0 >= x2 && x1 <= x3);

  const yAxisHasOver =
    (y0 <= y2 && y1 <= y3) ||
    (y0 >= y2 && y1 >= y3) ||
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
 *
 * @param range 选中的区域 格式:[左上坐标看，右下角坐标]
 * @param mergeds 已经合并的区域集合
 */
export function getMaxRange(
  range: Range,
  mergeds: Array<Range>
): [Range, Array<Range>] {
  // range=[x0,y0,x2,y2]
  /* 轮询已经合并的区域集合，依次判断集合项是否与选中的区域存在交集，
  如果两个区域存在交集，取这两个区域的最大区域，删除当前集合项，一次 */

  let index = 0;
  let current = mergeds[index];
  console.log("index", index, mergeds);
  while (current) {
    index++;
    const [hasOver, nextRange] = checkOverAndGetNewRange(range, current);
    // 如果存在交集，更新 current 为 nextRange
    if (hasOver && nextRange) {
      const nextMergeds = [...mergeds.slice(0, index - 1)].concat(
        ...mergeds.slice(index)
      );

      console.log(
        "nextMergeds",
        nextMergeds.concat([nextRange])
        // mergeds.concat([nextRange])
      );

      return getMaxRange(nextRange, nextMergeds.concat([nextRange]));
    }

    current = mergeds[index];
  }

  return [range, mergeds];
}

// function a() {
//   var list = [1, 2, 3, 4, 4, 5, 6, 67];

//   let index = 0;
//   let current = list[index];
//   while (current) {
//     console.log("current0", current);
//     index++;
//     if (current === 3) {
//       return current;
//     }
//     current = list[index];
//     console.log("current1", current);
//   }
//   console.log("current2", 0);
//   return 0;
// }

// a();
