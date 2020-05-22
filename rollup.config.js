import { readFile } from 'fs';
import { resolve } from 'path';
import typescript from '@rollup/plugin-typescript';
import resolveRollup from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import html from '@open-wc/rollup-plugin-html';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import injectManifest from 'rollup-plugin-workbox-inject';
import replace from '@rollup/plugin-replace';

const workboxConfig = require('./workbox-config.js');

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const output = (format = 'esm') => ({
  dir: './public',
  format,
  sourcemap: true,
});

const template = () =>
  new Promise((r) => {
    readFile(resolve(__dirname + '/src/index.html'), 'utf8', (err, data) => {
      r(data);
    });
  });

const plugins = {
  common: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'production'
      ),
    }),
    typescript(),
    resolveRollup({ browser: true }),
    commonjs(),
  ],
  assets: [
    copy({
      targets: [
        { src: 'src/**/*.css', dest: 'public/assets' },
        { src: 'src/assets/favicon.ico', dest: 'public' },
      ],
    }),
    html({
      template() {
        return template();
      },
    }),
  ],
};

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: 'src/index.ts',
    output: output(),
    plugins: [...plugins.common, ...plugins.assets, production && terser()],
  },
  {
    input: 'src/service-worker/sw.ts',
    output: output('iife'),
    plugins: [...plugins.common, injectManifest(workboxConfig), terser()],
  },
];
