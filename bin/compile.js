#!/usr/bin/env node

const lily = require('@jcubic/lily');
const path = require('path');
const parser = require('../parser');
const escodegen = require('escodegen');
const fs = require('fs');
const { readFile, writeFile } = fs.promises;

const options = lily(process.argv.slice(2));
const executable = path.basename(process.argv[1]);

if (options._.length !== 1) {
    console.error(`usage: ${executable} -o <output.json> <input.gs>`);
} else {
    readFile(options._[0]).then(buffer => {
        const source = buffer.toString();
        try {
            const ast = parser.parse(source);
            console.log(JSON.stringify(ast, true, 4));
            try {
                const code = escodegen.generate(ast);
                if (options.o) {
                    return writeFile(options.o, code);
                } else {
                    console.log(code);
                }
            } catch (error) {
                console.log('JS Generation Error: ' + error.message);
            }
        } catch (error) {
            console.error(format_error(source, error));
        }
    }).catch(e => {
        console.error(e.message);
    });
}

function format_error(code, e) {
    const output = ['Parse Error: ' + e.message, ''];
    const lines = code.split('\n');
    try {
        const line_number = e.location.start.line - 1;
        const col = e.location.start.column;
        const range = e.location.end.column - col;
        output.push(lines[line_number]);
        output.push(' '.repeat(col - 1) + '^'.repeat(range));
        return output.join('\n');
    } catch (ex) {
        // ignore errors
        console.error(e);
    }
    return '';
}

function parse(buffer) {
    return parser.parse(buffer.toString());
}

function dump(obj) {
    console.log(util.inspect(obj, { depth: null }));
}
