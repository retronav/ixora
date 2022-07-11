#!/usr/bin/env -S deno run --allow-all

import { serve } from 'https://deno.land/x/esbuild@v0.14.48/mod.js';
import * as importMap from 'https://esm.sh/esbuild-plugin-import-map@2.1.0';
import puppeteer, {
	JSHandle,
} from 'https://deno.land/x/puppeteer@14.1.1/mod.ts';
import { basename } from 'https://deno.land/std/path/posix.ts';
import { globby } from "https://esm.sh/globby@13.1.2";

import 'https://esm.sh/mocha@10.0.0';

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

const testFiles = await globby("tests/**/*.spec.ts");

const browser = await puppeteer.launch({
	args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.goto('about:blank');
await page.evaluate(
	'const div = document.body.appendChild(document.createElement(\'div\'));div.id = \'mocha\';',
);

page.on('console', async (data) => {
	const args = await Promise.all(data.args().map((a) => a.jsonValue()));
	console.log(...args);
});
page.on('pageerror', (err) => {
	console.log(err.message);
	Deno.exit(1);
});
page.on('error', (err) => {
	console.log(err.message);
	Deno.exit(1);
});

await page.addScriptTag({
	url: 'https://esm.sh/mocha@10.0.0',
	type: 'module',
});
await page.addScriptTag({
	content: `
	mocha.setup('bdd');
	mocha.reporter('spec');
	mocha.checkLeaks();
	`,
	type: 'module',
});

const server = await serve({
	servedir: 'dist',
}, {
	entryPoints: testFiles,
	format: 'esm',
	plugins: [importMap.plugin()],
	sourcemap: 'linked',
	bundle: true,
	write: false,
	platform: 'browser',
	outdir: 'dist',
});

testFiles.forEach(async (testFile) => {
	await page.addScriptTag({
		url: `http://localhost:${server.port}/${
			basename(testFile).replace(/\.ts$/, '.js')
		}`,
		type: 'module',
	});
});

await page.waitForNetworkIdle();

const mocha = await page.evaluateHandle<JSHandle<BrowserMocha>>(
	'window.mocha',
);

// await page.coverage.startJSCoverage();

async function onTestDone(failures: number) {
	await browser.close().then(() => {
		server.stop();
		Deno.exit(failures < 0 ? 0 : 1);
	});
}
await page.exposeFunction('__onTestDone', onTestDone);

function onTestEnd(thing: string) {
	console.log(thing);
}
await page.exposeFunction('__onTestEnd', onTestEnd);

await mocha.evaluate((mocha) => {
	// @ts-ignore: trust me
	mocha.run(window.__onTestDone);
});
