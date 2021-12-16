const parser = require('./parser');
const escodegen = require('escodegen');

const { version } = require('package.json');

function parse(code) {
    return escodegen.generate(parser.parse(code));
}

module.exports = {
  parse,
  version
};
      
