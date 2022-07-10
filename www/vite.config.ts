import WindiCSS from 'vite-plugin-windicss';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		WindiCSS({
			scan: {
				fileExtensions: ['svelte', 'astro']
			}
		}),
		Icons({
			compiler: 'raw',
			autoInstall: true
		})
	]
});
