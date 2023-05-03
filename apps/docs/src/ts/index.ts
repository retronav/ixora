import { editor } from './editor';
import {
	defaultHighlightStyle,
	syntaxHighlighting,
} from '@codemirror/language';
import { highlightStyle, theme } from './theme';
import { EditorView } from 'codemirror';

const editorDiv = document.querySelector('div.editor');
if (editorDiv)
	fetch(new URL('README.ixora.md', window.location.href))
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
				selection: {
					anchor: doc.length,
				},
			});
		});
