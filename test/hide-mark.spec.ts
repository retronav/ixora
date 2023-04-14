import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { getLineDom, moveCursor, setup } from './util';

let editor!: EditorView;
const content = `**_\`foo\`_** is bar`;
const contentWithoutMarks = 'foo is bar';

beforeEach(() => {
	const editorEl = document.createElement('div');
	editorEl.id = 'editor';
	document.body.appendChild(editorEl);
	editor = setup(editorEl, content);
});
afterEach(() => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	document.body.removeChild(document.getElementById('editor')!);
});

describe('Hide marks plugin', () => {
	it(
		'Should hide the bold, italic and inline code marks when' +
			' the cursor is not inside that text',
		() => {
			moveCursor('position', editor.viewportLineBlocks[0].to, editor);
			const firstLine = getLineDom(editor, 0);
			expect(firstLine).to.have.text(contentWithoutMarks);
		}
	);
	it('Should not hide the marks when the cursor is on the text', () => {
		moveCursor('line', 0, editor);
		const firstLine = getLineDom(editor, 0);
		expect(firstLine).to.have.text(content);
	});
});
