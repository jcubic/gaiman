const gaiman = require('..');
const fs = require('fs');

function fixture(name) {
    return fs.promises.readFile(`./__tests__/__fixtures__/${name}`).then(buffer => {
        return buffer.toString();
    });
}

describe('if statements', () => {
    it('should compile base if', async () => {
        var code = await fixture('nested_base_if.gs');
        expect(gaiman(code)).toMatchSnapshot();
    });
    it('should compile if_else', async () => {
        var code = await fixture('nested_if_else.gs');
        expect(gaiman(code)).toMatchSnapshot();
    });
    it('should compile multiple if_else ', async () => {
        var code = await fixture('multiple_nested_if_else.gs');
        expect(gaiman(code)).toMatchSnapshot();
    });
});
