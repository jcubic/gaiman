const parser = require('./parser');
const escodegen = require('escodegen');

module.exports = function(code) {
    return escodegen.generate(parser.parse(code));
};
