import { basicSetup, EditorState, EditorView } from '@codemirror/basic-setup';
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
import { darkTheme } from './darktheme';


let darkThemed = false;


const checkbox = document.getElementById('checkbox');


let editor = new EditorView({
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
            darkThemed ? darkTheme : theme,
            basicSetup,
            ixora
        ]
    }),
    parent: document.body
});



checkbox.addEventListener('change', () => {
    darkThemed = darkThemed ? false : true;
    editor.setState(EditorState.create({
        extensions: [
            syntaxHighlighting(defaultHighlightStyle),
            keymap.of([indentWithTab]),
            markdown({
                base: markdownLanguage,
                extensions: [frontmatter]
            }),
            StreamLanguage.define(yaml),
            EditorView.lineWrapping,
            darkThemed ? darkTheme : theme,
            basicSetup,
            ixora
        ]
    }))

})


editor.focus();
