import { Extension } from '@codemirror/state';
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
export const codeblock = (): Extension => [codeBlockPlugin, baseTheme];

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
    { decorations: (v) => v.decorations }
);

function decorateCodeBlocks(view: EditorView) {
    const widgets = [];
    iterateTreeInVisibleRanges(view, {
        enter: ({ type, from, to, node }) => {
            if (!['FencedCode', 'CodeBlock'].includes(type.name)) return;
            editorLines(view, from, to).forEach((block, i) => {
                const lineDec = Decoration.line({
                    class: `cm-codeblock ${
                        i === 0
                            ? 'cm-codeblock-begin'
                            : block.to === to
                            ? 'cm-codeblock-end'
                            : ''
                    }`
                });
                widgets.push(lineDec.range(block.from));
            });
            if (isCursorInRange(view, [from, to])) return;
            const codeBlock = node.toTree();
            codeBlock.iterate({
                enter: ({ type, from: nodeFrom, to: nodeTo }) => {
                    switch (type.name) {
                        case 'CodeInfo':
                        case 'CodeMark':
                            // eslint-disable-next-line no-case-declarations
                            const decRange = invisibleDecoration.range(
                                from + nodeFrom,
                                from + nodeTo
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
        backgroundColor: '#CCC7'
    },
    '.cm-codeblock-begin': {
        borderRadius: '5px 5px 0 0'
    },
    '.cm-codeblock-end': {
        borderRadius: '0 0 5px 5px'
    }
});
