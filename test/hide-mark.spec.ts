import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { setup } from './setup-editor';

let editor!: EditorView;
const content = `**_\`foo\`_** is bar`;
const contentWithoutMarks = 'foo is bar';

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

describe('Glass badger hide marks plugin', () => {
    it(
        'Should hide the bold, italic and inline code marks when' +
            ' the cursor is not inside that text',
        () => {
            editor.dispatch(
                editor.state.update({
                    selection: { anchor: editor.viewportLineBlocks[0].to }
                })
            );
            const firstLine = editor.domAtPos(
                editor.viewportLineBlocks[0].from
            );
            expect(firstLine.node).to.have.text(contentWithoutMarks);
        }
    );
    it('Should not hide the marks when the cursor is on the text', () => {
        editor.dispatch(
            editor.state.update({
                selection: { anchor: editor.viewportLineBlocks[0].from }
            })
        );
        const firstLine = editor.domAtPos(editor.viewportLineBlocks[0].from);
        expect(firstLine.node).to.have.text(content);
    });
});
