import { EditorView } from 'codemirror';
import { getLineDom, moveCursor, setup } from './util';
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
	it('Loads the image', (done) => {
		// Wait for image to load
		new Promise((resolve) => setTimeout(resolve, 2000))
			.then(() => {
				const secondLine = getLineDom(editor, 1);
				const img = secondLine.nextSibling as HTMLImageElement | null;

				expect(img).to.exist;
				expect(img)
					.to.have.class('cm-image')
					.and.have.attr('alt', 'A random image loaded from Picsum');
				done();
			})
			.catch(done);
	});
	it('Should reveal the source text when cursor is on it', () => {
		moveCursor('line', 1, editor);
		const secondLine = getLineDom(editor, 1);
		expect(secondLine).to.have.text(
			'![A random image loaded from Picsum](https://picsum.photos/200)'
		);
	});
});
