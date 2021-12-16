import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

const config = {
  input: 'index.js',
  output: {
    file: 'parser.umd.js',
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
