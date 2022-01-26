import {version, author, description} from './package.json';
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs';
import nodeGlobals from 'rollup-plugin-node-globals';
// import buble from '@rollup/plugin-buble';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

const banner = `\
/**
 * Ogma-Linkurious parser
 * @description ${description}
 * @version ${version} (built on ${new Date().toString()})
 * @author ${author}
 * @license Apache-2.0
 * @preserve
 */
/* eslint-disable */
 `;

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/ogma-linkurious-parser.min.js',
    format: 'cjs',
    name: 'Ogma-Linkurious-parser',
    banner,
  },
  plugins: [
    commonjs(),
    nodeGlobals({exclude: ['./node_modules/**']}),
    typescript(),
    nodeResolve({preferBuiltins: true}),
    json()
  ],
}
