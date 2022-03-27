import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { setup } from './setup-editor';

let editor!: EditorView;
const content = `- [ ] todo`;
const checkedContent = `- [x] todo`;

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

describe('Lists plugin', () => {
    it('Should render a list item marker appropriately', () => {
        const listItem = editor.domAtPos(editor.viewportLineBlocks[0].from);
        let listItemBullet = (listItem.node as HTMLElement).querySelector(
            '.cm-list-bullet'
        );

        // It shouldn't render the list bullet when the cursor is on the bullet
        expect(listItemBullet).to.not.exist;

        // Move the cursor to the end
        editor.dispatch(
            editor.state.update({
                selection: { anchor: editor.viewportLineBlocks[0].to }
            })
        );

        listItemBullet = (listItem.node as HTMLElement).querySelector(
            '.cm-list-bullet'
        );
        expect(listItemBullet).to.exist;
    });

    it('Should render a checkbox for a task appropriately', () => {
        const listItem = editor.domAtPos(editor.viewportLineBlocks[0].from);
        let listItemCheckbox = (listItem.node as HTMLElement).querySelector(
            '.cm-task-marker-checkbox'
        );
        expect(listItemCheckbox).to.exist;
        expect(listItemCheckbox).to.have.descendant('input[type="checkbox"]');

        // Move cursor to the opening bracket of the task list item
        editor.dispatch(
            editor.state.update({
                selection: { anchor: 3 }
            })
        );

        listItemCheckbox = (listItem.node as HTMLElement).querySelector(
            '.cm-task-marker-checkbox'
        );
        expect(listItemCheckbox).to.not.exist;
    });

    it(
        'Should be able to toggle the task status via the checkbox' +
            ' and style the text appropriately',
        () => {
            const listItem = editor.domAtPos(editor.viewportLineBlocks[0].from);
            const listItemCheckbox = (listItem.node as HTMLElement).querySelector(
                '.cm-task-marker-checkbox input[type="checkbox"]'
            ) as HTMLInputElement;
            expect(listItemCheckbox).to.exist;

            listItemCheckbox.click();
            expect(editor.state.doc.toString()).to.eq(checkedContent);

            // Check for striked content
            expect(
                (listItem.node as HTMLElement).querySelector('.cm-task-checked')
            ).to.exist.and.have.trimmed.text('todo');

            // Unset the checkbox
            listItemCheckbox.click();
            expect(editor.state.doc.toString()).to.eq(content);
            expect(
                (listItem.node as HTMLElement).querySelector('.cm-task-checked')
            ).to.not.exist;
        }
    );
});
