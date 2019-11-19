export function getSpan(input) {
  if (input === null || input === undefined || input <= 1) return 1;

  return Number(input);
}
export function getKey(row, col) {
  return [row, col].join('_');
}

export function getHeadChar(index) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTYVWXYZ'.split('');
  // 28 => AC

  const times = Math.floor(index / letters.length);
  const res = letters[index % letters.length];

  if (times > 0) return getHeadChar(times - 1) + res;

  return res;
}
/**
 *
 * @param {Point} cell1 选区坐标点
 * @param {Point} cell2 选区坐标点
 */
export function range2Cells(cell1, cell2) {
  const [row1, col1] = cell1 || [];
  const [row2, col2] = cell2 || [];

  const res = {};
  // console.log('range2Cells', row2, col2);
  if (!cell2) {
    res[getKey(row1, col1)] = 1;
    return res;
  }

  const minRow = Math.min(row1, row2);
  const maxRow = Math.max(row1, row2);
  const minCol = Math.min(col1, col2);
  const maxCol = Math.max(col1, col2);

  for (let i = minRow; i <= maxRow; i++) {
    for (let j = minCol; j <= maxCol; j++) {
      res[getKey(i, j)] = 1;
    }
  }

  return res;
}

export function getLineCells(cell1, cell2, mergedCells = {}, placeCells = {}) {
  // console.log('getLineCells', cell1, cell2, mergedCells, placeCells);
  // 两个对角单元格的最大区域
  const [minRow, minCol, maxRow, maxCol] = getCellsRange(cell1, cell2, mergedCells, placeCells);

  return [
    [minRow, minCol], // 上
    [minRow, maxCol], // 右
    [maxRow, maxCol], // 下
    [maxRow, minCol], // 左
  ].reduce((prev, current, index, arr) => {
    const even = (index + 1) % 2 === 0; // 偶数
    const next = arr[index < arr.length - 1 ? index + 1 : 0];
    const res = [current];
    const [rowIndex, colIndex] = current;

    // 偶数，移动 row， 奇数移动 cell

    const len = even ? rowIndex - next[0] : colIndex - next[1];
    for (let i = 1; i < Math.abs(len); i++) {
      res.push(
        even
          ? [rowIndex + (len < 0 ? +i : -i), colIndex]
          : [rowIndex, colIndex + (len < 0 ? +i : -i)]
      );
    }

    return [...prev, ...res];
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
export function getRange(cell1, cell2, mergedCells = {}, placeCells = {}) {
  // console.log('getRange', JSON.stringify({ cell1, cell2 }));
  /**
   * 原理：
   * 两个坐标组成一个区域，依次沿着该区域的四条边查找是否有空白单元格（有空白单元格，表示该单元格被合并了），
   * 若找到空白单元格，找到实际合并的单元格，拿到它的 colSpan 、rowSpan，并重新计算选中的单元格
   */
  const [row1, col1] = cell1;
  const [row2, col2] = cell2;

  let minRow = Math.min(row1, row2);
  let maxRow = Math.max(row1, row2);
  let minCol = Math.min(col1, col2);
  let maxCol = Math.max(col1, col2);
  // 得到四条边上的单元格
  const lineCells = getLineCells(cell1, cell2, mergedCells, placeCells);

  // console.log('lineCells', lineCells);
  let rangeHasChanged = false;
  // 轮询四条边上的单元格，找到最大范围
  for (let i = 0; i < lineCells.length; i++) {
    const cell = lineCells[i];
    // console.log('lineCells-for ', lineCells);
    const [row, col, _row, _col] = getCellRange(cell, mergedCells, placeCells);
    // console.log('getCellRange', cell, row, col, _row, _col);
    const _minRow = Math.min(row, _row, minRow);
    const _minCol = Math.min(col, _col, minCol);
    const _maxRow = Math.max(row, _row, maxRow);
    const _maxCol = Math.max(col, _col, maxCol);

    // console.log('getCellRange', cell, row, col, _row, _col);

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
  }
  // console.log('getRange', [[minRow, minCol], [maxRow, maxCol]]);
  return [[minRow, minCol], [maxRow, maxCol]];
}

/**
 * 获取合并单元格和占位单元格
 * @param {Object} data table 数据
 */
export function getMergedPlace(data) {
  // console.log('getMergedPlace', data);
  // console.time('getMergedPlace');
  const res = data.reduce(
    (prev, { row: r, col: c, rowSpan: rSpan, colSpan: cSpan }) => {
      const rowSpan = getSpan(rSpan);
      const colSpan = getSpan(cSpan);

      // 计算 colSpan 大于 1 的情况
      for (let i = 1; i < colSpan; i++) {
        for (let j = 0; j < rowSpan; j++) {
          const [row, col] = [r + j, c + i];
          prev.place = {
            ...prev.place,
            [getKey(row, col)]: { row, col, r, c, colSpan, rowSpan },
          };
        }
      }

      // 计算 rowSpan 大于 1 的情况
      for (let i = 1; i < rowSpan; i++) {
        for (let j = 0; j < colSpan; j++) {
          const [row, col] = [r + i, c + j];
          prev.place = {
            ...prev.place,
            [getKey(row, col)]: { row, col, r, c, colSpan, rowSpan },
          };
        }
      }

      if (rowSpan > 1 || colSpan > 1) {
        prev.merged = {
          ...prev.merged,
          [getKey(r, c)]: { row: r, col: c, rowSpan, colSpan },
        };
      }

      return prev;
    },
    { place: {}, merged: {} }
  );
  // console.timeEnd('getMergedPlace');
  return res;
}

export function getCellsRange(cell1, cell2, mergedCells = {}, placeCells = {}) {
  // console.log('getCellsRange', cell1, cell2, mergedCells, placeCells);
  const [row1, col1, _row1, _col1] = getCellRange(cell1, mergedCells, placeCells);
  const [row2, col2, _row2, _col2] = getCellRange(cell2, mergedCells, placeCells);

  // 如果当前单元格已经合并过

  const minRow = Math.min(row1, row2, _row1, _row2);
  const maxRow = Math.max(row1, row2, _row1, _row2);
  const minCol = Math.min(col1, col2, _col1, _col2);
  const maxCol = Math.max(col1, col2, _col1, _col2);

  return [minRow, minCol, maxRow, maxCol];
}

/**
 * 获取某个单元格的区域
 * @param {Object} cell 单元格
 * @param {Object} mergedCells
 * @param {Object} placeCells
 */
export function getCellRange(cell, mergedCells = {}, placeCells = {}) {
  const [row, col] = cell;
  const key = getKey(row, col);

  // 已经合并的单元格
  if (mergedCells[key]) {
    const { rowSpan, colSpan } = mergedCells[key];
    return [row, col, row + getSpan(rowSpan) - 1, col + getSpan(colSpan) - 1];
  }

  if (placeCells[key]) {
    const { r, c, rowSpan, colSpan } = placeCells[key];
    return [r, c, r + getSpan(rowSpan) - 1, c + getSpan(colSpan) - 1];
  }

  return [row, col, row, col];
}

export const MOUSE = (o => {
  o[(o['UP'] = 0)] = 'UP';
  o[(o['DOWN'] = 1)] = 'DOWN';

  return o;
})({});

export const BUTTON_CODE = (o => {
  o[(o['LEFT'] = 0)] = 'LEFT';
  o[(o['MIDDLE'] = 1)] = 'MIDDLE';
  o[(o['RIGHT'] = 2)] = 'RIGHT';
  return o;
})({});
