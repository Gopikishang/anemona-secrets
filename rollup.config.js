import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

const production = !process.env.ROLLUP_WATCH;

export default (() => {
  const input = 'App.js';
  const name = input.split(".")[0];
  return {
    input: "webviews/" + input,
    output: {
      sourcemap: true,
      format: "iife",
      name: "app",
      file: "dist/" + name + ".js",
    },
    plugins: [
      svelte({
        dev: !production,
        css: (css) => {
          css.write(name + ".css");
        },
        preprocess: sveltePreprocess({
          sourceMap: !production
        }),
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      typescript({
        tsconfig: "webviews/tsconfig.json",
        sourceMap: !production,
        inlineSources: !production,
      }),
      json({
        compact: true
      }),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      // !production && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      // !production && livereload("public"),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  };
})();
