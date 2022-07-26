import { Extension, Range } from '@codemirror/state';
import { EditorView } from 'codemirror';
import { imagePreview } from '../state/image';
import { image as classes } from '../classes';
import {
	Decoration,
	DecorationSet,
	ViewPlugin,
	ViewUpdate
} from '@codemirror/view';
import {
	iterateTreeInVisibleRanges,
	isCursorInRange,
	invisibleDecoration
} from '../util';

function hideNodes(view: EditorView) {
	const widgets = new Array<Range<Decoration>>();
	iterateTreeInVisibleRanges(view, {
		enter(node) {
			if (
				node.name === 'Image' &&
				!isCursorInRange(view, [node.from, node.to])
			) {
				widgets.push(invisibleDecoration.range(node.from, node.to));
			}
		}
	});
	return Decoration.set(widgets, true);
}

const hideImageNodePlugin = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;

		constructor(view: EditorView) {
			this.decorations = hideNodes(view);
		}

		update(update: ViewUpdate) {
			if (update.docChanged || update.selectionSet)
				this.decorations = hideNodes(update.view);
		}
	},
	{ decorations: (v) => v.decorations }
);

/**
 * Ixora Image plugin.
 *
 * This plugin allows to
 * - Add a preview of an image in the document.
 *
 * @returns The image plugin.
 */
export const image = (): Extension => [
	imagePreview,
	hideImageNodePlugin,
	baseTheme
];

const baseTheme = EditorView.baseTheme({
	['.' + classes.widget]: {
		display: 'block',
		objectFit: 'contain',
		maxWidth: '100%',
		paddingLeft: '4px',
		maxHeight: '100%',
		userSelect: 'none'
	}
});
