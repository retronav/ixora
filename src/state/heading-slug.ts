import { syntaxTree } from '@codemirror/language';
import { EditorState, StateField } from '@codemirror/state';
import { Slugger } from '../util';

/**
 * A heading slug is a string that is used to identify/reference
 * a heading in the document. Heading slugs are URI-compatible and can be used
 * in permalinks as heading IDs.
 */
export interface HeadingSlug {
	slug: string;
	pos: number;
}

/**
 * A plugin that stores the calculated slugs of the document headings in the
 * editor state. These can be useful when resolving links to headings inside
 * the document.
 */
export const headingSlugField = StateField.define<HeadingSlug[]>({
	create: (state) => {
		const slugs = new Array<HeadingSlug>();
		extractSlugs(state);
		return slugs;
	},
	update: (value, tx) => {
		if (tx.docChanged) return extractSlugs(tx.state);
		return value;
	},
	compare: (a, b) =>
		a.length === b.length &&
		a.every((slug, i) => slug.slug === b[i].slug && slug.pos === b[i].pos)
});

/**
 *
 * @param state - The current editor state.
 * @returns An array of heading slugs.
 */
function extractSlugs(state: EditorState): HeadingSlug[] {
	const slugs: HeadingSlug[] = [];
	const slugger = new Slugger();
	syntaxTree(state).iterate({
		enter: ({ name, from, to, node }) => {
			// Capture ATXHeading and SetextHeading
			if (!name.includes('Heading')) return;
			const mark = node.getChild('HeaderMark');

			const headerText = state.sliceDoc(from, to).split('');
			headerText.splice(mark.from - from, mark.to - mark.from);
			const slug = slugger.slug(headerText.join('').trim());
			slugs.push({ slug, pos: from });
		}
	});
	return slugs;
}
