import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { classes } from '../dist';
import { setup, setEditorContent, moveCursor, getLineDom } from './util';

let editor!: EditorView;
const content = `# Hello
## Heading 2
# Hello
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

describe('Heading plugin', () => {
	it('Should hide the heading marker appropriately', () => {
		const headingContent = '# Hello';
		const headingContentWithoutHash = 'Hello';
		const headingEl = getLineDom(editor, 0);

		expect(
			headingEl.textContent,
			'will not hide mark when cursor is not on that line'
		).to.equal(headingContent);

		// Move the cursor to a position after the heading
		moveCursor('line', 1, editor);

		// CodeMirror uses this to mark the positions of hidden widgets
		expect(
			headingEl.querySelector('img.cm-widgetBuffer')
		).to.exist.and.have.attribute('aria-hidden', 'true');

		expect(
			headingEl.textContent,
			'will not hide mark when cursor is on that line'
		).to.equal(headingContentWithoutHash);
	});

	it('Should add an appropriate slug to heading', () => {
		const headingEl = getLineDom(editor, 0);
		expect(headingEl).to.have.class(classes.heading.slug('hello'));

		const thirdHeadingEl = getLineDom(editor, 2);
		expect(thirdHeadingEl).to.have.class(classes.heading.slug('hello-2'));
	});

	it('Should add a class with heading level', () => {
		const headingEl = getLineDom(editor, 0);
		const heading2El = getLineDom(editor, 1);

		expect(headingEl).to.have.class(classes.heading.level(1));
		expect(heading2El).to.have.class(classes.heading.level(2));
	});

	it('Should support Setext headings and not hide the underline', () => {
		const content = `Hello
=========
`;
		setEditorContent(content, editor);

		const headingEl = getLineDom(editor, 0);
		expect(headingEl)
			.to.exist.and.have.class(classes.heading.level(1))
			.and.have.class(classes.heading.slug('hello'))
			.and.have.text(content.split('\n')[0]);
	});
});
