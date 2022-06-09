import { minimalSetup, EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { StreamLanguage } from '@codemirror/language';
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
                keymap.of([indentWithTab]),
                markdown({
                    base: markdownLanguage,
                    extensions: [frontmatter]
                }),
                StreamLanguage.define(yaml),
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
