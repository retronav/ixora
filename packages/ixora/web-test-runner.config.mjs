import { esbuildPlugin } from '@web/dev-server-esbuild';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';

/**
 * @type {import('@web/test-runner').TestRunnerConfig}
 */
const config = {
	files: ['test/**/*.test.ts', 'test/**/*.spec.ts'],
	plugins: [esbuildPlugin({ ts: true, target: 'esnext' })],
	nodeResolve: true,
	coverage: true,
	testFramework: {
		config: {
			timeout: '5000'
		}
	},
	coverageConfig: {
		nativeInstrumentation: true,
		include: ['dist/**/*.js']
	},
	browsers: [
		puppeteerLauncher({
			launchOptions: process.env.CI
				? {
						args: ['--no-sandbox', '--disable-setuid-sandbox']
				  }
				: {}
		})
	]
};

export default config;
