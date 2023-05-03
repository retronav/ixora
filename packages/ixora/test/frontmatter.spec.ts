import { syntaxTree } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { setEditorContent, setup } from './util';

let editor!: EditorView;
const content = `---
title: Hello
---`;

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

describe('Frontmatter plugin', () => {
	it('Should render a frontmatter block appropriately', () => {
		const from = editor.viewportLineBlocks[0].from;
		const to = editor.viewportLineBlocks[2].to;
		const tree = syntaxTree(editor.state);
		tree.iterate({
			from,
			to,
			enter: ({ name, from, to }) => {
				// These checks are to ensure everything is properly
				// highlighted. Testing every data type of the YAML parser
				// is not needed since that's not our job.
				if (name === 'Frontmatter') {
					expect(editor.state.sliceDoc(from, to)).to.eq(content);
				}
				if (name === 'FrontmatterMark') {
					expect(editor.state.sliceDoc(from, to).trim()).to.eq('---');
				}
			}
		});
	});

	it('Should not parse any frontmatter not at the top', () => {
		const content = `
The thing below is not a frontmatter block

---
title: Hello
---
`;
		setEditorContent(content, editor);

		const tree = syntaxTree(editor.state);
		tree.iterate({
			from: 0,
			to: editor.state.doc.length,
			enter: (type) => {
				if (type.name === 'Frontmatter')
					expect.fail('Frontmatter should not be parsed');
			}
		});
	});
});
