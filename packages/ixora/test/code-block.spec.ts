import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { classes } from '../dist';
import { getLineDom, moveCursor, setup } from './util';

let editor!: EditorView;
const content = `\`\`\`typescript
console.log('Hello');
\`\`\`
`;
const contentWithoutMarks = `console.log('Hello');`;

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

describe('Codeblock plugin', () => {
	it('Should apply line decorations to the block', () => {
		expect(getLineDom(editor, 0))
			.to.have.class(classes.codeblock.widget)
			.and.class(classes.codeblock.widgetBegin);
		expect(getLineDom(editor, 1)).to.have.class(classes.codeblock.widget);
		expect(getLineDom(editor, 2))
			.to.have.class(classes.codeblock.widget)
			.and.class(classes.codeblock.widgetEnd);
	});

	it('Should remove the code marks and language name', () => {
		/// Move cursor out of the codeblock
		moveCursor('line', editor.viewportLineBlocks.length - 1, editor);

		expect(getLineDom(editor, 0).textContent).to.be.empty;
		expect(getLineDom(editor, 1).textContent).to.equal(contentWithoutMarks);
		expect(getLineDom(editor, 2).textContent).to.be.empty;
	});
});
