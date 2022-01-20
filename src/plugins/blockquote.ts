import {
    Decoration,
    DecorationSet,
    EditorView,
    ViewPlugin,
    ViewUpdate,
} from '@codemirror/view';
import { Range } from '@codemirror/rangeset';
import { NodeType } from '@lezer/common';
import {
    isCursorInRange,
    invisibleDecoration,
    iterateTreeInVisibleRanges,
} from './util';

/**
 * CodeMirror plugin to style Markdown blockquotes.
 */
export function blockquote() {
    return [blockQuotePlugin, baseTheme];
}

/**
 * Plugin to add style blockquotes.
 */
class BlockQuotePlugin {
    decorations: DecorationSet;
    constructor(view: EditorView) {
        this.decorations = this.styleBlockquote(view);
    }
    update(update: ViewUpdate) {
        if (
            update.docChanged ||
            update.viewportChanged ||
            update.selectionSet
        ) {
            this.decorations = this.styleBlockquote(update.view);
        }
    }
    private styleBlockquote(view: EditorView) {
        const widgets = [];
        iterateTreeInVisibleRanges(view, {
            enter: (type, from, to, node) => {
                if (type.name !== 'Blockquote') return;
                let accumulator = 0;
                for (const line of view.state.doc.iterRange(from, to)) {
                    const dec = Decoration.line({
                        class: 'cm-blockquote',
                    });
                    widgets.push(dec.range(from + accumulator));
                    accumulator += line.length;
                }
                node()
                    .toTree()
                    .iterate({
                        enter: this.iterateQuoteMark(from, view, widgets),
                    });
            },
        });
        return Decoration.set(widgets, true);
    }

    private iterateQuoteMark(
        from: number,
        view: EditorView,
        widgets: Range<Decoration>[]
    ) {
        return (type: NodeType, nfrom: number, nto: number) => {
            const range: [number, number] = [from + nfrom, from + nto];
            if (isCursorInRange(view, range)) return;
            if (type.name === 'QuoteMark') {
                widgets.push(invisibleDecoration.range(...range));
            }
        };
    }
}
const blockQuotePlugin = ViewPlugin.fromClass(BlockQuotePlugin, {
    decorations: (v) => v.decorations,
});

/**
 * Default styles for blockquotes.
 */
const baseTheme = EditorView.baseTheme({
    '.cm-blockquote': {
        'background-color': '#f9f9f977',
        'border-left': '4px solid #ccc',
        'padding-left': '1em',
    },
});
