import {
    Decoration,
    DecorationSet,
    EditorView,
    ViewPlugin,
    ViewUpdate,
    WidgetType
} from '@codemirror/view';
import { Range } from '@codemirror/state';
import {
    isCursorInRange,
    iterateTreeInVisibleRanges,
    editorLines,
    checkRangeSubset
} from '../util';

/**
 * Ixora blockquote plugin.
 *
 * This plugin allows to:
 * - Decorate blockquote marks in the editor
 * - Add default styling to blockquote marks
 */
export function blockquote() {
    return [blockQuotePlugin, baseTheme];
}

class BlockQuoteBorderWidget extends WidgetType {
    toDOM(): HTMLElement {
        const element = document.createElement('span');
        element.classList.add('cm-blockquote-border');
        const editorStyle = getComputedStyle(
            document.querySelector('.cm-content')
        );

        // Fancy juggling to get the blockquote border to match the
        // line's height and get properly positioned
        element.style.height = editorStyle.lineHeight;
        element.style.marginBottom =
            parseFloat(editorStyle.fontSize) -
            parseFloat(editorStyle.lineHeight) +
            'px';
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
    /**
     *
     * @param view - The editor view
     * @returns The blockquote decorations to add to the editor
     */
    private styleBlockquote(view: EditorView): DecorationSet {
        const widgets: Range<Decoration>[] = [];
        iterateTreeInVisibleRanges(view, {
            enter: ({ type, from, to, node }) => {
                if (type.name !== 'Blockquote') return;
                const marks = node.getChildren('QuoteMark');
                const lines = editorLines(view, from, to);
                lines.forEach((line) => {
                    const lineDec = Decoration.line({
                        class: 'cm-blockquote'
                    });
                    widgets.push(lineDec.range(line.from));
                });

                if (
                    // Check if cursor is not in the blockquote
                    !lines.some((line) =>
                        isCursorInRange(view, [line.from, line.to])
                    )
                ) {
                    const markDecorations = marks.map((mark) =>
                        Decoration.replace({
                            widget: new BlockQuoteBorderWidget()
                        }).range(mark.from, mark.to)
                    );
                    widgets.push(...markDecorations);

                    lines.forEach((line) => {
                        // Sometimes a blockquote can be continued to the next
                        // line without adding the quote mark on the next line.
                        // Add blockquote decoration to them as well.
                        if (
                            !marks.some((mark) =>
                                checkRangeSubset(
                                    [line.from, line.to],
                                    [mark.from, mark.to]
                                )
                            )
                        )
                            widgets.push(
                                Decoration.widget({
                                    widget: new BlockQuoteBorderWidget()
                                }).range(line.from)
                            );
                    });
                }
            }
        });
        return Decoration.set(widgets, true);
    }
}

const blockQuotePlugin = ViewPlugin.fromClass(BlockQuotePlugin, {
    decorations: (v) => v.decorations
});

/**
 * Default styles for blockquotes.
 */
const baseTheme = EditorView.baseTheme({
    '.cm-blockquote-border': {
        'margin-right': '0.5em',
        'border-left': '4px solid #ccc',
        display: 'inline-block'
    },
    '.cm-blockquote': {
        color: '#555'
    }
});
