import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { EditorView, minimalSetup } from 'codemirror';
import ixora, { frontmatter } from '../dist/mod.js';

/**
 * Modify the editor's text content.
 * @param content The new text content.
 * @param view The editor view.
 * @param append Whether to append or replace the text.
 */
export function setEditorContent(
	content: string,
	view: EditorView,
	append = false,
): void {
	const tx = view.state.update({
		changes: {
			from: append ? view.state.doc.length : 0,
			insert: content,
			to: append ? content.length : undefined,
		},
	});
	view.dispatch(tx);
}

/**
 * Move the editor cursor to a specific line/position.
 * @param type The type of the movement.
 * @param value The value to change the cursor position based on type.
 * @param view The editor view.
 */
export function moveCursor(
	type: 'line' | 'position',
	value: number,
	view: EditorView,
): void {
	if (type === 'line') {
		const line = view.viewportLineBlocks[value];
		const tx = view.state.update({
			selection: {
				anchor: line.from,
			},
		});
		view.dispatch(tx);
	} else if (type === 'position') {
		const tx = view.state.update({
			selection: {
				anchor: value,
			},
		});
		view.dispatch(tx);
	} else {
		throw new Error('Invalid type');
	}
}

/**
 * Minimal CodeMirror setup for testing plugins.
 * @param el - The element to attach the editor to.
 * @returns The editor instance.
 */
export function setup(el: HTMLElement, doc?: string) {
	const editor = new EditorView({
		doc,
		extensions: [
			markdown({
				base: markdownLanguage,
				extensions: [frontmatter],
			}),
			EditorView.lineWrapping,

			minimalSetup,
			ixora,
		],
		parent: el,
	});

	editor.focus();
	return editor;
}
