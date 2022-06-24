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
const production = !process.env.ROLLUP_WATCH;

const output = (format = 'esm') => ({
  dir: './public',
  format,
  sourcemap: !production,
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
      preventAssignment: true,
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
        { src: 'robots.txt', dest: 'public' },
      ],
    }),
    html({
      template() {
        return template();
      },
    }),
  ],
};

const app = {
  input: 'src/index.ts',
  output: output(),
  plugins: [...plugins.common, ...plugins.assets, production && terser()],
};

const sw = {
  input: 'src/service-worker/sw.ts',
  output: output('iife'),
  plugins: [...plugins.common, injectManifest(workboxConfig), terser()],
};

const config = [app];

if (production) {
  config.push(sw);
}

/** @type {import('rollup').RollupOptions} */
export default config;
