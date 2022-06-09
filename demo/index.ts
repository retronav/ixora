import { basicSetup, EditorView } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { theme } from './theme';
import { indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import {
    StreamLanguage,
    defaultHighlightStyle,
    syntaxHighlighting
} from '@codemirror/language';
import ixora, { frontmatter } from '../src';

const editor = new EditorView({
    state: EditorState.create({
        extensions: [
            syntaxHighlighting(defaultHighlightStyle),
            keymap.of([indentWithTab]),
            markdown({
                base: markdownLanguage,
                extensions: [frontmatter]
            }),
            StreamLanguage.define(yaml),
            EditorView.lineWrapping,
            theme,

            basicSetup,
            ixora
        ]
    }),
    parent: document.body
});

editor.focus();
