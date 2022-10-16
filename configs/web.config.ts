import fs from "node:fs";
import { build } from "esbuild";

// Imports for bundling JS
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

// Imports for bundling CSS
import autoprefixer from "autoprefixer";
import stylePlugin from "esbuild-style-plugin";
import postcssPresetEnv from "postcss-preset-env";
import purgecss from "@fullhuman/postcss-purgecss";
import stylelint from "stylelint";

import type { PluginBuild } from "esbuild";

// Simple HTML bundler
const esbuildHTML = {
	name: "esbuild-html",
	setup(build: PluginBuild) {
		build.onStart(() => {
			if (!fs.existsSync("./build/public/index.html")) {
				fs.mkdirSync("./build");
				fs.mkdirSync("./build/public");
				fs.writeFileSync("./build/public/index.html", "");
			}

			fs.copyFileSync("./web/public/index.html", "./build/public/index.html");
		});
	}
};

const watch = process.argv.includes("watch");

// Build client
build({
	entryPoints: ["./web/src/main.ts"],
	bundle: true,
	tsconfig: "./web/src/tsconfig.json",
	minify: true,
	treeShaking: true,
	outfile: "./build/public/assets/bundle.js",
	define: {
		"process.env.CODELESS_SDK_APP_URL": "'https://alloysdk.alloy.co/'"
	},
	watch: watch,
	sourcemap: true,
	platform: "browser",
	plugins: [
		stylePlugin({
			postcss: {
				plugins: [
					autoprefixer,
					postcssPresetEnv({
						stage: 1
					}),
					purgecss({
						content: [
							"./web/public/index.html",
							"./web/src/App.svelte",
							"./web/src/**/*.svelte"
						]
					}),
					stylelint({
						rules: {
							"color-no-invalid-hex": true
						}
					})
				]
			}
		}),
		esbuildSvelte({
			preprocess: sveltePreprocess()
		}),
		esbuildHTML
	]
}).catch(() => process.exit(1));
