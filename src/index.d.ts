// row0,col0,row1,col1
export type Range = [number, number, number, number];
export type Cell = [number, number];
export interface Element {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

// [row,col,rowSpan,colSpan]
export type SelectedCell = [number, number, number?, number?];

export enum MOUSE {
  UP,
  DOWN
}

export enum BUTTON_CODE {
  LEFT,
  MIDDLE,
  RIGHT
}

interface MergeableTableValueProps {
  elements: Element[];
  rows: number;
  cols: number;
  style: any;
}
interface MergeableTableProps {
  showHeader: boolean;
  forwardedRef: any;
  className?: string;
  defaultValue?: any;
  value?: any;
  onChange?: (v) => void;
  children?: any;
}

// export interface MergeableTableProps extends MergeableTableCommonProps {
//   defaultValue?: MergeableTableValueProps;
//   value?: MergeableTableValueProps;
// }

// export interface MergeableTableUncontrolledProps
//   extends MergeableTableCommonProps {
//   defaultValue?: MergeableTableValueProps;
//   onChange?: (v) => void;
// }

// export interface MergeableTableControlledProps
//   extends MergeableTableCommonProps {
//   value: MergeableTableValueProps;
//   onChange: (v) => void;
// }
