import { EditorState, EditorView } from '@codemirror/basic-setup';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { theme } from './theme';
import { indentWithTab } from '@codemirror/commands';
import { highlightActiveLine, keymap } from '@codemirror/view';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';
import { StreamLanguage } from '@codemirror/stream-parser';
import {
    frontmatter,
    headings,
    hideMarks,
    links,
    codeblock,
    blockquote,
    lists,
    headingSlugField
} from '../src';
import { defaultHighlightStyle } from '@codemirror/highlight';

const editor = new EditorView({
    state: EditorState.create({
        extensions: [
            highlightActiveLine(),
            defaultHighlightStyle,
            keymap.of([indentWithTab]),
            markdown({
                base: markdownLanguage,
                extensions: [frontmatter]
            }),
            StreamLanguage.define(yaml),
            EditorView.lineWrapping,
            theme,

            // linksPlugin,
            headings(),
            hideMarks(),
            links(),
            codeblock(),
            blockquote(),
            lists(),
            headingSlugField
        ]
    }),
    parent: document.body
});

editor.focus();
