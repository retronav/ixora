#!/usr/bin/env -S deno run --allow-all

import { serve } from "https://deno.land/x/esbuild@v0.14.48/mod.js";
import * as importMap from "https://esm.sh/esbuild-plugin-import-map@2.1.0";

interface ImportMap {
	imports: {
		[pkg: string]: string;
	};
	scopes: {
		[scope: string]: ImportMap["imports"];
	};
}

const map: ImportMap = JSON.parse(await Deno.readTextFile("./import_map.json"));
Object.keys(map.imports).forEach((key) => {
	map.imports[key] = map.imports[key] + "?dev";
});

await importMap.load([map]);

await serve({
	port: 8080,
	servedir: "demo",
}, {
	entryPoints: ["demo/index.ts"],
	plugins: [importMap.plugin()],
	bundle: true,
	format: "esm",
	platform: "browser",
	target: "es2017",
	outfile: "demo/index.js",
}).then(() => {
	console.log("serving on :8080");
});
