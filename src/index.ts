import { Extension } from '@codemirror/state';
import { blockquote } from './plugins/blockquote';
import { codeblock } from './plugins/code-block';
import { headings } from './plugins/heading';
import { hideMarks } from './plugins/hide-mark';
import { image } from './plugins/image';
import { links } from './plugins/link';
import { lists } from './plugins/list';
import { headingSlugField } from './state/heading-slug';
import { imageURLStateField } from './state/image';

// State fields
export { headingSlugField } from './state/heading-slug';
export { imageURLStateField as imagePreviewStateField } from './state/image';

// Extensions
export { blockquote } from './plugins/blockquote';
export { codeblock } from './plugins/code-block';
export { frontmatter } from './plugins/frontmatter';
export { headings } from './plugins/heading';
export { hideMarks } from './plugins/hide-mark';
export { image } from './plugins/image';
export { links } from './plugins/link';
export { lists } from './plugins/list';

// Classes
export * as classes from './classes';

const ixora: Extension = [
	headingSlugField,
	imageURLStateField,
	blockquote(),
	codeblock(),
	headings(),
	hideMarks(),
	lists(),
	links(),
	image()
];

export default ixora;
