const EleventyVite = require('@11ty/eleventy-plugin-vite');
const EleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const EleventyFetch = require('@11ty/eleventy-fetch');
const { default: Unocss } = require('unocss/vite');
const { presetIcons, presetUno } = require('unocss');
const fs = require('fs/promises');

/**
 *
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 */
module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(EleventyVite, {
		viteOptions: {
			build: {
				rollupOptions: {
					output: {
						manualChunks: {
							codemirror: ['codemirror', '@codemirror/view'],
						},
					},
				},
			},
			server: {
				mode: 'development',
				middlewareMode: true,
				appType: 'custom',
			},
			plugins: [
				Unocss({
					shortcuts: {
						'icon-link': ' i-material-symbols:link',
					},
					presets: [presetUno(), presetIcons()],
				}),
			],
		},
	});
	eleventyConfig.setServerPassthroughCopyBehavior('copy');
	eleventyConfig.addPassthroughCopy('src/ts');
	eleventyConfig.addPassthroughCopy('src/scss');
	eleventyConfig.addPassthroughCopy('public');

	eleventyConfig.addPlugin(EleventyNavigationPlugin);
	eleventyConfig.setDataDeepMerge(true);

	eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
	eleventyConfig.addLayoutAlias('docs', 'layouts/docs.njk');

	eleventyConfig.addCollection('docs', (collectionApi) => {
		return collectionApi.getFilteredByGlob('src/docs/**/*.md');
	});

	eleventyConfig.setLibrary('md', {
		set: () => {},
		disable: () => {},
		render: (str) =>
			import('./_11ty/unified.mjs')
				.then(({ render }) => render(str))
				.then((html) => html),
	});

	eleventyConfig.addTransform('rehype-format', async (content, outputPath) => {
		const { formatHtml } = await import('./_11ty/unified.mjs');
		if (outputPath.endsWith('.html')) {
			return await formatHtml(content);
		}
	});

	eleventyConfig.on('eleventy.before', async () => {
		const mainReadme = await EleventyFetch(
			'https://codeberg.org/retronav/ixora/raw/branch/main/README.md',
			{
				duration: '1d',
				type: 'text',
			}
		);
		await fs.writeFile('public/README.ixora.md', mainReadme);
	});

	return {
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
		dir: {
			input: 'src',
			output: 'dist',
		},
	};
};
