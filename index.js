/*    ______      _
 *   / ____/___ _(_)___ ___  ____ _____
 *  / / __/ __ `/ / __ `__ \/ __ `/ __ \
 * / /_/ / /_/ / / / / / / / /_/ / / / /
 * \____/\__,_/_/_/ /_/ /_/\__,_/_/ /_/
 *
 * Storytelling Text Based Game Engine
 * Copyrigth (C) 2021 Jakub T. Jankiewicz <https://jcubic.pl/me>
 *
 * Released under GNU GPL v3 or later
 */
const parser = require('./parser');
const escodegen = require('escodegen');

const { version } = require('./package.json');

function parse(code) {
    return parser.parse(code);
}

function compile(code) {
    return generate(parse(code));
}

function generate(ast) {
    return escodegen.generate(ast);
}

module.exports = {
    generate,
    compile,
    parse,
    version
};
