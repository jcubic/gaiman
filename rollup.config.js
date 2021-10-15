import commonjs from '@rollup/plugin-commonjs';

const config = {
  input: 'parser.js',
  output: {
    file: 'parser.umd.js',
    format: 'umd',
    name: 'gaiman',
  },
  plugins: [commonjs()],
};

export default config;
