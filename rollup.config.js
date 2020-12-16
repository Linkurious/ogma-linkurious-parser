import {version, author, description} from './package.json';
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs';

const nodeGlobals = require('rollup-plugin-node-globals');

const banner = `\
/**
 * Ogma-helper
 * @description ${description}
 * @version ${version} (built on ${new Date().toString()})
 * @author ${author}
 * @license (c) Linkurious ${new Date().getFullYear()}. All rights reserved.
 * @preserve
 */
/* eslint-disable */
 `;

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/ogma-helper.min.js',
    format: 'cjs',
    name: 'Ogma-helper',
    banner,
  },
  plugins: [
    commonjs(),
    nodeGlobals({exclude: ['./node_modules/**']}),
    typescript(),
  ],
}
