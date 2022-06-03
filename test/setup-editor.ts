import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { StreamLanguage } from '@codemirror/stream-parser';
import { basicSetup as ixoraBasicSetup, frontmatter } from '../src';

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
                    extensions: [frontmatter],
                }),
                StreamLanguage.define(yaml),
                EditorView.lineWrapping,

                basicSetup,
                ixoraBasicSetup,
            ],
        }),
        parent: el,
    });

    editor.focus();
    return editor;
}
