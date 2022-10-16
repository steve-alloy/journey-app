import { build } from "esbuild";

const watch = process.argv.includes("watch");

// Build server
build({
	entryPoints: ["./index.ts"],
	bundle: true,
	minify: true,
	treeShaking: true,
	outfile: "./build/index.js",
	sourcemap: false,
	watch: watch,
	platform: "node"
}).catch(() => process.exit(1));
