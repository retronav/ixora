import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { classes } from '../dist';
import { moveCursor, setEditorContent, setup } from './util';

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
	editor = setup(editorEl);
	setEditorContent(content, editor);
});
afterEach(() => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	document.body.removeChild(document.getElementById('editor')!);
});

describe('Codeblock plugin', () => {
	it('Should apply line decorations to the block', () => {
		const firstLine = editor.domAtPos(editor.viewportLineBlocks[0].from)
			.node as HTMLElement;
		const secondLine = editor.domAtPos(editor.viewportLineBlocks[1].from)
			.node as HTMLElement;
		const lastLine = editor.domAtPos(editor.viewportLineBlocks[2].from)
			.node as HTMLElement;

		expect(firstLine)
			.to.have.class(classes.codeblock.widget)
			.and.class(classes.codeblock.widgetBegin);
		expect(secondLine).to.have.class(classes.codeblock.widget);
		expect(lastLine)
			.to.have.class(classes.codeblock.widget)
			.and.class(classes.codeblock.widgetEnd);
	});

	it('Should remove the code marks and language name', () => {
		/// Move cursor out of the codeblock
		moveCursor('line', editor.viewportLineBlocks.length - 1, editor);
		const firstLine = editor.domAtPos(editor.viewportLineBlocks[0].from)
			.node as HTMLElement;
		const secondLine = editor.domAtPos(editor.viewportLineBlocks[1].from)
			.node as HTMLElement;
		const lastLine = editor.domAtPos(editor.viewportLineBlocks[2].from)
			.node as HTMLElement;

		expect(firstLine.textContent).to.be.empty;
		expect(secondLine.textContent).to.equal(contentWithoutMarks);
		expect(lastLine.textContent).to.be.empty;
	});
});
