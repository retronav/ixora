import { build } from 'esbuild';
import { rm } from 'fs/promises';
import { existsSync } from 'fs';
import { exec as execCb } from 'child_process';
import { globby } from 'globby';
import { promisify } from 'util';

const exec = promisify(execCb);

if (existsSync('dist')) await rm('dist', { recursive: true });
await build({
	entryPoints: await globby('src/**/*.ts'),
	bundle: false,
	splitting: false,
	sourcemap: true,
	platform: 'browser',
	target: 'es2017',
	logLevel: 'info',
	outdir: 'dist',
	format: 'cjs'
});
await exec('node_modules/.bin/tsc');
