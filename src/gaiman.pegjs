// Gaiman conversation language

{
    var $__m; // result of match
    var match_identifer = make_identifier('$__m');
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
}


Start = statements:(!"end" _ statements* / _) {
  return {
    "type": "Program",
    "body": statements[2]
  };
  return statements;
}

statements = _ statement:(if / command / return / function_definition / function_call / expression_statement) _ {
   return statement
}

expression_like = expr:(command / expression) {
    return expr;
}

expression_statement = !keywords expression:expression {
    return  {
      "type": "ExpressionStatement",
      "expression": expression
    };
}

if = _ "if" _ cond:(command / expression) _ "then" _ body:(statements* / _) next:(end / if_next / last_else) _ {
  return make_if(cond, body, next);
}

end = "end" { return null; }


if_next = _ "else" _ if_next:if {
    return if_next;
}

last_else = _ "else" _ body:statements* "end" {
    return {
        "type": "BlockStatement",
        "body": body
    };
}

else_if = _ "else" _ "if" _ cond:(command / expression) _ "then" _ body:statements* _ rest:("else" _ statements*)? _ "end" {
   return { "cond": cond, "body": body };
}

function_call = _ name: name _ "(" names:(name _ ","? _)* ")" _ {
   return { "call": name, args: names.map(function(name) { return name[0]; }) };
}

function_definition = _ "def" _ name:name _ "(" args:(name _ ","? _)* ")" _  body:statements* _ "end" _ {
    var args = args.map(function(arg) { return arg[0]; });
    return {
        "type": "FunctionDeclaration",
        "id": make_identifier(name),
        "params": args.map(make_identifier),
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

echo = "echo" _ expression:expression_like {
    return {
        "type": "ExpressionStatement",
        "expression": {
            "type": "CallExpression",
            "callee": {
                "type": "MemberExpression",
                "object": make_identifier('term'),
                "property": make_identifier('echo')
            },
            "arguments": [expression]
        }
    };
}

string = "\"" ([^"] / "\\\\\"")*  "\"" {  // "
  return JSON.parse(text());
}

literal = value:(string / integer) {
   return {"type": "Literal", "value": value };
}

expression = expression:(property / arithmetic / match_var / function_call / name / literal) {
    return expression;
}

command = command:(ask / post / get / match / echo / var) {
    return command;
}

get = _ "get" _ url:string _ {
  return {"get": url}
}
post = _ "post" _ url:string _ data: object _ {
   return {"post": url, data: data }
}

ask = _ "ask" _ arg:expression_like _ {
    return  {
        "type": "AwaitExpression",
        "argument": {
            "type": "CallExpression",
            "callee": {
                "type": "MemberExpression",
                "object": {
                    "type": "Identifier",
                    "name": "term"
                },
                "property": {
                    "type": "Identifier",
                    "name": "read"
                }
            },
            "arguments": [arg]
        }
    };
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
property = struct:name rest:("." name)+ {
    rest = rest.map(arg => arg[1]);
    return property(...[struct].concat(rest).map(make_identifier));
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
  / literal / match_var / variable

variable = !keywords variable:name {
  return {
    "type": "Identifier",
    "name": variable
  }
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

integer = [0-9]+ { return parseInt(text(), 10); }

keywords = "if" / "then" / "end" / "else" / "return"

name = [A-Z_$a-z][A-Z_a-z0-9]* { return text(); }

_ "whitespace"
  = [ \t\n\r]* { return []; }
