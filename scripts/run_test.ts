#!/usr/bin/env -S deno run --allow-all

import { serve } from 'https://deno.land/x/esbuild@v0.14.48/mod.js';
import * as importMap from 'https://esm.sh/esbuild-plugin-import-map@2.1.0';
import puppeteer, {
	JSHandle,
	Page,
} from 'https://deno.land/x/puppeteer@14.1.1/mod.ts';
import { basename, join } from 'https://deno.land/std@0.147.0/path/mod.ts';
import { globby } from 'https://esm.sh/globby@13.1.2';

import v8ToIstanbul from 'https://esm.sh/v8-to-istanbul@9.0.1';
import libCoverage from 'https://esm.sh/istanbul-lib-coverage@3.2.0';
import libReport from 'https://esm.sh/istanbul-lib-report@3.0.0';
import reports from './helpers/istanbul-report.ts';

import 'https://esm.sh/mocha@10.0.0';

interface ImportMap {
	imports: {
		[pkg: string]: string;
	};
	scopes: {
		[scope: string]: ImportMap['imports'];
	};
}

declare global {
	interface Window {
		/**
		 * Custom hook that is executed when Mocha completes the tests.
		 * @param failures Number of tests failed.
		 */
		__onTestDone(failures: number): Promise<void>;
	}
}

const map: ImportMap = JSON.parse(await Deno.readTextFile('./import_map.json'));
Object.keys(map.imports).forEach((key) => {
	const url = new URL(map.imports[key]);
	url.searchParams.append('dev', 'true');
	map.imports[key] = url.toString();
});
await importMap.load([
	map,
	{
		imports: {
			'../dist/mod.js': '/mod.js',
		},
	},
]);

const testFiles = await globby('tests/**/*.spec.ts');

const browser = await puppeteer.launch({
	args: ['--no-sandbox', '--disable-setuid-sandbox'],
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

const onTestDone = (page: Page) =>
	async (failures: number) => {
		if (failures > 0) {
			await browser.close().then(() => {
				server.stop();
				Deno.exit(1);
			});
		}

		const coverage = (await page.coverage.stopJSCoverage()).filter((c) => {
			const url = new URL(c.url);
			return url.hostname === 'localhost' && url.href.endsWith('mod.js');
		});
		const coverageMapsData = await Promise.all(coverage.map(async (entry) => {
			const url = new URL(entry.url);
			const converter = v8ToIstanbul(join('dist', url.pathname), 0);
			const coverage = entry.rawScriptCoverage;
			await converter.load();

			converter.applyCoverage(coverage!.functions);

			return converter.toIstanbul();
		}));
		const coverageMap = libCoverage.createCoverageMap();
		coverageMapsData.forEach((map) => coverageMap.merge(map));
		const reportCtx = libReport.createContext({
			dir: 'coverage',
			coverageMap,
		});
		(await reports.create('lcovonly')).execute(reportCtx);
		(await reports.create('text', { file: 'report.txt' })).execute(
			reportCtx,
		);

		console.log('\n\nCoverage report:');
		console.log(await Deno.readTextFile('./coverage/report.txt'));

		await browser.close().then(() => {
			server.stop();
			Deno.exit(0);
		});
	};

try {
	const page = await browser.newPage();
	await page.coverage.startJSCoverage({
		includeRawScriptCoverage: true,
	});
	await page.exposeFunction('__onTestDone', onTestDone(page));
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

	// Source map support
	await page.addScriptTag({
		url:
			'https://unpkg.com/source-map-support@0.5.21/browser-source-map-support.js',
	});
	await page.waitForNetworkIdle();
	await page.addScriptTag({ content: 'sourceMapSupport.install();' });

	await page.addScriptTag({
		url: 'https://esm.sh/mocha@10.0.0',
		type: 'module',
	});
	await page.waitForNetworkIdle();

	const mocha = await page.evaluateHandle<JSHandle<BrowserMocha>>(
		'window.mocha',
	);

	await mocha.evaluate((mocha) => {
		mocha.setup('bdd');
		mocha.reporter('spec');
		mocha.checkLeaks();
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

	await mocha.evaluate((mocha) => {
		mocha.run(window.__onTestDone);
	});
} catch (e) {
	console.error(e);
	await browser.close().then(() => {
		server.stop();
		Deno.exit(1);
	});
}
