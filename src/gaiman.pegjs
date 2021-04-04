// Gaiman conversation language

{
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

expression_like = expr:(function_call / command / expression) {
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

function_call = _ !keyword name:variable _ "(" names:((variable / expression_like) _ ","? _)* ")" _ {
    return call(name, ...names.map(name => name[0]));
}

function_definition = _ "def" _ name:variable _ "(" args:(variable _ ","? _)* ")" _  body:statement* _ "end" _ {
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

literal = value:integer {
   return {"type": "Literal", "value": value };
}

expression = expression:(property / arithmetic / match_var / function_call / name / string / literal) {
    return expression;
}

command = command:(adapter_command / match / var) {
    return command;
}

adapter_async_strings = "get" / "post" / "ask" { return text(); }
adapter_static_strings = "echo" { return text(); }


adapter_command = async_command / static_command

async_command = _ method:adapter_async_strings _ expr:(adapter_command / expression) _ {
    return  {
        "type": "AwaitExpression",
        "argument": call(property(make_identifier("term"),
                                  make_identifier(method)), expr)
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
  / string / literal / match_var / variable

scoped = !keyword variable:name {
  return make_identifier(variable_prefix + variable);
}

global = !keyword variable:("cookie" / "location" / "argv" / "node") {
    return make_identifier(variable);
}
variable = global / scoped

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
comment = "#" [^\n]* { return null; }

integer = [0-9]+ { return parseInt(text(), 10); }

keyword = "if" / "then" / "end" / "else" / "return" / "def"

name = [A-Z_$a-z][A-Z_a-z0-9]* { return text(); }

_ "whitespace"
  = [ \t\n\r]* { return []; }
