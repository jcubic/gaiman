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
{

    var heredoc_begin = null;
    var $$__m; // result of match
    var variable_prefix = '$_';
    var match_identifer = make_identifier('$$__m');
    var match_method = make_identifier('match');

    function make_if(test, body, alternative) {
        return {
            "type": "IfStatement",
            "test": test,
            "consequent": make_block(body),
            "alternate": alternative
        };
    }
    function make_block(body) {
        return {
            "type": "BlockStatement",
            "body": body
        }
    }
    function make_identifier(name) {
        return {
            type: 'Identifier',
            name: name
        };
    }
    function make_var_declaration(identifier, init) {
        return {
            type: "VariableDeclarator",
            id: make_identifier(identifier),
            init: init
        };
    }
    function make_vars(kind, ...declarations) {
        return {
            type: "VariableDeclaration",
            kind: kind,
            declarations: declarations
        };
    }
    function property(...args) {
        return args.reduce(function(result, item) {
            return {
                type: "MemberExpression",
                computed: false,
                object: result,
                property: item
            };
        });
    }
    function call(callee, ...args) {
        return {
            type: "CallExpression",
            callee: callee,
            arguments: args
        };
    }
    function create_template_literal(string) {
        var re = /(\$[A-Z_$a-z][A-Z_a-z0-9]*)/;
        var expressions = [];
        var constants = [];
        string.split(re).map(token => {
            if (token.match(re)) {
                expressions.push(make_identifier(token.replace(/^\$/, '$_')));
            } else {
                constants.push({
                    "type": "TemplateElement",
                    "value": {
                        "raw": token
                    }
                });
            }
        });
        return {
            type: "TemplateLiteral",
            expressions,
            quasis: constants
        };
    }
    // move error location without mutation
    function move_location(loc, start, end) {
        const { start: loc_start, end: loc_end } = loc;
        const new_loc = {
            ...loc,
            start: {
                ...loc_start,
                column: loc_start.column + start,
                offset: loc_start.offset + start
            },
            end: {
                ...loc_end,
                column: loc_end.column + end,
                offset: loc_end.offset + end
            }
        };
        return new_loc;
    }
    var async_commands = ["ask", "get", "post", "sleep", "echo*", "prompt*", "input*"];
    var sync_commands = ["echo", "prompt", "input"];
    var available_commands = async_commands.concat(sync_commands);
}

Start = statements:(!"end" _ statement* / _) {
    return {
        "type": "Program",
        "body": [{
            "type": "ExpressionStatement",
            "expression": {
                "type": "CallExpression",
                "callee": {
                    "type": "FunctionExpression",
                    "id": null,
                    "async": true,
                    "params": [],
                    "body": {
                        "type": "BlockStatement",
                        "body": statements[2].filter(Boolean)
                    }
                },
                "arguments": []
            }
        }]
    };
}

statement = !"end" _ statement:(comment / if / return / expression_statement / function_definition) _ {
   return statement;
}

expression_statement = !keyword expression:expression_like {
    return  {
      "type": "ExpressionStatement",
      "expression": expression
    };
}

expression_like = expr:(set / command / expression / function_call) {
    return expr;
}

end = "end" { return null; }

if = _ "if" _ cond:expression_like _ "then" _ body:(statement* / _) next:(end / if_next / last_else) _ {
  return make_if(cond, body.filter(Boolean), next);
}

if_next = _ "else" _ if_next:if {
    return if_next;
}

last_else = _ "else" _ body:statement* "end" {
    return {
        "type": "BlockStatement",
        "body": body.filter(Boolean)
    };
}

function_call = _ !keyword name:variable _ "(" names:((expression_like / variable) _ ","? _)* ")" _ {
    return {
        "type": "AwaitExpression",
        "argument": call(name, ...names.map(name => name[0]))
    };
}

function_definition = _ "def" _ name:variable _ "(" args:(variable _ ","? _)* ")" _  body:statement* _ "end" _ {
    const fn_name = name.name.replace(/\$_/, '');
    if (available_commands.includes(fn_name)) {
        const error = new Error(`invalid function name, '${fn_name}' is a command`);
        error.location = move_location(location(), 4, fn_name.length + 4);
        throw error;
    }
    var args = args.map(function(arg) { return arg[0]; });
    return {
        "type": "FunctionDeclaration",
        "id": name,
        "params": args,
        "async": true,
        "body": {
            "type": "BlockStatement",
            "body": body
        }
    };
}

return = _ "return" _ expression:expression_like _ {
    return {
        "type": "ReturnStatement",
        "argument": expression
    };
}

var = _ "let" _ name:(variable) _ "=" _ expression:expression_like _ {
    return {
        "type": "VariableDeclaration",
        "declarations": [{
            "type": "VariableDeclarator",
            "id": name,
            "init": expression
        }],
        "kind": "let"
    };
}

string = "\"" ([^"] / "\\\\\"")*  "\"" {  // "
  return create_template_literal(JSON.parse(text()));
}

literal = value:(integer / boolean) {
   return {"type": "Literal", "value": value };
}

boolean = value:("true" / "false") {
    return value === "true";
}

expression = expression:(heredoc / property / arithmetic / match_var / function_call / name / string / literal) {
    return expression;
}

command = command:(adapter_command / match / var) {
    return command;
}

any_word = word:$[a-z]+ { return word; }

async_command_name = word:$([a-z]+"*"?)  { return word; }

adapter_async_strings = word:async_command_name &{ return async_commands.includes(word); } { return word; }

adapter_static_strings = word:any_word &{ return sync_commands.includes(word); } { return word; }

adapter_command = async_command / static_command

async_command = _ method:adapter_async_strings " " _ expr:(adapter_command / expression) _ args:(
    factor+ / '' {
      error(`Command ${method} require at least two arguments`);
    }) _ {
    return  {
        "type": "AwaitExpression",
        "argument": call(property(make_identifier("term"),
                                  make_identifier(method.replace(/\*$/, '_animate'))), expr, ...args)
    };
}

static_command = _ method:adapter_static_strings _ expr:(adapter_command / expression) _ {
    return  call(property(make_identifier("term"), make_identifier(method)), expr);
}

match = expression:(match_var / property / variable) _ "~=" _ re:re _ {
    return {
        type: "AssignmentExpression",
        operator: "=",
        left: match_identifer,
        right: call(property(call(make_identifier('String'), expression), match_method), re)
    };
}

object = _ "{" _ props:(object_prop ","?)* _ "}" {
   var props =  props.map(function(prop) { return prop[0]; });
   return {"properties": props}
}

object_prop = _ prop:name _ ":" _ value:expression _  {
  return { prop: prop, value: value };
}

re = "/" re:([^/] / "\\\\/")* "/" flags:[igsu]* {
    return {
        type: "Literal",
        value: {},
        regex: {
            pattern: re.join(''),
            flags: flags ? flags.join('') : ''
        }
    }
}
property = struct:variable rest:("." name)+ {
    rest = rest.map(arg => arg[1]);
    return property(struct, ...rest.map(make_identifier));
}

arithmetic
  = head:term tail:(_ ("+" / "-") _ term)* {
      return tail.reduce(function(result, element) {
          return {
            "type": "BinaryExpression",
            "operator": element[1],
            "left": result,
            "right": element[3]
          };
      }, head);
    }

term
  = head:factor tail:(_ ("*" / "/") _ factor)* {
      return tail.reduce(function(result, element) {
          return {
            "type": "BinaryExpression",
            "operator": element[1],
            "left": result,
            "right": element[3]
          };
      }, head);
    }

factor
  = "(" _ expr:arithmetic _ ")" { return expr; }
  / function_call / string / literal / match_var / variable

any_name = variable:name {
  return make_identifier(variable_prefix + variable);
}

scoped = !keyword variable:name &{ return !available_commands.includes(variable) } {
  return make_identifier(variable_prefix + variable);
}

global = !keyword variable:("cookie" / "location" / "argv" / "node") {
    return make_identifier(variable);
}

variable = global / scoped

set = set_cookie / set_local

set_cookie = "cookie." name:name _ "=" _ expr:expression {
    return {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": property(
            make_identifier('document'),
            make_identifier('cookie')
        ),
        "right": {
            "type": "BinaryExpression",
            "operator": "+",
            "left": {
                "type": "Literal",
                "value": name + "="
            },
            "right": call(make_identifier('String'), expr)
        }
    };
}

set_local = left:(property / scoped) _ "=" _  right:expression {
    return {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": left,
        "right": right
    };
}

match_var = "$" num:integer {
    return {
        type: "MemberExpression",
        computed: true,
        object: match_identifer,
        property: {
            type: "Literal",
            value: num
        }
    };
}

heredoc = "<<<" beginMarker "\n" text:content endMarker {
    const loc = location();
    const min = loc.start.column - 1;
    const re = new RegExp(`^ {${min}}`, 'mg');
    return {
        type: 'Literal',
        value: text.replace(re, '')
    };
}

__ = (!"\n" !" " .)

marker 'Marker' = $__+

beginMarker = m:marker { heredoc_begin = m; }

endMarker = "\n" " "* end:marker &{ return heredoc_begin === end; }

content = $(!endMarker .)*

comment = "#" [^\n]* { return null; }

integer = [0-9]+ { return parseInt(text(), 10); }

keyword = "if" / "then" / "end" / "else" / "return" / "def"

name = [A-Z_$a-z][A-Z_a-z0-9]* { return text(); }

_ "whitespace"
  = [ \t\n\r]* { return []; }
