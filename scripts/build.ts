#!/usr/bin/env -S deno run --allow-all

import { build } from 'https://deno.land/x/esbuild@v0.14.48/mod.js';
import * as importMap from 'https://esm.sh/esbuild-plugin-import-map@2.1.0';
import { emptyDir } from 'https://deno.land/std@0.148.0/fs/mod.ts';
import { globby } from 'https://esm.sh/globby@13.1.2';

interface ImportMap {
	imports: {
		[pkg: string]: string;
	};
	scopes: {
		[scope: string]: ImportMap['imports'];
	};
}

const map: ImportMap = JSON.parse(await Deno.readTextFile('./import_map.json'));
Object.keys(map.imports).forEach((key) => {
	const url = new URL(map.imports[key]);
	url.searchParams.append('dev', 'true');
	map.imports[key] = url.toString();
});

await importMap.load([map]);
await emptyDir('dist');
await build({
	entryPoints: await globby('src/**/*.ts'),
	plugins: [
		importMap.plugin(),
	],
	bundle: true,
	format: 'esm',
	platform: 'browser',
	target: 'esnext',
	outdir: 'dist',
	sourcemap: true,
});

console.log('Build done');
Deno.exit(0);
