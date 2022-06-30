import {
	Decoration,
	DecorationSet,
	EditorView,
	ViewPlugin,
	ViewUpdate
} from '@codemirror/view';
import { checkRangeOverlap, iterateTreeInVisibleRanges } from '../util';
import { headingSlugField } from '../state/heading-slug';
import { heading as classes } from '../classes';

/**
 * Ixora headings plugin.
 *
 * This plugin allows to:
 * - Size headings according to their heading level
 * - Add default styling to headings
 */
export const headings = () => [
	headingDecorationsPlugin,
	hideHeaderMarkPlugin,
	baseTheme
];

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
			enter: ({ type, from, to }) => {
				// Get the active line
				const line = view.lineBlockAt(from);
				// If any cursor overlaps with the heading line, skip
				const cursorOverlaps = ranges.some(({ from, to }) =>
					checkRangeOverlap([from, to], [line.from, line.to])
				);
				if (cursorOverlaps) return;
				if (
					type.name === 'HeaderMark' &&
					// Setext heading's horizontal lines are not hidden.
					/[#]/.test(view.state.sliceDoc(from, to))
				) {
					const dec = Decoration.replace({});
					widgets.push(dec.range(from, to + 1));
				}
			}
		});
		return Decoration.set(widgets, true);
	}
}

/**
 * Plugin to hide the header mark.
 *
 * The header mark will not be hidden when:
 * - The cursor is on the active line
 * - The mark is on a line which is in the current selection
 */
const hideHeaderMarkPlugin = ViewPlugin.fromClass(HideHeaderMarkPlugin, {
	decorations: (v) => v.decorations
});

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
			enter: ({ name, from }) => {
				// To capture ATXHeading and SetextHeading
				if (!name.includes('Heading')) return;
				const slug = view.state
					.field(headingSlugField)
					.find((s) => s.pos === from)?.slug;
				const level = parseInt(/[1-6]$/.exec(name)[0]);
				const dec = Decoration.line({
					class: [
						classes.heading,
						classes.level(level),
						slug ? classes.slug(slug) : ''
					].join(' ')
				});
				widgets.push(dec.range(view.state.doc.lineAt(from).from));
			}
		});
		return Decoration.set(widgets, true);
	}
}

const headingDecorationsPlugin = ViewPlugin.fromClass(
	HeadingDecorationsPlugin,
	{ decorations: (v) => v.decorations }
);

/**
 * Base theme for headings.
 */
const baseTheme = EditorView.baseTheme({
	'.cm-heading': {
		fontWeight: 'bold'
	},
	['.' + classes.level(1)]: { fontSize: '2.2rem' },
	['.' + classes.level(2)]: { fontSize: '1.8rem' },
	['.' + classes.level(3)]: { fontSize: '1.4rem' },
	['.' + classes.level(4)]: { fontSize: '1.2rem' },
	['.' + classes.level(5)]: { fontSize: '1rem' },
	['.' + classes.level(6)]: { fontSize: '0.8rem' }
});
