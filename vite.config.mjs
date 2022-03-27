import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { readFile } from 'fs/promises';

const pkg = JSON.parse(await readFile('./package.json'));
export default defineConfig({
    build: {
        lib: {
            entry: resolve(
                // eslint-disable-next-line no-undef
                dirname(new URL(import.meta.url).pathname),
                'src/index.ts'
            ),
            name: 'ixora',
            fileName: format => `index.${format}.js`,
            formats: ['es']
        },
        rollupOptions: {
            external: Object.keys(pkg.dependencies)
        }
    },
    plugins: [dts()]
});
