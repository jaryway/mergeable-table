import { getMergedPlace, getCellsRange } from './utils';

const defaultConfig = {
  rows: 10,
  cols: 20,
  style: {},

  elements: [
    { key: '2_1', row: 2, col: 1, colSpan: 2, rowSpan: 3 },
    { key: '2_4', row: 2, col: 4, rowSpan: 3 },
    { key: '4_1', row: 0, col: 1 },
    { key: '1_3', row: 1, col: 3 },
    {
      key: '5_2',
      row: 5,
      col: 2,
      component: { id: 'ddssdsd', type: 'input' },
    },
  ],
};

describe('加法函数测试', () => {
  it('getMergedPlace', () => {
    expect(getMergedPlace(defaultConfig.elements)).toStrictEqual({
      merged: {
        '2_4': { col: 4, colSpan: 1, row: 2, rowSpan: 3 },
        '2_1': { col: 1, colSpan: 2, row: 2, rowSpan: 3 },
        // '0_1': { col: 1, colSpan: 2, row: 0, rowSpan: 2 },
      },
      place: {
        '2_2': { c: 1, col: 2, colSpan: 2, r: 2, row: 2, rowSpan: 3 },
        '3_1': { c: 1, col: 1, colSpan: 2, r: 2, row: 3, rowSpan: 3 },
        '3_2': { c: 1, col: 2, colSpan: 2, r: 2, row: 3, rowSpan: 3 },
        '3_4': { c: 4, col: 4, colSpan: 1, r: 2, row: 3, rowSpan: 3 },
        '4_1': { c: 1, col: 1, colSpan: 2, r: 2, row: 4, rowSpan: 3 },
        '4_2': { c: 1, col: 2, colSpan: 2, r: 2, row: 4, rowSpan: 3 },
        '4_4': { c: 4, col: 4, colSpan: 1, r: 2, row: 4, rowSpan: 3 },
        // '0_2': { c: 1, col: 2, colSpan: 2, r: 0, row: 0, rowSpan: 2 },
        // '1_1': { c: 1, col: 1, colSpan: 2, r: 0, row: 1, rowSpan: 2 },
        // '1_2': { c: 1, col: 2, colSpan: 2, r: 0, row: 1, rowSpan: 2 },
      },
    });
  });

  it('getCellsRange', () => {
    expect(
      getCellsRange(
        [1, 1],
        [1, 3],
        {
          '2_4': { col: 4, colSpan: 1, row: 2, rowSpan: 3 },
          '2_1': { col: 1, colSpan: 2, row: 2, rowSpan: 3 },
          //   '0_1': { col: 1, colSpan: 2, row: 0, rowSpan: 2 },
        },
        {
          '2_2': { c: 1, col: 2, colSpan: 2, r: 2, row: 2, rowSpan: 3 },
          '3_1': { c: 1, col: 1, colSpan: 2, r: 2, row: 3, rowSpan: 3 },
          '3_2': { c: 1, col: 2, colSpan: 2, r: 2, row: 3, rowSpan: 3 },
          '3_4': { c: 4, col: 4, colSpan: 1, r: 2, row: 3, rowSpan: 3 },
          '4_1': { c: 1, col: 1, colSpan: 2, r: 2, row: 4, rowSpan: 3 },
          '4_2': { c: 1, col: 2, colSpan: 2, r: 2, row: 4, rowSpan: 3 },
          '4_4': { c: 4, col: 4, colSpan: 1, r: 2, row: 4, rowSpan: 3 },
        //   '0_2': { c: 1, col: 2, colSpan: 2, r: 0, row: 0, rowSpan: 2 },
        //   '1_1': { c: 1, col: 1, colSpan: 2, r: 0, row: 1, rowSpan: 2 },
        //   '1_2': { c: 1, col: 2, colSpan: 2, r: 0, row: 1, rowSpan: 2 },
        }
      )
    ).toEqual(expect.arrayContaining([1, 1, 1, 3]));
  });
});
