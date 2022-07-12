import { Extension } from '@codemirror/state';
import {
	Decoration,
	DecorationSet,
	EditorView,
	ViewPlugin,
	ViewUpdate,
} from '@codemirror/view';
import { Range } from '@codemirror/state';
import {
	editorLines,
	invisibleDecoration,
	isCursorInRange,
	iterateTreeInVisibleRanges,
} from '../util.ts';
import { codeblock as classes } from '../classes.ts';

/**
 * Ixora code block plugin.
 *
 * This plugin allows to:
 * - Add default styling to code blocks
 * - Customize visibility of code block markers and language
 */
export const codeblock = (): Extension => [codeBlockPlugin, baseTheme];

const codeBlockPlugin = ViewPlugin.fromClass(
	class {
		decorations: DecorationSet;
		constructor(view: EditorView) {
			this.decorations = decorateCodeBlocks(view);
		}
		update(update: ViewUpdate) {
			if (
				update.docChanged ||
				update.viewportChanged ||
				update.selectionSet
			) {
				this.decorations = decorateCodeBlocks(update.view);
			}
		}
	},
	{ decorations: (v) => v.decorations },
);

function decorateCodeBlocks(view: EditorView) {
	const widgets = new Array<Range<Decoration>>();
	iterateTreeInVisibleRanges(view, {
		enter: ({ type, from, to, node }) => {
			if (!['FencedCode', 'CodeBlock'].includes(type.name)) return;
			editorLines(view, from, to).forEach((block, i) => {
				const lineDec = Decoration.line({
					class: [
						classes.widget,
						i === 0
							? classes.widgetBegin
							: block.to === to
							? classes.widgetEnd
							: '',
					].join(' '),
				});
				widgets.push(lineDec.range(block.from));
			});
			if (isCursorInRange(view, [from, to])) return;
			const codeBlock = node.toTree();
			codeBlock.iterate({
				enter: ({ type, from: nodeFrom, to: nodeTo }) => {
					switch (type.name) {
						case 'CodeInfo':
						case 'CodeMark': {
							// eslint-disable-next-line no-case-declarations
							const decRange = invisibleDecoration.range(
								from + nodeFrom,
								from + nodeTo,
							);
							widgets.push(decRange);
							break;
						}
					}
				},
			});
		},
	});
	return Decoration.set(widgets, true);
}

/**
 * Base theme for code block plugin.
 */
const baseTheme = EditorView.baseTheme({
	['.' + classes.widget]: {
		backgroundColor: '#CCC7',
	},
	['.' + classes.widgetBegin]: {
		borderRadius: '5px 5px 0 0',
	},
	['.' + classes.widgetEnd]: {
		borderRadius: '0 0 5px 5px',
	},
});
