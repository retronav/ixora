import { esbuildPlugin } from '@web/dev-server-esbuild';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';

/**
 * @type {import('@web/test-runner').TestRunnerConfig}
 */
const config = {
    files: ['test/**/*.test.ts', 'test/**/*.spec.ts'],
    plugins: [esbuildPlugin({ ts: true, target: 'esnext' })],
    nodeResolve: true,
    browsers: [puppeteerLauncher()]
};

export default config;
