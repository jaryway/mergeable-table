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
export declare function getHeadChar(index: number): string;
export declare function isInRange(cell: Cell, range: Range): boolean;
/**
 * 判断两个区域是否有交集，并返回新区域
 * @param range1 区域1
 * @param range2 区域2
 * 返回: 如果两个区域有交集 [true,newRange]，没有交集返回 [false]
 */
export declare function checkOverAndGetNewRange(range1: Range, range2: Range): [boolean, Range?];
/**
 * 判断指定选区是否跟已有的选区存在交集，并返回交集的最大选区和新的选区集合
 * @param range 选中的区域 格式:[左上坐标看，右下角坐标]
 * @param mergeds 已经合并的区域集合
 */
export declare function getMaxRange(range: Range, mergeds: Range[]): Range;
