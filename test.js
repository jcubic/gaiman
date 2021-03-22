const parser = require('./parser');
const fs = require('fs');
const util = require('util');


fs.promises.readFile('./examples/email.gs').then(buffer => {
  dump(parser.parse(buffer.toString()));
}).catch(e => {
  console.error(e);
  process.exit(1);
});

function dump(obj) {
  console.log(util.inspect(obj, { depth: null }));
}
