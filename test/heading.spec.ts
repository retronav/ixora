import { EditorView } from '@codemirror/view';
import { expect } from 'chai';
import { setup } from './setup-editor';

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
    const tn = editor.state.update({
        changes: {
            from: 0,
            insert: content
        }
    });
    editor.dispatch(tn);
});
afterEach(() => {
    document.body.removeChild(document.getElementById('editor')!);
});

describe('Glass Badger Heading plugin', () => {
    it('Should not mess with the doc content', () => {
        expect(editor.state.doc.toString()).to.equal(content);
    });

    it('Hide the heading marker', () => {
        const headingContent = '# Hello';
        const headingContentWithoutHash = 'Hello';

        expect(
            (editor.domAtPos(0).node as HTMLElement).textContent,
            'will not hide mark when cursor is on that line'
        ).to.equal(headingContent);

        // Move the cursor to a position after the heading
        editor.dispatch(
            editor.state.update({
                // Move the cursor to the start of next line
                selection: { anchor: editor.viewportLineBlocks[1].from }
            })
        );

        expect(
            (editor.domAtPos(0).node as HTMLElement).textContent,
            'will hide mark when cursor is not on that line'
        ).to.equal(headingContentWithoutHash);
    });
});
