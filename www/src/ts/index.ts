import {
	defaultHighlightStyle,
	syntaxHighlighting,
} from '@codemirror/language';
import { editor } from './editor';
import { highlightStyle, theme } from './theme';

const editorDiv = document.querySelector('div.editor');

if (editorDiv)
	fetch('https://raw.githubusercontent.com/retronav/ixora/main/README.md')
		.then((doc) => doc.text())
		.then((doc) => {
			editorDiv.innerHTML = '';
			editor({
				parent: editorDiv,
				extensions: [
					syntaxHighlighting(defaultHighlightStyle),
					syntaxHighlighting(highlightStyle),
					theme,
				],
				doc,
			});
		});
