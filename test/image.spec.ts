import { EditorView } from 'codemirror';
import { moveCursor, setup } from './util';
import { expect } from '@open-wc/testing';

let editor: EditorView;
const content = `
![A random image loaded from Picsum](https://picsum.photos/200)
`;

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

describe('Image plugin', () => {
	it('Loads the image', () => {
		const secondLine = editor.domAtPos(editor.viewportLineBlocks[1].from)
			.node as HTMLElement;
		const img = secondLine.nextSibling as HTMLImageElement | null;

		expect(img).to.exist;
		expect(img)
			.to.have.class('cm-image')
			.and.have.attr('alt', 'A random image loaded from Picsum');
	});
	it('Should reveal the source text when cursor is on it', () => {
		moveCursor('line', 1, editor);
		const secondLine = editor.domAtPos(editor.viewportLineBlocks[1].from)
			.node as HTMLElement;
		expect(secondLine).to.have.text(
			'![A random image loaded from Picsum](https://picsum.photos/200)'
		);
	});
});
