/* global: require, describe, it, expect */
const gaiman = require('..');
const fs = require('fs');

function fixture(name) {
    return fs.promises.readFile(`./__tests__/__fixtures__/${name}`).then(buffer => {
        return buffer.toString();
    });
}

async function test_fixture(filename) {
    var code = await fixture(filename);
    expect(gaiman.compile(code)).toMatchSnapshot();
}

describe('if statements', () => {
    it('should compile base if', () => {
        return test_fixture('nested_base_if.gs');
    });
    it('should compile if_else', () => {
        return test_fixture('nested_if_else.gs');
    });
    it('should compile multiple if_else ', () => {
        return test_fixture('multiple_nested_if_else.gs');
    });
    it('should compile multiple if_else with expressions', () => {
        return test_fixture('expressions.gs');
    });
});

describe('for loop', () => {
    it('should parse for loops', () => {
        return test_fixture('for_loop.gs');
    });
});

describe('functions', () => {
    it('should compile function definitions', () => {
        return test_fixture('functions.gs');
    });
    it('should compile function calls', () => {
        return test_fixture('function_calls.gs');
    });
    it('should create factorial function', () => {
        return test_fixture('factorial.gs');
    });
});

describe('expressions', () => {
    it('should use command as part of expression', () => {
        return test_fixture('expressio_commands.gs');
    });
    it('should parse arrays', () => {
        return test_fixture('arrays.gs');
    });
});
