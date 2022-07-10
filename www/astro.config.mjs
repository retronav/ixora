import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import remarkShikiTwoslash from 'remark-shiki-twoslash';

// https://astro.build/config
export default defineConfig({
	integrations: [svelte()],
	// adapter: vercel(),
	server: {
		port: 8080
	},
	markdown: {
		syntaxHighlight: false,
		remarkPlugins: [remarkShikiTwoslash.default]
	}
});
