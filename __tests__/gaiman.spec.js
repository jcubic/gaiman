/* global: require, describe, it, expect */
const gaiman = require('..');
const fs = require('fs');

function fixture(name) {
    return fs.promises.readFile(`./__tests__/__fixtures__/${name}`).then(buffer => {
        return buffer.toString();
    });
}

async function test_fixture(filename) {
    test_compiler(await fixture(filename));
}

function test_compiler(code) {
    try {
        const result = gaiman.compile(code);
        expect(result).toMatchSnapshot();
    } catch(e) {
        expect(e).toMatchSnapshot();
    }
}

describe('global', () => {
    it('should ignore comments', () => {
        return test_fixture('comments.gs');
    });
    it('should parse constant values', () => {
        return test_fixture('constants.gs');
    });
    it('should parse do blocks', () => {
        return test_fixture('blocks.gs');
    });
    it('should parse imports', () => {
        return test_fixture('imports.gs');
    });
});

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

describe('values', () => {
    it('should setting values', () => {
        return test_fixture('setting_values.gs');
    });
    it('should parse numbers', () => {
        return test_fixture('numbers.gs');
    });
    it('should parse strings', () => {
        return test_fixture('strings.gs');
    });
    it('should parse heredocs', () => {
        return test_fixture('heredocs.gs');
    });
    it('should parse arrays', () => {
        return test_fixture('arrays.gs');
    });
    it('should parse dictionaries', () => {
        return test_fixture('dictionaries.gs');
    });
});

describe('loop', () => {
    it('should parse for loops', () => {
        return test_fixture('for_loop.gs');
    });
    it('should parse while loops', () => {
        return test_fixture('while_loop.gs');
    });
    it('should parse continue', () => {
        return test_fixture('continue.gs');
    });
    it('should parse break', () => {
        return test_fixture('break.gs');
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
        return test_fixture('expression_commands.gs');
    });
    it('should parse property access', () => {
        return test_fixture('property_access.gs');
    });
    it('should parse property access', () => {
        return test_fixture('property_set.gs');
    });
    it('should parse assign operators', () => {
        return test_fixture('assign_operators.gs');
    });
    it('should parse map function', () => {
        return test_fixture('map.gs');
    });
    it('should call methods', () => {
        return test_fixture('methods.gs');
    });
    it('should chain methods', () => {
        return test_fixture('chain.gs');
    });
});

describe('errors', () => {
    it('should throw error for multi line string', () => {
        return test_fixture('mutli_line_string.gs');
    });
});
