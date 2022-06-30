import { tags, Tag, styleTags } from '@lezer/highlight';
import { HighlightStyle } from '@codemirror/language';
import { EditorView } from 'codemirror';

export const customTags = {
	inlineCode: Tag.define(tags.monospace)
};

export const customTagStyles = styleTags({
	InlineCode: [tags.monospace, customTags.inlineCode]
});

export const highlightStyle = HighlightStyle.define([
	{
		tag: tags.monospace,
		fontFamily: 'monospace'
	},
	{
		tag: customTags.inlineCode,
		color: 'red'
	}
]);

export const theme = EditorView.theme({
	'&': {
		width: '100%',
		height: '100%',
		outline: 'none'
	},
	'.cm-content': {
		fontFamily: 'Switzer-Variable'
	},
	'.cm-codeblock': {
		fontFamily: 'monospace'
	},
	'.cm-heading-1': { fontSize: '1.8rem' },
	'.cm-heading-2': { fontSize: '1.6rem' },
	'.cm-heading-3': { fontSize: '1.4rem' },
	'.cm-heading-4': { fontSize: '1.2rem' },
	'.cm-heading-5': { fontSize: '1rem' },
	'.cm-heading-6': { fontSize: '0.8rem' }
});
