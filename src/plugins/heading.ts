import {
    Decoration,
    DecorationSet,
    EditorView,
    ViewPlugin,
    ViewUpdate,
} from '@codemirror/view';
import { checkRangeOverlap, iterateTreeInVisibleRanges } from './util';
import { headingSlugField } from '../state/heading-slug';

/**
 * CodeMirror plugin to enchance Markdown headings.
 */
export const headings = () => [
    headingDecorationsPlugin,
    hideHeaderMarkPlugin,
    baseTheme,
];

//#region hide header marks plugin
class HideHeaderMarkPlugin {
    decorations: DecorationSet;
    constructor(view: EditorView) {
        this.decorations = this.hideHeaderMark(view);
    }
    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged || update.selectionSet)
            this.decorations = this.hideHeaderMark(update.view);
    }
    /**
     * Function to decide if to insert a decoration to hide the header mark
     * @param view - Editor view
     * @returns The `Decoration`s that hide the header marks
     */
    private hideHeaderMark(view: EditorView) {
        const widgets = [];
        const ranges = view.state.selection.ranges;
        iterateTreeInVisibleRanges(view, {
            enter: (type, from, to) => {
                // Get the active line
                const line = view.lineBlockAt(from);
                // If any cursor overlaps with the heading line, skip
                const cursorOverlaps = ranges.some(({ from, to }) =>
                    checkRangeOverlap([from, to], [line.from, line.to])
                );
                if (cursorOverlaps) return;
                if (type.name === 'HeaderMark') {
                    const dec = Decoration.replace({});
                    widgets.push(dec.range(from, to + 1));
                }
            },
        });
        return Decoration.set(widgets, true);
    }
}

/**
 * CodeMirror Plugin to hide the header mark
 *
 * The header mark will not be hidden when:
 * - The cursor is on the active line
 * - The mark is on a line which is in the current selection
 */
const hideHeaderMarkPlugin = ViewPlugin.fromClass(HideHeaderMarkPlugin, {
    decorations: (v) => v.decorations,
});
//#endregion

//#region heading decorations plugin
class HeadingDecorationsPlugin {
    decorations: DecorationSet;
    constructor(view: EditorView) {
        this.decorations = this.decorateHeadings(view);
    }
    update(update: ViewUpdate) {
        if (
            update.docChanged ||
            update.viewportChanged ||
            update.selectionSet
        ) {
            this.decorations = this.decorateHeadings(update.view);
        }
    }
    private decorateHeadings(view: EditorView) {
        const widgets = [];
        iterateTreeInVisibleRanges(view, {
            enter: (type, from, to) => {
                if (!type.name.startsWith('ATXHeading')) return;
                const slug = view.state
                    .field(headingSlugField)
                    .find((s) => s.pos === from)?.slug;
                const createDec = (level: number) =>
                    Decoration.mark({
                        tagName: 'span',
                        class: [
                            'cm-heading',
                            `cm-heading-${level}`,
                            slug ? `cm-heading-slug-${slug}` : '',
                        ].join(' '),
                    });
                const level = parseInt(type.name.split('ATXHeading')[1]);
                const dec = createDec(level);
                widgets.push(dec.range(from, to));
            },
        });
        return Decoration.set(widgets, true);
    }
}

const headingDecorationsPlugin = ViewPlugin.fromClass(
    HeadingDecorationsPlugin,
    { decorations: (v) => v.decorations }
);
//#endregion

const baseTheme = EditorView.baseTheme({
    '.cm-heading': {
        fontWeight: 'bold',
    },
    '.cm-heading-1': { fontSize: '2.2rem' },
    '.cm-heading-2': { fontSize: '1.8rem' },
    '.cm-heading-3': { fontSize: '1.4rem' },
    '.cm-heading-4': { fontSize: '1.2rem' },
    '.cm-heading-5': { fontSize: '1rem' },
    '.cm-heading-6': { fontSize: '0.8rem' },
});
