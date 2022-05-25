// Gaiman Codemirror mode based on Ruby mode
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

  var keywordList = [
    "ask", "def", "echo", "else", "end", "false", "for", "get", "if", "in",
    "let", "not", "or", "post", "return", "sleep", "then", "true", "while",
    "throw", "lambda", "do", "continue", "break", "store", "config", "parse",
    "type", "ask*", "echo*", "input*", "update", "clear"
  ], keywords = wordObj(keywordList);

  var indentWords = wordObj(["def", "for", "do", "then", "lambda"]);
  var dedentWords = wordObj(["end"]);
  var opening = {"[": "]", "{": "}", "(": ")"};
  var closing = {"]": "[", "}": "{", ")": "("};

  CodeMirror.defineMode("gaiman", function(config) {
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
      startState: function() {
        return {tokenize: [tokenBase],
                indented: 0,
                context: {type: "top", indented: -config.indentUnit},
                continuedLine: false,
                lastTok: null,
                varList: false};
      },

      token: function(stream, state) {
        curPunc = null;
        if (stream.sol()) state.indented = stream.indentation();
        var style = state.tokenize[state.tokenize.length-1](stream, state), kwtype;
        var thisTok = curPunc;
        if (style == "ident") {
          var word = stream.current();
          style = state.lastTok == "." ? "property"
            : keywords.propertyIsEnumerable(stream.current()) ? "keyword"
            : /^[A-Z]/.test(word) ? "tag"
            : (state.lastTok == "def" || state.lastTok == "class" || state.varList) ? "def"
            : "variable";
          if (style == "keyword") {
            thisTok = word;
            if (indentWords.propertyIsEnumerable(word)) kwtype = "indent";
            else if (dedentWords.propertyIsEnumerable(word)) kwtype = "dedent";
            else if ((word == "if" || word == "unless") && stream.column() == stream.indentation())
              kwtype = "indent";
            else if (word == "do" && state.context.indented < state.indented)
              kwtype = "indent";
          }
        }
        if (curPunc || (style && style != "comment")) state.lastTok = thisTok;
        if (curPunc == "|") state.varList = !state.varList;

        if (kwtype == "indent" || /[\(\[\{]/.test(curPunc))
          state.context = {prev: state.context, type: curPunc || style, indented: state.indented};
        else if ((kwtype == "dedent" || /[\)\]\}]/.test(curPunc)) && state.context.prev)
          state.context = state.context.prev;

        if (stream.eol())
          state.continuedLine = (curPunc == "\\" || style == "operator");
        return style;
      },

      indent: function(state, textAfter) {
        if (state.tokenize[state.tokenize.length-1] != tokenBase) return CodeMirror.Pass;
        var firstChar = textAfter && textAfter.charAt(0);
        var ct = state.context;
        var closed = ct.type == closing[firstChar] ||
            ct.type == "keyword" && /^(?:end|else)\b/.test(textAfter);
        return ct.indented + (closed ? 0 : config.indentUnit) +
          (state.continuedLine ? config.indentUnit : 0);
      },

      electricInput: /^\s*(?:end|do|then|else|\})$/,
      lineComment: "#",
      fold: "indent"
    };
  });

  CodeMirror.defineMIME("text/x-gaiman", "gaiman");
  CodeMirror.registerHelper("hintWords", "gaiman", keywordList);
});
