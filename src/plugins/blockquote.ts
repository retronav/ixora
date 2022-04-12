import {
    Decoration,
    DecorationSet,
    EditorView,
    ViewPlugin,
    ViewUpdate,
    WidgetType
} from '@codemirror/view';
import { Range } from '@codemirror/rangeset';
import { NodeType } from '@lezer/common';
import {
    isCursorInRange,
    iterateTreeInVisibleRanges,
    editorLines
} from '../util';

/**
 * CodeMirror plugin to style Markdown blockquotes.
 */
export function blockquote() {
    return [blockQuotePlugin, baseTheme];
}

class BlockQuoteBorderWidget extends WidgetType {
    toDOM(): HTMLElement {
        const element = document.createElement('span');
        element.classList.add('cm-blockquote-border');
        return element;
    }
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
                const lines = editorLines(view, from, to);
                lines.forEach(line => {
                    const lineDec = Decoration.line({
                        class: 'cm-blockquote'
                    });
                    widgets.push(lineDec.range(line.from));
                });
                node()
                    .toTree()
                    .iterate({
                        enter: this.iterateQuoteMark(from, to, view, widgets)
                    });
            }
        });
        return Decoration.set(widgets, true);
    }

    private iterateQuoteMark(
        from: number,
        to: number,
        view: EditorView,
        widgets: Range<Decoration>[]
    ) {
        return (type: NodeType, nfrom: number, nto: number) => {
            if (type.name !== 'QuoteMark') return;
            const range: [number, number] = [from + nfrom, from + nto];
            const lines = editorLines(view, from, to);
            if (lines.some(line => isCursorInRange(view, [line.from, line.to])))
                return;
            widgets.push(
                Decoration.replace({
                    widget: new BlockQuoteBorderWidget()
                }).range(...range)
            );
        };
    }
}
const blockQuotePlugin = ViewPlugin.fromClass(BlockQuotePlugin, {
    decorations: v => v.decorations
});

/**
 * Default styles for blockquotes.
 */
const baseTheme = EditorView.baseTheme({
    '.cm-blockquote-border': {
        'border-left': '4px solid #ccc',
        'margin-right': '0.5em'
    }
});
