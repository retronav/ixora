import type { Extension } from '@codemirror/state';
import { blockquote } from './plugins/blockquote.ts';
import { codeblock } from './plugins/code_block.ts';
// deno-lint-ignore no-unused-vars
import { frontmatter } from './plugins/frontmatter.ts';
import { headings } from './plugins/heading.ts';
import { hideMarks } from './plugins/hide_mark.ts';
import { links } from './plugins/link.ts';
import { lists } from './plugins/list.ts';
import { headingSlugField } from './state/heading_slug.ts';

// State fields
export { headingSlugField } from './state/heading_slug.ts';

// Extensions
export { blockquote } from './plugins/blockquote.ts';
export { codeblock } from './plugins/code_block.ts';
export { frontmatter } from './plugins/frontmatter.ts';
export { headings } from './plugins/heading.ts';
export { hideMarks } from './plugins/hide_mark.ts';
export { links } from './plugins/link.ts';
export { lists } from './plugins/list.ts';

// Classes
export * as classes from './classes.ts';

const ixora: Extension = [
	headingSlugField,
	blockquote(),
	codeblock(),
	headings(),
	hideMarks(),
	lists(),
	links(),
];

export default ixora;
