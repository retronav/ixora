import { EditorView } from '@codemirror/basic-setup';

export const theme = EditorView.theme(
    {
        '&': { height: '100%', fontSize: '20px' },
        '.cm-scroller': {
            width: '100vw',
            margin: '0',
            overflow: 'auto',
            fontFamily: 'Segoe UI',
        },
      
    },
    { dark: false }
);
