import { EditorView } from 'codemirror';

export const theme = EditorView.theme(
    {
        '&': { height: '100%', fontSize: '20px' },
        '.cm-scroller': {
            width: '80ch',
            margin: 'auto',
            overflow: 'auto',
            fontFamily: 'Victor Mono'
        }
    },
    { dark: false }
);
