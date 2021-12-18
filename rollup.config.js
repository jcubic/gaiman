import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";
import { version } from './package.json';

import fs from 'fs';

let banner = fs.readFileSync('./src/banner.js').toString();
banner = banner
    .trim()
    .replace('{{VER}}', version)
    .replace('{{DATE}}', new Date().toGMTString());

const config = [{
    input: 'index.js',
    output: {
        file: 'umd.js',
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
    ]
}, {
    input: 'index.js',
    output: {
        file: 'umd.min.js',
        banner,
        format: 'umd',
        name: 'gaiman',
    },
    plugins: [
        commonjs(),
        json(),
        nodeResolve({
            jsnext: true
        }),
        terser({
            output: {
                comments: function (node, comment) {
                    var text = comment.value;
                    var type = comment.type;
                    if (type == "comment2") {
                        return /Copyright/i.test(text);
                    }
                }
            }
        })
    ]
}];

export default config;
