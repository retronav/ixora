import { esbuildPlugin } from '@web/dev-server-esbuild';

/**
 * @type {import('@web/dev-server').DevServerConfig}
 */
const config = {
	plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
	rootDir: './demo',
	nodeResolve: true,
	port: 8080
};

export default config;
