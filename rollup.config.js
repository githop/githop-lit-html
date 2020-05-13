import { readFileSync } from 'fs';
import { resolve } from 'path';
import typescript from '@rollup/plugin-typescript';
import resolveRollup from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import { generateSW } from 'rollup-plugin-workbox';

const workboxConfig = require('./workbox-config.js');

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const template = () =>
  readFileSync(resolve(__dirname + '/src/index.html'), 'utf-8');

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/index.ts',
  output: {
    dir: './public',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    resolveRollup(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    copy({ targets: [{ src: 'src/**/*.css', dest: 'public' }] }),
    html({ template }),
    production && terser(), // minify, but only in production
    production && generateSW(workboxConfig), //
  ],
};
