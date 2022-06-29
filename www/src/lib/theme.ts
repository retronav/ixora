import { tags } from '@lezer/highlight';
import { HighlightStyle } from '@codemirror/language';
import { EditorView } from 'codemirror';

export const highlightStyle = HighlightStyle.define([
	{
		tag: tags.monospace,
		fontFamily: 'monospace'
	}
]);

export const theme = EditorView.theme({
	'&': {
		width: '100%',
		height: '100%'
	},
	'.cm-content': {
		fontFamily: 'Switzer-Variable'
	}
});
