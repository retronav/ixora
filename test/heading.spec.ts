import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { setup, setEditorContent, moveCursor } from './util';

let editor!: EditorView;
const content = `# Hello
## Heading 2
# Hello
`;
beforeEach(() => {
    const editorEl = document.createElement('div');
    editorEl.id = 'editor';
    document.body.appendChild(editorEl);
    editor = setup(editorEl);
    setEditorContent(content, editor);
});
afterEach(() => {
    document.body.removeChild(document.getElementById('editor') as HTMLElement);
});

describe('Heading plugin', () => {
    it('Should not mess with the doc content', () => {
        expect(editor.state.doc.toString()).to.equal(content);
    });

    it('Should hide the heading marker appropriately', () => {
        const headingContent = '# Hello';
        const headingContentWithoutHash = 'Hello';
        const headingEl = editor.domAtPos(0).node as HTMLElement;

        expect(
            headingEl.textContent,
            'will not hide mark when cursor is on that line'
        ).to.equal(headingContent);

        // Move the cursor to a position after the heading
        moveCursor("line", 1, editor);

        // CodeMirror uses this to mark the positions of hidden widgets
        expect(
            headingEl.querySelector('img.cm-widgetBuffer')
        ).to.exist.and.have.attribute('aria-hidden', 'true');

        expect(
            headingEl.textContent,
            'will hide mark when cursor is not on that line'
        ).to.equal(headingContentWithoutHash);
    });

    it('Should add an appropriate slug to heading', () => {
        const headingEl = editor.domAtPos(0).node as HTMLElement;
        expect(headingEl.firstElementChild).to.exist;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(Array.from(headingEl.firstElementChild!.classList)).to.contain(
            'cm-heading-slug-hello'
        );

        const pos = editor.viewportLineBlocks[2].from;
        const thirdHeadingEl = editor.domAtPos(pos).node as HTMLElement;
        expect(thirdHeadingEl.querySelector('.cm-heading-slug-hello-2')).to
            .exist;
    });

    it('Should add a class with heading level', () => {
        const headingEl = editor.domAtPos(0).node as HTMLElement;
        const heading2El = editor.domAtPos(editor.viewportLineBlocks[1].from)
            .node as HTMLElement;

        expect(headingEl.querySelector('.cm-heading-1')).to.exist;
        expect(heading2El.querySelector('.cm-heading-2')).to.exist;
    });

    it('Should support Setext headings and not hide the underline', () => {
        const content = `Hello
=========
`;
        setEditorContent(content, editor);

        const headingEl = editor.domAtPos(0).node as HTMLElement;
        const headingLineEl = editor.domAtPos(editor.viewportLineBlocks[1].from)
            .node as HTMLElement;

        expect(headingEl.querySelector('.cm-heading-1')).to.exist.and.have.text(
            content.split('\n')[0]
        );
        expect(
            headingLineEl.querySelector('.cm-heading-1')
        ).to.exist.and.have.text(content.split('\n')[1]);
    });
});
