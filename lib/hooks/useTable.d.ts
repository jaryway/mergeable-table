import { Range, SelectedCell, MOUSE } from "../helper";
declare const useTable: (data: any, onChange: any) => {
    mouse: MOUSE;
    mergeds: any;
    selection: number[];
    selectedCells: SelectedCell[];
    selectedRange: Range | [];
    onCellMouseLeftDown: (i: number, j: number) => (_e: any) => void;
    onCellMouseOver: (r1: number, c1: number) => () => false | undefined;
    onCellMouseUp: () => void;
    onMergeCell: () => void;
    onSplitCell: () => void;
    onAddRow: () => void;
    onAddCol: () => void;
    onDelRow: () => void;
    onDelCol: () => void;
    onClean: () => void;
};
export default useTable;
