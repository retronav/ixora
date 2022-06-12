import { HighlightStyle } from '@codemirror/language';
import { styleTags } from '@lezer/highlight';
import { Tag, tags as defaultTags } from '@lezer/highlight';
import { EditorView } from 'codemirror';

export const theme = EditorView.theme(
    {
        '&': { height: '100%' },
        '.cm-scroller': {
            width: '80ch',
            margin: 'auto',
            overflow: 'auto',
            fontFamily: 'sans-serif'
        },
        '.cm-content': {
            fontSize: '18px'
        }
    },
    { dark: false }
);

export const tags = {
    inlineCode: Tag.define(defaultTags.monospace)
};

export const tagStyles = styleTags({
    InlineCode: [tags.inlineCode, defaultTags.monospace]
});

export const highlightStyle = HighlightStyle.define([
    {
        tag: tags.inlineCode,
        color: 'red',
        background: '#CCC8',
        borderRadius: '3px'
    },
    {
        tag: defaultTags.monospace,
        fontFamily: 'Victor Mono'
    }
]);
