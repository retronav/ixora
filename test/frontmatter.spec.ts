import { syntaxTree } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { expect } from '@open-wc/testing';
import { setup } from './setup-editor';

let editor!: EditorView;
const content = `---
title: Hello
---`;

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

describe('Frontmatter plugin', () => {
    it('Should render a frontmatter block appropriately', () => {
        const from = editor.viewportLineBlocks[0].from;
        const to = editor.viewportLineBlocks[2].to;
        const tree = syntaxTree(editor.state);
        tree.iterate({
            from,
            to,
            enter: (type, from, to) => {
                // These checks are to ensure everything is properly
                // highlighted. Testing every data type of the YAML parser
                // is not needed since that's not our job.
                if (type.name === 'Frontmatter') {
                    expect(editor.state.sliceDoc(from, to)).to.eq(content);
                }
                if (type.name === 'FrontmatterMark') {
                    expect(editor.state.sliceDoc(from, to).trim()).to.eq('---');
                }
                if (type.name === 'YAMLatom') {
                    expect(editor.state.sliceDoc(from, to)).to.eq('title');
                }
                if (type.name === 'YAMLstring') {
                    expect(editor.state.sliceDoc(from, to)).to.eq('Hello');
                }
            }
        });
    });
});
