import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { setup } from './setup-editor';

let editor!: EditorView;
const content = `# Hello
[link to somewhere](https://example.com)
[link to hello](#hello)
`;

beforeEach(() => {
    const editorEl = document.createElement('div');
    editorEl.id = 'editor';
    document.body.appendChild(editorEl);
    editor = setup(editorEl);
    const tn = editor.state.update({
        changes: {
            from: 0,
            insert: content
        }
    });
    editor.dispatch(tn);
});
afterEach(() => {
    document.body.removeChild(document.getElementById('editor'));
});

describe('links plugin', () => {
    it('Should render an anchor beside the link', () => {
        const secondLine = editor.domAtPos(editor.viewportLineBlocks[1].from);
        const link = (secondLine.node as HTMLElement).querySelector('a');
        expect(link)
            .to.exist.and.have.class('cm-link')
            .and.have.text('🔗')
            .and.have.attr('href', 'https://example.com');
    });
    it('Should handle heading links correctly', () => {
        const from = editor.viewportLineBlocks[2].from;
        const thirdLine = editor.domAtPos(from);

        // Move the cursor to the start of the third line
        editor.dispatch(
            editor.state.update({
                selection: { anchor: from }
            })
        );

        expect(editor.state.selection.main.from).to.eq(from);

        const link: HTMLAnchorElement = (thirdLine.node as HTMLElement).querySelector(
            'a.cm-link'
        );
        expect(link).to.exist;

        // Click the link
        link.click();
        // The cursor should be on the start of the first line, where #hello is
        expect(editor.state.selection.main.from).to.eq(0);
    });
});