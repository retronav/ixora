#!/usr/bin/env -S deno run --allow-all

import { build } from 'https://deno.land/x/esbuild@v0.14.48/mod.js';
import * as importMap from 'https://esm.sh/esbuild-plugin-import-map@2.1.0';
import { globbySync } from 'https://esm.sh/globby@13.1.2';
import ts from 'https://esm.sh/typescript@4.7.4';

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
	map.imports[key] = map.imports[key] + '?dev';
});

await importMap.load(['./import_map.json']);

await build({
	entryPoints: ['src/mod.ts'],
	plugins: [
		importMap.plugin(),
	],
	bundle: true,
	format: 'esm',
	platform: 'browser',
	target: 'esnext',
	outdir: 'dist',
	sourcemap: true
});

// Generate d.ts

const tsOptions: ts.CompilerOptions = {
	declaration: true,
	emitDeclarationOnly: true,
	outDir: 'dist',
};

const host = ts.createCompilerHost(tsOptions);
host.writeFile = (fileName: string, contents: string) =>
	Deno.writeTextFileSync(fileName, contents);

const program = ts.createProgram(globbySync('src/**/*.ts'), tsOptions, host);
program.emit();

console.log('Build done');
Deno.exit(0);
