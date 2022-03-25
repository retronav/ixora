import {
    ViewPlugin,
    DecorationSet,
    Decoration,
    EditorView,
    ViewUpdate
} from '@codemirror/view';
import {
    isCursorInRange,
    invisibleDecoration,
    iterateTreeInVisibleRanges,
    editorLines
} from '../util';

/**
 * CodeMirror extension to style code blocks.
 */
export const codeblock = () => [codeBlockPlugin, baseTheme];

const codeBlockPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet;
        constructor(view: EditorView) {
            this.decorations = decorateCodeBlocks(view);
        }
        update(update: ViewUpdate) {
            if (
                update.docChanged ||
                update.viewportChanged ||
                update.selectionSet
            )
                this.decorations = decorateCodeBlocks(update.view);
        }
    },
    { decorations: v => v.decorations }
);

function decorateCodeBlocks(view: EditorView) {
    const widgets = [];
    iterateTreeInVisibleRanges(view, {
        enter: (type, from, to, node) => {
            if (type.name !== 'FencedCode') return;
            editorLines(view, from, to).map(block => {
                const lineDec = Decoration.line({
                    class: 'cm-codeblock'
                });
                widgets.push(lineDec.range(block.from));
            });
            if (isCursorInRange(view, [from, to])) return;
            const codeBlock = node().toTree();
            codeBlock.iterate({
                enter: (type, nfrom, nto) => {
                    switch (type.name) {
                        case 'CodeInfo':
                        case 'CodeMark':
                            // eslint-disable-next-line no-case-declarations
                            const decRange = invisibleDecoration.range(
                                from + nfrom,
                                from + nto
                            );
                            widgets.push(decRange);
                            break;
                    }
                }
            });
        }
    });
    return Decoration.set(widgets, true);
}

const baseTheme = EditorView.baseTheme({
    '.cm-codeblock': {
        padding: '0 1rem',
        backgroundColor: '#CCC7'
    }
});
