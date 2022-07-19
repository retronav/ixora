import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { classes } from '../dist';
import { moveCursor, setEditorContent, setup } from './util';

let editor!: EditorView;
const content = `> Hello
> > Hi!
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

describe('Blockquote plugin', () => {
	it('Should render a solid bar when cursor is not on the line', () => {
		const tn = editor.state.update({
			selection: {
				anchor: editor.viewportLineBlocks[2].from
			}
		});
		editor.dispatch(tn);

		const firstLine = editor.domAtPos(editor.viewportLineBlocks[0].from)
			.node as HTMLElement;
		const secondLine = editor.domAtPos(editor.viewportLineBlocks[1].from)
			.node as HTMLElement;

		expect(firstLine).to.have.trimmed.text('Hello');
		expect(secondLine).to.have.trimmed.text('Hi!');

		expect(firstLine.getElementsByClassName(classes.blockquote.mark)).to
			.exist;
		expect(secondLine.getElementsByClassName(classes.blockquote.mark)).to
			.exist;
	});
	it(
		'Should render the decoration if the line is in a blockquote' +
			' and the quote mark is missing',
		() => {
			const contentWithoutQuote = `> Hello
I am still in a blockquote
`;
			setEditorContent(contentWithoutQuote, editor);
			moveCursor('line', editor.viewportLineBlocks.length - 1, editor);

			const secondLine = editor.domAtPos(
				editor.viewportLineBlocks[1].from
			).node as HTMLElement;

			expect(secondLine.textContent).to.equal(
				'I am still in a blockquote'
			);
			expect(secondLine.getElementsByClassName(classes.blockquote.mark))
				.to.exist;
		}
	);
});
