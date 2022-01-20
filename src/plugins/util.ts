import { syntaxTree } from '@codemirror/language';
import { SyntaxNode, NodeType } from '@lezer/common';
import { Decoration, EditorView } from '@codemirror/view';

/**
 * Check if two ranges overlap
 * Based on the visual diagram on https://stackoverflow.com/a/25369187
 * @param range1 - Range 1
 * @param range2 - Range 2
 * @returns True if the ranges overlap
 */
export function checkRangeOverlap(
    range1: [number, number],
    range2: [number, number]
) {
    return range1[0] <= range2[1] && range2[0] <= range1[1];
}

/**
 * Check if any of the editor cursors is in the given range
 * @param view - Editor view
 * @param range - Range to check
 * @returns True if the cursor is in the range
 */
export function isCursorInRange(view: EditorView, range: [number, number]) {
    return view.state.selection.ranges.some((selection) =>
        checkRangeOverlap(range, [selection.from, selection.to])
    );
}

/**
 * Iterate over the syntax tree in the visible ranges of the document
 * @param view - Editor view
 * @param iterateObj - Object with `enter` and `leave` iterate function
 */
export function iterateTreeInVisibleRanges(
    view: EditorView,
    iterateObj: {
        enter(
            type: NodeType,
            from: number,
            to: number,
            get: () => SyntaxNode
        ): false | void;
        leave?(
            type: NodeType,
            from: number,
            to: number,
            get: () => SyntaxNode
        ): void;
    }
) {
    for (const { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({ from, to, ...iterateObj });
    }
}

/**
 * Decoration to simply hide anything.
 */
export const invisibleDecoration = Decoration.replace({});
