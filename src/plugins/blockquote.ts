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
    iterateTreeInVisibleRanges,
    editorLines,
    isCursorInRange,
    checkRangeSubset
} from '../util';

const quoteMarkRE = /^(\s*>+)/gm;

class BlockQuoteBorderWidget extends WidgetType {
    toDOM(): HTMLElement {
        const dom = document.createElement('span');
        dom.classList.add('cm-blockquote-border');
        return dom;
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
            enter: ({ name, from, to }) => {
                if (name !== 'Blockquote') return;
                const lines = editorLines(view, from, to);

                lines.forEach((line) => {
                    const lineDec = Decoration.line({
                        class: 'cm-blockquote'
                    });
                    widgets.push(lineDec.range(line.from));
                });

                if (
                    lines.every(
                        (line) => !isCursorInRange(view, [line.from, line.to])
                    )
                ) {
                    const marks = Array.from(
                        view.state.sliceDoc(from, to).matchAll(quoteMarkRE)
                    )
                        .map((x) => from + x.index)
                        .map((i) =>
                            Decoration.replace({
                                widget: new BlockQuoteBorderWidget()
                            }).range(i, i + 1)
                        );
                    lines.forEach((line) => {
                        if (
                            !marks.some((mark) =>
                                checkRangeSubset(
                                    [line.from, line.to],
                                    [mark.from, mark.to]
                                )
                            )
                        )
                            marks.push(
                                Decoration.widget({
                                    widget: new BlockQuoteBorderWidget()
                                }).range(line.from)
                            );
                    });

                    widgets.push(...marks);
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
        'border-left': '4px solid #ccc'
    },
    '.cm-blockquote': {
        color: '#555'
    }
});

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
