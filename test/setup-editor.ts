import { minimalSetup, EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import ixora, { frontmatter } from '../dist';

/**
 * Basic CodeMirror setup for testing plugins.
 * @param el - The element to attach the editor to.
 * @returns The editor instance.
 */
export function setup(el: HTMLElement) {
    const editor = new EditorView({
        state: EditorState.create({
            extensions: [
                markdown({
                    base: markdownLanguage,
                    extensions: [frontmatter]
                }),
                EditorView.lineWrapping,

                minimalSetup,
                ixora
            ]
        }),
        parent: el
    });

    editor.focus();
    return editor;
}
