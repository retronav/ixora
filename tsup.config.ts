import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/**/*.ts'],
	esbuildOptions: (opt, ctx) => {
		if (ctx.format === 'esm') {
			opt.outExtension = { '.js': '.js' };
		}
	},
	bundle: false,
	splitting: false,
	sourcemap: true,
	dts: true,
	platform: 'browser',
	target: 'es2017',
	format: ['esm'],
	clean: true
});
