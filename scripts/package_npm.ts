import { build, emptyDir } from "https://deno.land/x/dnt@0.28.0/mod.ts";

await emptyDir("./npm");

await build({
	entryPoints: ["./src/mod.ts"],
	test: false,
	outDir: "./npm",
	importMap: "import_map.json",
	packageManager: "pnpm",
	shims: {},
	scriptModule: false,
	package: {
		// package.json properties
		name: "@retronav/ixora",
		version: Deno.args[0],
		description:
			"A CodeMirror 6 extension pack to make writing Markdown fun and beautiful.",
		license: "Apache-2.0",
		module: "./dist/index.js",
		type: "module",
		types: "./dist/index.d.ts",
		publishConfig: {
			access: "public",
		},
		keywords: [
			"codemirror",
			"markdown",
			"wysiwyg",
			"editor",
			"wysiwym",
		],
		author: "Pranav Karawale",
		funding: {
			type: "liberapay",
			url: "https://liberapay.com/retronav",
		},
		repository: {
			type: "git",
			url: "https://codeberg.org/retronav/ixora.git",
		},
		homepage: "https://ixora.karawale.in",
	},
	compilerOptions: {
		lib: ["dom", "esnext"],
		target: "ES2017",
		sourceMap: true,
		inlineSources: true
	},
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("CHANGELOG.md", "npm/CHANGELOG.md");
Deno.copyFileSync("README.md", "npm/README.md");
