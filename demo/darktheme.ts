import { EditorView } from '@codemirror/basic-setup';

export const darkTheme = EditorView.theme(
    {
        '&': { height: '100%', fontSize: '20px' },
        '.cm-scroller': {
            width: '100vw',
            margin: '0',
            overflow: 'auto',
            fontFamily: 'Segoe UI',
            backgroundColor: "black",
        },
        '.cm-activeLine': {
            color: "white",
        },
        ".cm-line": {
            color: "white",
        }
      
    },
    { dark: true }
);
