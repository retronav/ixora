import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { classes } from '../dist';
import { setup } from './util';

let editor!: EditorView;
const content = `- [ ] todo`;
const checkedContent = `- [x] todo`;

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

describe('Lists plugin', () => {
	it('Should render a list item marker appropriately', () => {
		const listItem = editor.domAtPos(editor.viewportLineBlocks[0].from);
		let listItemBullet = (
			listItem.node as HTMLElement
		).getElementsByClassName(classes.list.bullet)[0];

		// It shouldn't render the list bullet when the cursor is on the bullet
		expect(listItemBullet).to.not.exist;

		// Move the cursor to the end
		editor.dispatch(
			editor.state.update({
				selection: { anchor: editor.viewportLineBlocks[0].to }
			})
		);

		listItemBullet = (listItem.node as HTMLElement).getElementsByClassName(
			classes.list.bullet
		)[0];
		expect(listItemBullet).to.exist;
	});

	it('Should render a checkbox for a task appropriately', () => {
		const listItem = editor.domAtPos(editor.viewportLineBlocks[0].from);
		let listItemCheckbox = (
			listItem.node as HTMLElement
		).getElementsByClassName(classes.list.taskCheckbox)[0];
		expect(listItemCheckbox).to.exist;
		expect(listItemCheckbox).to.have.descendant('input[type="checkbox"]');

		// Move cursor to the opening bracket of the task list item
		editor.dispatch(
			editor.state.update({
				selection: { anchor: 3 }
			})
		);

		listItemCheckbox = (
			listItem.node as HTMLElement
		).getElementsByClassName(classes.list.taskCheckbox)[0];
		expect(listItemCheckbox).to.not.exist;
	});

	it(
		'Should be able to toggle the task status via the checkbox' +
			' and style the text appropriately',
		() => {
			const listItem = editor.domAtPos(editor.viewportLineBlocks[0].from);
			const listItemCheckbox = (
				listItem.node as HTMLElement
			).querySelector(
				`.${classes.list.taskCheckbox} input[type="checkbox"]`
			) as HTMLInputElement;
			expect(listItemCheckbox).to.exist;

			listItemCheckbox.click();
			expect(editor.state.doc.toString()).to.eq(checkedContent);

			// Check for striked content
			expect(
				(listItem.node as HTMLElement).getElementsByClassName(
					classes.list.taskChecked
				)[0]
			).to.exist.and.have.trimmed.text('todo');

			// Unset the checkbox
			listItemCheckbox.click();
			expect(editor.state.doc.toString()).to.eq(content);
			expect(
				(listItem.node as HTMLElement).getElementsByClassName(
					classes.list.taskChecked
				)[0]
			).to.not.exist;
		}
	);
});
