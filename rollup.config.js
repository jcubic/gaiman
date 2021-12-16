import commonjs from '@rollup/plugin-commonjs';

const config = {
  input: 'index.js',
  output: {
    file: 'parser.umd.js',
    format: 'umd',
    name: 'gaiman',
  },
  plugins: [commonjs()],
};

export default config;
