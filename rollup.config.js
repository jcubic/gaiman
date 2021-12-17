import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

import fs from 'fs';

const banner = fs.readFileSync('./index.js').toString().replace(/\*\/[\s\S]+/, '*/');

const config = {
  input: 'index.js',
  output: {
    file: 'parser.umd.js',
    banner,
    format: 'umd',
    name: 'gaiman',
  },
  plugins: [
    commonjs(),
    json(),
    nodeResolve({
      jsnext: true
    })
  ],
};

export default config;
