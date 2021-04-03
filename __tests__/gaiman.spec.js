const gaiman = require('..');
const fs = require('fs');

function fixture(name) {
    return fs.promises.readFile(`./__tests__/__fixtures__/${name}`).then(buffer => {
        return buffer.toString();
    });
}

async function test_fixture(filename) {
    var code = await fixture(filename);
    expect(gaiman(code)).toMatchSnapshot();
}

describe('if statements', () => {
    it('should compile base if', async () => {
        return test_fixture('nested_base_if.gs');
    });
    it('should compile if_else', async () => {
        return test_fixture('nested_if_else.gs');
    });
    it('should compile multiple if_else ', async () => {
        return test_fixture('multiple_nested_if_else.gs');
    });
    it('should compile multiple if_else with expressions', async () => {
        return test_fixture('expressions.gs');
    });
});

describe('functions', () => {
    it('should compile functions', () => {
        return test_fixture('functions.gs');
    });
});
