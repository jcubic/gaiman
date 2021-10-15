#!/usr/bin/env node

const lily = require('@jcubic/lily');
const path = require('path');
const util = require('util');
const parser = require('../parser');
const escodegen = require('escodegen');
const json = require('../package.json');
const fs = require('fs');

const { readFile, writeFile, stat, mkdir } = fs.promises;

const options = lily(process.argv.slice(2), { boolean: ['debug', 'raw'] });
const executable = path.basename(process.argv[1]);

if (options._.length !== 1) {
    console.error(`usage: ${executable} -o <output directory> <input.gs>`);
} else {
    readFile(options._[0]).then(async buffer => {
        const source = buffer.toString();
        try {
            const ast = parser.parse(source);
            if (options.debug) {
                dump(ast);
            }
            try {
                const code = escodegen.generate(ast);
                if (options.o) {
                    if (!(await directory_exists(options.o))) {
                        await mkdir(options.o);
                    }
                    const output_code = await wrap_code(code);
                    writeFile(path.join(options.o, 'index.js'), output_code);
                    writeFile(path.join(options.o, 'index.html'), await get_terminal());
                } else {
                    console.log(code);
                }
            } catch (error) {
                console.log('JS Generation Error: ' + error.message);
                process.exit(1);
            }
        } catch (error) {
            console.error(format_error(source, error));
            process.exit(1);
        }
    }).catch(e => {
        console.error(e.message);
        process.exit(1);
    });
}

function format_error(code, e) {
    try {
        const lines = code.split('\n');
        const line_number = e.location.start.line;
        const output = [`Parse Error at line ${line_number}`, e.message, ''];
        const col = e.location.start.column;
        const range = e.location.end.column - col;
        output.push(lines[line_number - 1]);
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

async function directory_exists(path) {
    try {
        var s = await stat(path);
        return s.isDirectory();
    } catch(e) {
        return false;
    }
}

async function wrap_code(code) {
    var prefx = await readFile('./src/prefix.js');
    var postfix = await readFile('./src/postfix.js');
    var result = [prefx, code, postfix].join('\n');
    return add_version(result);
}

async function get_terminal() {
    return add_version((await readFile('./src/terminal.html')).toString())
}

function add_version(code) {
    return code.replace(/\{\{VER\}\}/, json.version);
}
