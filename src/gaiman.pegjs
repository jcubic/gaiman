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


Start = statements:(if* / _) {
  return {
    "type": "Program",
    "body": statements
  };
  return statements;
}

statements = _ statement:(if / function_definition / function_call / command ) _ {
   return statement
}

if = _ "if" _ cond:(command / expression) _ "then" _ body:(statements* / _) next:(end / if_rest) _ {
  return make_if(cond, body, next);
}

end = "end" { return null; }


if_rest = _ "else" _ if_next:if+ _ else_if:else_if? {
    var result = else_if || null;
    console.log({code: if_next.reverse()});
}

else_if = _ "else" _ "if" _ cond:(command / expression) _ "then" _ body:statements* _ rest:("else" _ statements*)? _ "end" {
   return { "cond": cond, "body": body };
}

function_call = _ name: name _ "(" names:(name _ ","? _)* ")" _ {
   return { "call": name, args: names.map(function(name) { return name[0]; }) };
}

function_definition = _ "def" _ name:name _ "(" args:(name _ ","? _)* ")" _  body:statements* _ "end" _ {
   var args = args.map(function(arg) { return arg[0]; });
   return { "function": name, args: args, body: body };
}

var = _ "set" _ name:expression _ "=" _ expression:(command / expression) _ {
   return { "set": name, "value": expression };
}

echo = "echo" _ expression:(command / expression ) {
  return { "echo": expression };
}

string = "\"" ([^"] / "\\\\\"")*  "\"" {  // "
  return JSON.parse(text());
}

expression = expression:(property / function_call / name / string) {
   return {"expression": expression};
}

command = ask / post / get / match / echo / var

get = _ "get" _ url:string _ {
  return {"get": url}
}
post = _ "post" _ url:string _ data: object _ {
   return {"post": url, data: data }
}

ask = _ "ask" _ string:(string / property / name ) _ {
   return {"ask": string};
}

match = expression:(match_var / property / variable) _ "~=" _ re:re _ {
    return {
        type: "AssignmentExpression",
        operator: "=",
        left: match_identifer,
        right: call(property(expression, match_method), re)
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

keywords = "if" / "then" / "end"

name = [A-Z_$a-z][A-Z_a-z0-9]* { return text(); }

_ "whitespace"
  = [ \t\n\r]* { return []; }
