// Gaiman Codemirror mode using simple mode

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"), require("../simple/simple"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror", "../simple/simple"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {

    var keywordList = [
         "ask", "def", "echo", "else", "end", "false", "for", "get", "if", "in",
         "let", "not", "or", "post", "return", "sleep", "then", "true", "while",
         "throw", "lambda", "do", "continue", "break", "store", "config", "parse",
         "ask*", "echo*", "input*"
     ];

     CodeMirror.defineSimpleMode("gaiman", {
         // The start state contains the rules that are initially used
         start: [
             // The regex matches the token, the token property contains the type
             { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
             // You can match multiple tokens at once. Note that the captured
             // groups must span the whole string in this case
             { regex: /(?:do|then)\b/, token: "keyword", indent: true },
             { regex: /(?:end|else)\b/, token: "keyword", dedent: true },
             { regex: new RegExp('(?:' + keywordList.join('|') + ')\\b'), token: "keyword" },
             { regex: /(def)(\s+)([a-z$][\w$]*)/,
              token: ["keyword", null, "variable-2"] },
             { regex: /true|false|null|undefined/, token: "atom" },
             { regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
               token: "number" },
             { regex: /#.*/, token: "comment" },
             { regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3" },
             { regex: /[-+\/*=<>!]+/, token: "operator" },
             // indent and dedent properties guide autoindentation
             { regex: /[\{\[\(]/, indent: true },
             { regex: /[\}\]\)]/, dedent: true },
             { regex: /[a-z$][\w$]*/, token: "variable" },
             { regex: /<</, token: "meta", mode: {spec: "xml", end: />>/} }
         ],
         meta: {
             dontIndentStates: ["comment"],
             lineComment: "#"
         }
     });

    CodeMirror.defineMIME("text/x-gaiman", "gaiman");
    CodeMirror.registerHelper("hintWords", "gaiman", keywordList);
});
