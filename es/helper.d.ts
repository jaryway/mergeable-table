export declare type Range = [number, number, number, number];
export declare type Cell = [number, number];
export interface Element {
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
}
export declare type SelectedCell = [number, number, number?, number?];
export declare enum MOUSE {
    UP = 0,
    DOWN = 1
}
export declare enum BUTTON_CODE {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2
}
export interface MergeableTableValueProps {
    elements: Element[];
    rows: number;
    cols: number;
    style: any;
}
export interface MergeableTableProps {
    showHeader: boolean;
    forwardedRef: any;
    className?: string;
    defaultValue?: any;
    value?: any;
    onChange?: (v: any) => void;
    children?: any;
}
export declare function getHeadChar(index: number): string;
export declare function isInRange(cell: Cell, range: Range): boolean;
export declare function checkOverAndGetNewRange(range1: Range, range2: Range): [boolean, Range?];
export declare function getMaxRange(range: Range, mergeds: Range[]): Range;
