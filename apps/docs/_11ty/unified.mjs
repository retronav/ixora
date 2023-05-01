import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeShiki from '@retronav/rehype-shiki';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import rehypeFormat from 'rehype-format';
import rehypeParse from 'rehype-parse';
import { getHighlighter, loadTheme } from 'shiki';
import { resolve } from 'path';

const gruvboxDark = await loadTheme(resolve('./_11ty/gruvbox-dark-hard.json'));
const highlighter = await getHighlighter({
	theme: gruvboxDark,
});

/**
 * Convert Markdown to HTML using the unified ecosystem.
 * @param {string} md Markdown to process
 */
export async function render(md) {
	const processor = unified()
		.use(remarkParse)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings)
		.use(rehypeShiki, { highlighter })
		.use(rehypeStringify, { allowDangerousHtml: true });

	return await processor.process(md);
}

/**
 * Format HTML using rehype-format
 * @param {string} html HTML to format
 * @returns
 */
export async function formatHtml(html) {
	const processor = unified()
		.use(rehypeParse)
		.use(rehypeFormat)
		.use(rehypeStringify, { allowDangerousHtml: true });
	return (await processor.process(html)).toString();
}
