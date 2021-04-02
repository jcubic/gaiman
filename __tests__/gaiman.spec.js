const gaiman = require('..');
const fs = require('fs');

function fixture(name) {
    return fs.promises.readFile(`./__tests__/__fixtures__/${name}`).then(buffer => {
        return buffer.toString();
    });
}

describe('if statements', () => {
    it('should render base if', async () => {
        var code = await fixture('nested_base_if.gs');
        expect(gaiman(code)).toMatchSnapshot();
    });
});
