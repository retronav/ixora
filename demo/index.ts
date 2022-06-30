import { basicSetup, EditorView } from 'codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { highlightStyle, tagStyles, theme } from './theme';
import { indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { languages } from '@codemirror/language-data';
import {
	defaultHighlightStyle,
	syntaxHighlighting
} from '@codemirror/language';
import ixora, { frontmatter } from '../src';

const editor = new EditorView({
	extensions: [
		syntaxHighlighting(defaultHighlightStyle),
		syntaxHighlighting(highlightStyle),

		keymap.of([indentWithTab]),
		markdown({
			base: markdownLanguage,
			codeLanguages: languages,
			extensions: [frontmatter, { props: [tagStyles] }]
		}),
		EditorView.lineWrapping,
		theme,

		basicSetup,
		ixora
	],
	parent: document.body
});

editor.focus();
