import {
	Decoration,
	DecorationSet,
	EditorView,
	ViewPlugin,
	ViewUpdate
} from '@codemirror/view';
import {
	checkRangeOverlap,
	invisibleDecoration,
	isCursorInRange,
	iterateTreeInVisibleRanges
} from '../util';

/**
 * These types contain markers as child elements that can be hidden.
 */
export const typesWithMarks = [
	'Emphasis',
	'StrongEmphasis',
	'InlineCode',
	'Strikethrough'
];
/**
 * The elements which are used as marks.
 */
export const markTypes = ['EmphasisMark', 'CodeMark', 'StrikethroughMark'];

/**
 * Plugin to hide marks when the they are not in the editor selection.
 */
class HideMarkPlugin {
	decorations: DecorationSet;
	constructor(view: EditorView) {
		this.decorations = this.compute(view);
	}
	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged || update.selectionSet)
			this.decorations = this.compute(update.view);
	}
	compute(view: EditorView): DecorationSet {
		const widgets = [];
		let parentRange: [number, number];
		iterateTreeInVisibleRanges(view, {
			enter: ({ type, from, to, node }) => {
				if (typesWithMarks.includes(type.name)) {
					// There can be a possibility that the current node is a
					// child eg. a bold node in a emphasis node, so check
					// for that or else save the node range
					if (
						parentRange &&
						checkRangeOverlap([from, to], parentRange)
					)
						return;
					else parentRange = [from, to];
					if (isCursorInRange(view.state, [from, to])) return;
					const innerTree = node.toTree();
					innerTree.iterate({
						enter({ type, from: markFrom, to: markTo }) {
							// Check for mark types and push the replace
							// decoration
							if (!markTypes.includes(type.name)) return;
							widgets.push(
								invisibleDecoration.range(
									from + markFrom,
									from + markTo
								)
							);
						}
					});
				}
			}
		});
		return Decoration.set(widgets, true);
	}
}

/**
 * Ixora hide marks plugin.
 *
 * This plugin allows to:
 * - Hide marks when they are not in the editor selection.
 */
export const hideMarks = () => [
	ViewPlugin.fromClass(HideMarkPlugin, {
		decorations: (v) => v.decorations
	})
];
