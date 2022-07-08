import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel/static';

// https://astro.build/config
export default defineConfig({
	integrations: [svelte()],
	adapter: vercel(),
	server: {
		port: 8080
	}
});
