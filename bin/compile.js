#!/usr/bin/env node

const lily = require('@jcubic/lily');
const path = require('path');
const util = require('util');
const parser = require('../parser');
const escodegen = require('escodegen');
const json = require('../package.json');
const fs = require('fs');
const Babel = require('@babel/standalone');
const { minify } = require('terser');

const { writeFile, stat, mkdir } = fs.promises;

function readFile(filepath) {
    const abs_path = require.resolve(filepath);
    return fs.promises.readFile(abs_path, 'utf8');
}


const options = lily(process.argv.slice(2), { boolean: ['debug', 'raw'] });
const executable = path.basename(process.argv[1]);

if (options.v || options.version) {
  console.log(`Gaiman version: ${json.version}`);
} else if (options._.length !== 1) {
    console.error(`usage: ${executable} -v | [-t <html template>] -o <output directory> <input.gs>`);
} else {
    fs.promises.readFile(options._[0]).then(async buffer => {
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
                    const minified = await minify(output_code, {
                        sourceMap: {
                            filename: "index.module.js",
                            url: "index.module.js.map"
                        }
                    });
                    writeFile(path.join(options.o, 'index.module.js.map'), minified.map);
                    writeFile(path.join(options.o, 'index.module.js'), minified.code);
                    const output_es5_code = Babel.transform(output_code, { presets: ['env'], targets: {ie: 11} }).code;
                    writeFile(path.join(options.o, 'index.js'), (await minify(output_es5_code)).code);
                    let template;
                    if (options.t) {
                        template = await fs.promises.readFile(options.t, 'utf8');
                    } else {
                        template = await get_terminal();
                    }
                    writeFile(path.join(options.o, 'index.html'), template);
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
        // console.error(e);
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
    var prefx = await readFile('../src/prefix.js');
    var postfix = await readFile('../src/postfix.js');
    var result = [prefx, code, postfix].join('\n');
    return add_version(result);
}

async function get_terminal(mapping) {
    const html = await readFile('../src/terminal.html');
    const css = await readFile('../src/terminal.css');
    return template(html, Object.assign({
        STYLE: css,
        HTML: '<div id="term"></div>',
        MODULE: 'index.module.js',
        ES5: 'index.js',
        VER: json.version
    }, mapping));
}

function template(string, mapping) {
    Object.entries(mapping).forEach(([key, value]) => {
        string = string.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    });
    return string;
}

function add_version(code) {
    return template(code, { VER: json.version });
}
