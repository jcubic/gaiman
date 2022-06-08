// Gaiman Codemirror mode based on Ruby and Lua mode
// CodeMirror, copyright (c) by Marijn Haverbeke and others
//             copyright (c) Jakub T. Jankiewicz
//
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

  function wordObj(words) {
    var o = {};
    for (var i = 0, e = words.length; i < e; ++i) o[words[i]] = true;
    return o;
  }

  function prefixRE(words) {
    return new RegExp("^(?:" + words.join("|") + ")", "i");
  }
  function wordRE(words) {
    return new RegExp("^(?:" + words.join("|") + ")$", "i");
  }

  var builtins = wordRE([]);

  var keywordList = [
    "ask", "def", "echo", "else", "end", "false", "for", "get", "if", "in",
    "let", "not", "or", "post", "return", "sleep", "then", "true", "while",
    "throw", "lambda", "do", "continue", "break", "store", "config", "parse",
    "type", "ask*", "echo*", "input*", "update", "clear", "mask", "import",
    "prompt"
  ], keywords = wordRE(keywordList);

  var indentTokens = wordRE(["def", "then", "lambda", "do", "\\(", "{"]);
  var dedentTokens = wordRE(["end", "\\)", "}"]);
  var dedentPartial = prefixRE(["end", "else", "\\)", "}", "else\\s+if"]);
  var opening = {"[": "]", "{": "}", "(": ")"};
  var closing = {"]": "[", "}": "{", ")": "("};

  CodeMirror.defineMode("gaiman", function(config) {
    var indentUnit = config.indentUnit;
    var curPunc;

    function chain(newtok, stream, state) {
      state.tokenize.push(newtok);
      return newtok(stream, state);
    }

    function tokenBase(stream, state) {
      if (stream.eatSpace()) return null;
      var ch = stream.next(), m;
      if (ch == '"') {
        return chain(readQuoted(ch, "string", ch == '"'), stream, state);
      } else if (ch == "/") {
        if (regexpAhead(stream))
          return chain(readQuoted(ch, "string-2", true), stream, state);
        else
          return "operator";
      } else if (ch == "#") {
        stream.skipToEnd();
        return "comment";
      } else if (ch == "<" && (m = stream.match(/^<<([a-zA-Z_?]\w*)/))) {
        return chain(readHereDoc(m[1]), stream, state);
      } else if (ch == "0") {
        if (stream.eat("x")) stream.eatWhile(/[\da-fA-F]/);
        else if (stream.eat("b")) stream.eatWhile(/[01]/);
        else stream.eatWhile(/[0-7]/);
        return "number";
      } else if (/\d/.test(ch)) {
        stream.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+\-]?[\d_]+)?/);
        return "number";
      } else if (ch == "?") {
        while (stream.match(/^\\[CM]-/)) {}
        if (stream.eat("\\")) stream.eatWhile(/\w/);
        else stream.next();
        return "string";
      } else if (/[a-zA-Z_\xa1-\uffff]/.test(ch)) {
        stream.eatWhile(/[\w\xa1-\uffff]/);
        stream.eat(/[\?\!]/);
        if (stream.eat(":")) return "atom";
        return "ident";
      } else if (/[\(\)\[\]{}\\;]/.test(ch)) {
        curPunc = ch;
        return null;
      } else if (/[=+\-\/*:\.^%<>~|]/.test(ch)) {
        var more = stream.eatWhile(/[=+\-\/*:\.^%<>~|]/);
        if (ch == "." && !more) curPunc = ".";
        return "operator";
      } else {
        return null;
      }
    }

    function regexpAhead(stream) {
      var start = stream.pos, depth = 0, next, found = false, escaped = false
      while ((next = stream.next()) != null) {
        if (!escaped) {
          if ("[{(".indexOf(next) > -1) {
            depth++
          } else if ("]})".indexOf(next) > -1) {
            depth--
            if (depth < 0) break
          } else if (next == "/" && depth == 0) {
            found = true
            break
          }
          escaped = next == "\\"
        } else {
          escaped = false
        }
      }
      stream.backUp(stream.pos - start)
      return found
    }

    function tokenBaseUntilBrace(depth) {
      if (!depth) depth = 1;
      return function(stream, state) {
        if (stream.peek() == "}") {
          if (depth == 1) {
            state.tokenize.pop();
            return state.tokenize[state.tokenize.length-1](stream, state);
          } else {
            state.tokenize[state.tokenize.length - 1] = tokenBaseUntilBrace(depth - 1);
          }
        } else if (stream.peek() == "{") {
          state.tokenize[state.tokenize.length - 1] = tokenBaseUntilBrace(depth + 1);
        }
        return tokenBase(stream, state);
      };
    }
    function tokenBaseOnce() {
      var alreadyCalled = false;
      return function(stream, state) {
        if (alreadyCalled) {
          state.tokenize.pop();
          return state.tokenize[state.tokenize.length-1](stream, state);
        }
        alreadyCalled = true;
        return tokenBase(stream, state);
      };
    }
    function readQuoted(quote, style, embed, unescaped) {
      return function(stream, state) {
        var escaped = false, ch;

        if (state.context.type === 'read-quoted-paused') {
          state.context = state.context.prev;
          stream.eat("}");
        }

        while ((ch = stream.next()) != null) {
          if (ch == quote && (unescaped || !escaped)) {
            state.tokenize.pop();
            break;
          }
          if (embed && ch == "#" && !escaped) {
            if (stream.eat("{")) {
              if (quote == "}") {
                state.context = {prev: state.context, type: 'read-quoted-paused'};
              }
              state.tokenize.push(tokenBaseUntilBrace());
              break;
            } else if (/[@\$]/.test(stream.peek())) {
              state.tokenize.push(tokenBaseOnce());
              break;
            }
          }
          escaped = !escaped && ch == "\\";
        }
        return style;
      };
    }
    function readHereDoc(phrase) {
      return function(stream, state) {
        if (stream.match(phrase)) state.tokenize.pop();
        else stream.skipToEnd();
        return "string";
      };
    }

    return {
      startState: function(basecol) {
        return {
          basecol: basecol || 0,
          indentDepth: 0,
          context: {type: "top"},
          else_block: false,
          tokenize: [tokenBase]
        };
      },

      token: function(stream, state) {
        if (stream.eatSpace()) return null;
        var style = state.tokenize[state.tokenize.length-1](stream, state);
        var word = stream.current();
        if (style == "ident") {
          if (keywords.test(word)) style = "keyword";
          else if (builtins.test(word)) style = "builtin";
          else style = "variable";
          if (word == 'else') {
            state.else_block = true;
          } else if (word == 'if' && state.else_block) {
            state.else_block = false;
            --state.indentDepth;
            return style;
          } else {
            state.else_block = false;
          }
        }
        if (style != "comment" && style != "string") {
          if (indentTokens.test(word)) ++state.indentDepth;
          else if (dedentTokens.test(word)) --state.indentDepth;
        }
        return style;
      },

      indent: function(state, textAfter) {
        var closing = dedentPartial.test(textAfter);
        return state.basecol + indentUnit * (state.indentDepth - (closing ? 1 : 0));
      },

      electricInput: /^\s*(?:end|else|\})$/,
      lineComment: "#",
      fold: "indent"
    };
  });

  CodeMirror.defineMIME("text/x-gaiman", "gaiman");
  CodeMirror.registerHelper("hintWords", "gaiman", keywordList);
});
