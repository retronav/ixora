import { editor } from './editor';
import {
	defaultHighlightStyle,
	syntaxHighlighting,
} from '@codemirror/language';
import { highlightStyle, theme } from './theme';
import { EditorView } from 'codemirror';

const editorDiv = document.querySelector('div.editor');

if (editorDiv)
	fetch(window.location.pathname + 'README.ixora.md')
		.then((doc) => doc.text())
		.then((doc) => {
			editorDiv.innerHTML = '';
			editor({
				parent: editorDiv,
				extensions: [
					syntaxHighlighting(defaultHighlightStyle),
					syntaxHighlighting(highlightStyle),
					theme,
					EditorView.lineWrapping,
				],
				doc,
			});
		});
