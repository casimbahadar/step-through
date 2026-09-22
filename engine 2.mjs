/* CORE-START */
/* ============================================================
   POLYGLOT CORE
   One canonical AST. One evaluator. N language front-ends.
   A "language" = a LangSpec (surface syntax) + shared parser/printer.
   ============================================================ */

/* ---------- 1. LANGUAGE SPECS ---------- */

const PYTHON = {
  id: 'python',
  name: 'Python',
  blocks: 'indent',
  comment: '#',
  headerColon: true,
  condParens: false,
  funcKeyword: 'def',
  declKeyword: null,          // Python has no let/const
  hoistDecls: false,
  // surface word -> canonical keyword
  words: {
    'if': 'if', 'elif': 'elif', 'else': 'else', 'while': 'while', 'for': 'for',
    'in': 'in', 'def': 'func', 'return': 'return', 'break': 'break',
    'continue': 'continue', 'and': 'and', 'or': 'or', 'not': 'not',
    'class': 'class', 'super': 'super', 'try': 'try', 'except': 'catch', 'raise': 'throw', 'as': 'as',
    'True': 'true', 'False': 'false', 'None': 'null'
  },
  ops: { '**': '**' },        // extra surface ops -> canonical
  loopStyle: 'range',         // for i in range(a, b)
  forEachWord: 'in',
  // builtin surface forms
  print: { style: 'call', name: 'print' },
  len: { style: 'call', name: 'len' },
  append: 'append',
  mathCalls: { abs: 'abs', min: 'min', max: 'max' },  // bare calls
  literals: { true: 'True', false: 'False', null: 'None' },
  notPrec: 4,                 // Python: "not a == b" means not (a == b)
  floatDivision: true,
  classWord: 'class', parentStyle: 'parens', ctorName: '__init__', selfWord: 'self', explicitSelfParam: true,
  methodKeyword: 'def', superStyle: 'python',
  memberOp: '.', selfSurface: 'self', newStyle: 'plain', classes: true,
  dictSep: ':', dicts: true, inOp: 'in',
  errors: { style: 'python', errMsg: 'bare', throwWrap: 'Exception' },
  inputCall: 'input',
  intDiv: '//',
  sortCall: { style: 'call', name: 'sorted' },
  strMethods: { upper: 'upper', lower: 'lower', trim: 'strip', starts: 'startswith', has: '__in__' },
  toStr: { style: 'call', name: 'str' },
  indentUnit: '    '
};

const JAVASCRIPT = {
  id: 'javascript',
  name: 'JavaScript',
  blocks: 'braces',
  comment: '//',
  headerColon: false,
  condParens: true,
  funcKeyword: 'function',
  declKeyword: 'let',
  hoistDecls: true,
  words: {
    'if': 'if', 'else': 'else', 'while': 'while', 'for': 'for',
    'of': 'of', 'function': 'func', 'return': 'return', 'break': 'break',
    'continue': 'continue', 'let': 'let', 'const': 'let',
    'class': 'class', 'extends': 'extends', 'new': 'new', 'super': 'super', 'in': 'in',
    'try': 'try', 'catch': 'catch', 'throw': 'throw',
    'true': 'true', 'false': 'false', 'null': 'null'
  },
  ops: { '&&': 'and', '||': 'or', '!': 'not', '**': '**' },
  loopStyle: 'cstyle',        // for (let i = 0; i < n; i++)
  forEachWord: 'of',
  print: { style: 'member', obj: 'console', name: 'log' },
  len: { style: 'property', name: 'length' },
  append: 'push',
  mathCalls: { abs: 'Math.abs', min: 'Math.min', max: 'Math.max' },
  literals: { true: 'true', false: 'false', null: 'null' },
  notPrec: 7,                 // JS: "!a == b" means (!a) == b
  floatDivision: true,
  classWord: 'class', parentStyle: 'extends', ctorName: 'constructor', selfWord: 'this',
  methodKeyword: null, superStyle: 'js',
  memberOp: '.', selfSurface: 'this', newStyle: 'new', classes: true, needsExplicitSuper: true,
  dictSep: ':', dicts: true, inOp: 'in',
  errors: { style: 'braces', errMsg: '.message', throwWrap: 'new Error' },
  inputCall: 'prompt',
  intDiv: 'mathfloor',
  sortCall: { style: 'method', name: 'toSorted' },
  strMethods: { upper: 'toUpperCase', lower: 'toLowerCase', trim: 'trim', starts: 'startsWith', has: 'includes' },
  toStr: { style: 'call', name: 'String' },
  indentUnit: '  '
};

const RUBY = {
  id: 'ruby',
  name: 'Ruby',
  blocks: 'end',              // blocks close with the word "end"
  comment: '#',
  headerColon: false,
  condParens: false,
  funcKeyword: 'def',
  declKeyword: null,
  hoistDecls: false,
  interp: true,               // "text #{value}" string interpolation
  floatDivision: false,       // whole / whole truncates, so division needs .to_f
  words: {
    'if': 'if', 'elsif': 'elif', 'else': 'else', 'while': 'while', 'for': 'for',
    'in': 'in', 'def': 'func', 'return': 'return', 'break': 'break',
    'next': 'continue', 'end': 'end', 'class': 'class', 'super': 'super',
    'begin': 'try', 'rescue': 'catch', 'raise': 'throw',
    'true': 'true', 'false': 'false', 'nil': 'null'
  },
  ops: { '&&': 'and', '||': 'or', '!': 'not', '**': '**' },
  classWord: 'class', parentStyle: 'lt', ctorName: 'initialize', selfWord: 'self', ivarSigil: '@',
  methodKeyword: 'def', superStyle: 'ruby',
  memberOp: '.', selfSurface: 'self', newStyle: 'dotnew', classes: true, attrReader: true,
  dictSep: '=>', dicts: true, inOp: 'key?', nameSuffix: '?!', charsOf: { style: 'method', name: 'chars' },
  errors: { style: 'ruby', errMsg: '.message', throwWrap: 'bare' },
  inputCall: 'gets', inputSuffix: '.chomp',
  intDiv: 'div',
  sortCall: { style: 'method', name: 'sort' },
  strMethods: { upper: 'upcase', lower: 'downcase', trim: 'strip', starts: 'start_with?', has: 'include?' },
  toStr: { style: 'method', name: 'to_s' },
  loopStyle: 'dots',          // for i in 0...5
  forEachWord: 'in',
  print: { style: 'call', name: 'puts' },
  parenlessPrint: true,       // puts "hi"  needs no brackets
  len: { style: 'property', name: 'length' },
  append: 'push',
  mathCalls: {},
  literals: { true: 'true', false: 'false', null: 'nil' },
  notPrec: 7,
  indentUnit: '  '
};

const TYPESCRIPT = Object.assign({}, JAVASCRIPT, {
  id: 'typescript',
  name: 'TypeScript',
  typed: true,
  annot: true,                // names may carry  : type
  typeNames: { int: 'number', double: 'number', string: 'string', bool: 'boolean', void: 'void', unknown: 'any' },
  // under strict mode a caught error is typed unknown, so it needs saying
  errors: { style: 'braces', errMsg: '.message', throwWrap: 'new Error', catchAnnot: ': any' },
  listType: t => t + '[]',
  indentUnit: '  '
});


/* ---------- statically typed, wrapped targets ---------- */

const boxed = { int: 'Integer', double: 'Double', string: 'String', bool: 'Boolean' };

const GO = {
  id: 'go', name: 'Go', blocks: 'braces', comment: '//',
  headerColon: false, condParens: false, semis: false,
  funcKeyword: 'func', declKeyword: 'var', hoistDecls: false, typed: true,
  words: {
    'if': 'if', 'else': 'else', 'for': 'for', 'range': 'range', 'func': 'func',
    'return': 'return', 'break': 'break', 'continue': 'continue', 'var': 'let',
    'true': 'true', 'false': 'false', 'nil': 'null'
  },
  ops: { '&&': 'and', '||': 'or', '!': 'not' },
  walrus: ':=', goSyntax: true, intDiv: 'plain',
  loopStyle: 'go', forEachWord: 'range', whileWord: 'for', dicts: false,
  strMethods: {}, toStr: { style: 'wrap', name: 'fmt.Sprint' },
  print: { style: 'member', obj: 'fmt', name: 'Println' }, printStyle: 'multi',
  len: { style: 'call', name: 'len' }, append: 'append',
  mathCalls: {}, literals: { true: 'true', false: 'false', null: 'nil' },
  notPrec: 7, floatDivision: false, castFloat: 'float64', castStyle: 'call',
  typeNames: { int: 'int', double: 'float64', string: 'string', bool: 'bool', void: '', unknown: 'interface{}' },
  listType: t => '[]' + t,
  listOps: { get: 'bracket', set: 'bracket', len: 'call', lenName: 'len', strLen: 'len', append: 'reassign' },
  declStyle: 'go',
  inputCall: '__input',
  inputHead: ['package main', '', 'import (', '\t"bufio"', '\t"fmt"', '\t"os"', ')', '',
              'var __in = bufio.NewScanner(os.Stdin)', '',
              'func __input() string {', '\t__in.Scan()', '\treturn __in.Text()', '}', ''],
  wrapper: {
    head: ['package main', '', 'import "fmt"', ''],
    open: [],
    funcIndent: 0, mainOpen: 'func main() {', mainIndent: 1, close: ['}'],
    dropRe: /^(package |import |"(bufio|fmt|os)"$|\)$)/
  },
  indentUnit: '\t'
};

const CSHARP = {
  id: 'csharp', name: 'C#', blocks: 'braces', comment: '//',
  headerColon: false, condParens: true, semis: true,
  funcKeyword: 'static', declKeyword: null, hoistDecls: false, typed: true,
  words: {
    'if': 'if', 'else': 'else', 'for': 'for', 'foreach': 'for', 'in': 'of', 'while': 'while',
    'return': 'return', 'break': 'break', 'continue': 'continue',
    'class': 'class', 'new': 'new', 'base': 'super', 'try': 'try', 'catch': 'catch', 'throw': 'throw',
    'public': 'modifier', 'private': 'modifier', 'protected': 'modifier', 'internal': 'modifier',
    'static': 'modifier', 'virtual': 'modifier', 'override': 'modifier', 'sealed': 'modifier', 'readonly': 'modifier',
    'true': 'true', 'false': 'false', 'null': 'null'
  },
  ops: { '&&': 'and', '||': 'or', '!': 'not' },
  typedSyntax: true, castTypes: ['double', 'int', 'long', 'float'],
  loopStyle: 'typedfor', forEachWord: 'in',
  print: { style: 'member', obj: 'Console', name: 'WriteLine' }, printStyle: 'join', joinOp: '+',
  len: { style: 'property', name: 'Count' }, append: 'Add',
  mathCalls: { abs: 'Math.Abs', min: 'Math.Min', max: 'Math.Max' },
  literals: { true: 'true', false: 'false', null: 'null' },
  notPrec: 7, floatDivision: false, castFloat: '(double)', castStyle: 'prefix',
  typeNames: { int: 'int', double: 'double', string: 'string', bool: 'bool', void: 'void', unknown: 'object' },
  inputCall: 'Console.ReadLine',
  listType: t => 'List<' + t + '>',
  listOps: { get: 'bracket', set: 'bracket', len: 'property', lenName: 'Count', strLen: 'Length', append: 'method', appendName: 'Add', literal: 'brace' },
  declStyle: 'prefix',
  classWord: 'class', parentStyle: 'colon', ctorName: 'ctor', memberOp: '.', selfSurface: 'this', selfWord: 'this',
  newStyle: 'new', classes: true, fieldModifier: 'public ', memberModifier: 'public ', baseInHeader: true, needsVirtual: true, needsForwardingCtor: true,
  intDiv: 'plain',
  dicts: true, dictStyle: 'csharp',
  errors: { style: 'typed', errType: 'Exception', errMsg: '.Message', throwWrap: 'new Exception' },
  strMethods: { upper: 'ToUpper', lower: 'ToLower', trim: 'Trim', starts: 'StartsWith', has: 'Contains' },
  toStr: { style: 'wrap', name: 'Convert.ToString' },
  wrapper: {
    head: ['using System;', 'using System.Collections.Generic;', ''],
    open: ['class Program {'],
    funcIndent: 1, mainOpen: '  static void Main() {', mainIndent: 2, close: ['  }', '}'],
    dropRe: /^(using )/
  },
  indentUnit: '  '
};

const JAVA = {
  id: 'java', name: 'Java', blocks: 'braces', comment: '//',
  headerColon: false, condParens: true, semis: true,
  funcKeyword: 'static', declKeyword: null, hoistDecls: false, typed: true,
  words: {
    'if': 'if', 'else': 'else', 'for': 'for', 'while': 'while',
    'return': 'return', 'break': 'break', 'continue': 'continue',
    'class': 'class', 'extends': 'extends', 'new': 'new', 'super': 'super',
    'try': 'try', 'catch': 'catch', 'throw': 'throw',
    'static': 'modifier', 'public': 'modifier', 'private': 'modifier',
    'protected': 'modifier', 'final': 'modifier', 'abstract': 'modifier',
    'true': 'true', 'false': 'false', 'null': 'null'
  },
  ops: { '&&': 'and', '||': 'or', '!': 'not' },
  typedSyntax: true, castTypes: ['double', 'int', 'long', 'float'],
  loopStyle: 'typedfor', forEachWord: ':',
  print: { style: 'member', obj: 'System.out', name: 'println' }, printStyle: 'join', joinOp: '+',
  len: { style: 'method', name: 'size' }, append: 'add',
  mathCalls: { abs: 'Math.abs', min: 'Math.min', max: 'Math.max' },
  literals: { true: 'true', false: 'false', null: 'null' },
  notPrec: 7, floatDivision: false, castFloat: '(double)', castStyle: 'prefix',
  typeNames: { int: 'int', double: 'double', string: 'String', bool: 'boolean', void: 'void', unknown: 'Object' },
  listType: t => 'List<' + (boxed[t] || t) + '>',
  listOps: { get: 'method', getName: 'get', set: 'method', setName: 'set', len: 'method', lenName: 'size', strLen: 'length', append: 'method', appendName: 'add', literal: 'javalist' },
  declStyle: 'prefix',
  classWord: 'class', parentStyle: 'extends', ctorName: 'ctor', memberOp: '.', selfSurface: 'this', selfWord: 'this',
  newStyle: 'new', classes: true, fieldModifier: '', memberModifier: '', needsForwardingCtor: true,
  intDiv: 'plain',
  dicts: true, dictStyle: 'javamap', dictLiteral: 'statements',
  errors: { style: 'typed', errType: 'Exception', errMsg: '.getMessage()', throwWrap: 'new RuntimeException' },
  strMethods: { upper: 'toUpperCase', lower: 'toLowerCase', trim: 'trim', starts: 'startsWith', has: 'contains' },
  toStr: { style: 'wrap', name: 'String.valueOf' },
  inputCall: '__in.nextLine',
  strEq: 'equals',
  inputDecl: '  static java.util.Scanner __in = new java.util.Scanner(System.in);',
  wrapper: {
    head: ['import java.util.ArrayList;', 'import java.util.LinkedHashMap;', 'import java.util.List;', 'import java.util.Map;', ''],
    open: ['public class Main {'],
    funcIndent: 1, mainOpen: '  public static void main(String[] args) {', mainIndent: 2, close: ['  }', '}'],
    dropRe: /^(import |static java\.util\.Scanner __in)/
  },
  indentUnit: '  '
};

const PHP = {
  id: 'php', name: 'PHP', blocks: 'braces', comment: '//',
  headerColon: false, condParens: true, semis: true,
  funcKeyword: 'function', declKeyword: null, hoistDecls: false, typed: true, annot: false,
  varPrefix: '$',
  words: {
    'if': 'if', 'elseif': 'elif', 'else': 'else', 'for': 'for', 'foreach': 'for', 'as': 'of',
    'while': 'while', 'function': 'func', 'return': 'return', 'break': 'break', 'continue': 'continue',
    'class': 'class', 'extends': 'extends', 'new': 'new', 'parent': 'super',
    'try': 'try', 'catch': 'catch', 'throw': 'throw',
    'public': 'modifier', 'private': 'modifier', 'protected': 'modifier', 'static': 'modifier',
    'true': 'true', 'false': 'false', 'null': 'null'
  },
  parenlessPrint: true, memberOpToken: '->', scopeOpToken: '::', methodKeyword: 'function',
  ops: { '&&': 'and', '||': 'or', '!': 'not', '**': '**', '.': 'concat' },
  loopStyle: 'cstyle', forEachWord: 'as',
  print: { style: 'call', name: 'echo' }, printStyle: 'echo',
  len: { style: 'call', name: 'count' }, append: 'array_push',
  mathCalls: { abs: 'abs', min: 'min', max: 'max' },
  literals: { true: 'true', false: 'false', null: 'null' },
  notPrec: 7, floatDivision: true,
  typeNames: { int: 'int', double: 'float', string: 'string', bool: 'bool', void: 'void', unknown: 'mixed' },
  listType: t => 'array',
  listOps: { get: 'bracket', set: 'bracket', len: 'call', lenName: 'count', strLen: 'strlen', append: 'call', appendName: 'array_push', literal: 'bracket' },
  concatOp: '.',
  intDiv: 'intdiv',
  dicts: true, dictStyle: 'php', dictSep: '=>', charsOf: { style: 'call', name: 'str_split' },
  errors: { style: 'typed', errType: 'Exception', errMsg: '->getMessage()', throwWrap: 'new Exception' },
  strMethods: { upper: 'strtoupper', lower: 'strtolower', trim: 'trim', starts: 'str_starts_with', has: 'str_contains' },
  toStr: { style: 'wrap', name: 'strval' },
  classWord: 'class', parentStyle: 'extends', ctorName: '__construct', memberOp: '->', selfSurface: '$this', selfWord: 'this',
  newStyle: 'new', classes: true, fieldModifier: 'public ', phpParentInit: true, parenNewCall: true, boolEcho: true,
  declStyle: 'none',
  inputExpr: 'trim(fgets(STDIN))',
  wrapper: { head: ['<?php'], open: [], funcIndent: 0, mainOpen: null, mainIndent: 0, close: [], dropRe: /^<\?php/ },
  indentUnit: '  '
};


const KOTLIN = {
  id: 'kotlin', name: 'Kotlin', blocks: 'braces', comment: '//',
  headerColon: false, condParens: true, semis: false,
  funcKeyword: 'fun', declKeyword: 'var', hoistDecls: false, typed: true,
  words: {
    'if': 'if', 'else': 'else', 'for': 'for', 'while': 'while', 'in': 'in',
    'fun': 'func', 'return': 'return', 'break': 'break', 'continue': 'continue',
    'var': 'let', 'val': 'let', 'class': 'class', 'try': 'try', 'catch': 'catch', 'throw': 'throw',
    'until': 'until', 'to': 'to', 'open': 'modifier', 'override': 'modifier', 'lateinit': 'modifier',
    'init': 'init', 'true': 'true', 'false': 'false', 'null': 'null'
  },
  ops: { '&&': 'and', '||': 'or', '!': 'not' },
  loopStyle: 'until', forEachWord: 'in', annot: true, nullAssert: '!!',
  print: { style: 'call', name: 'println' }, printStyle: 'multi',
  interp: true, interpOpen: '${',
  len: { style: 'property', name: 'size' }, append: 'add',
  mathCalls: { abs: 'Math.abs', min: 'Math.min', max: 'Math.max' },
  literals: { true: 'true', false: 'false', null: 'null' },
  notPrec: 7, floatDivision: false, castFloat: '.toDouble()', castStyle: 'suffix',
  typeNames: { int: 'Int', double: 'Double', string: 'String', bool: 'Boolean', void: 'Unit', unknown: 'Any' },
  inputCall: 'readln',
  listType: t => 'MutableList<' + t + '>',
  listOps: { get: 'bracket', set: 'bracket', len: 'property', lenName: 'size', strLen: 'length',
             append: 'method', appendName: 'add', literal: 'kotlin' },
  declStyle: 'kotlin',
  intDiv: 'plain',
  dicts: true, dictStyle: 'kotlin',
  strMethods: { upper: 'uppercase', lower: 'lowercase', trim: 'trim', starts: 'startsWith', has: 'contains' },
  toStr: { style: 'method', name: 'toString', parens: true },
  errors: { style: 'braces', errMsg: '.message', throwWrap: 'Exception', catchAnnot: ': Exception' },
  listCall: 'mutableListOf', dictCall: 'mutableMapOf', methodKeyword: 'fun',
  sortCall: { style: 'method', name: 'sorted', suffix: '.toMutableList()' },
  classWord: 'class', parentStyle: 'kotlin', ctorName: 'ctor', memberOp: '.', selfSurface: 'this', selfWord: 'this',
  newStyle: 'plain', classes: true, needsVirtual: true, kotlinClass: true,
  wrapper: {
    head: [], open: [], funcIndent: 0, mainOpen: 'fun main() {', mainIndent: 1, close: ['}'],
    dropRe: /^(package |import )/
  },
  indentUnit: '    '
};

const SPECS = {
  python: PYTHON, javascript: JAVASCRIPT, typescript: TYPESCRIPT, ruby: RUBY,
  go: GO, java: JAVA, kotlin: KOTLIN, csharp: CSHARP, php: PHP
};

/* ---------- 2. ERRORS ---------- */

class LangError extends Error {
  constructor(msg, line, hint) {
    super(msg);
    this.line = line || 0;
    this.hint = hint || '';
  }
}

/* ---------- 3. TOKENIZER (spec-driven) ---------- */

const PUNCT = ['(', ')', '[', ']', '{', '}', ',', ':', ';', '.'];
const MULTI_OPS = ['...', '..', '=>', '->', '::', '!!', '//', '**', '==', '!=', '<=', '>=', '&&', '||', '+=', '-=', '*=', '/=', '++', '--'];
const SINGLE_OPS = ['+', '-', '*', '/', '%', '<', '>', '=', '!', '?'];

function tokenize(src, spec) {
  const toks = [];
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const indentStack = [0];
  let depth = 0;              // bracket depth: suppresses NEWLINE
  let pendingIndent = spec.blocks === 'indent';

  const push = (kind, value, line, col) => toks.push({ kind, value, line, col });

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const lineNo = li + 1;
    let i = 0;

    // --- indentation handling (only at depth 0, indent-block languages) ---
    if (spec.blocks === 'indent' && depth === 0) {
      let ind = 0;
      while (i < line.length && (line[i] === ' ' || line[i] === '\t')) {
        if (line[i] === '\t') {
          throw new LangError('Tab character used for indentation on line ' + lineNo, lineNo,
            'Python here expects spaces. Use 4 spaces per level.');
        }
        ind++; i++;
      }
      const rest = line.slice(i);
      if (rest.trim() === '' || rest.trimStart().startsWith(spec.comment)) continue; // blank/comment line
      const top = indentStack[indentStack.length - 1];
      if (ind > top) {
        indentStack.push(ind);
        push('INDENT', ind, lineNo, i);
      } else if (ind < top) {
        while (indentStack.length > 1 && indentStack[indentStack.length - 1] > ind) {
          indentStack.pop();
          push('DEDENT', ind, lineNo, i);
        }
        if (indentStack[indentStack.length - 1] !== ind) {
          throw new LangError('Indentation on line ' + lineNo + " doesn't line up with any block", lineNo,
            'Each nested block should be indented one consistent step further than its header.');
        }
      }
    } else {
      while (i < line.length && (line[i] === ' ' || line[i] === '\t')) i++;
    }

    // --- scan the line ---
    while (i < line.length) {
      const c = line[i];
      if (c === ' ' || c === '\t') { i++; continue; }

      if (spec.intDiv === '//' && line.startsWith('//', i)) { push('OP', 'idiv', lineNo, i); i += 2; continue; }

      // comment
      if (line.startsWith(spec.comment, i)) break;

      // interpolated string:  "text #{expr} more"
      const IOPEN = spec.interpOpen || '#{';
      if (spec.interp && c === '"' && line.indexOf(IOPEN, i) > i && line.indexOf(IOPEN, i) < line.indexOf('"', i + 1) + 1) {
        const parts = [];
        let j = i + 1, lit = '';
        let closed = false;
        while (j < line.length) {
          if (line[j] === '\\') { lit += line[j + 1] === 'n' ? '\n' : line[j + 1]; j += 2; continue; }
          if (line[j] === '"') { closed = true; break; }
          if (line.startsWith(IOPEN, j)) {
            if (lit) { parts.push({ t: 'lit', v: lit }); lit = ''; }
            const close = line.indexOf('}', j + IOPEN.length);
            if (close < 0) throw new LangError('Unfinished ' + IOPEN + ' } on line ' + lineNo, lineNo, 'Every ' + IOPEN + ' needs a closing }.');
            parts.push({ t: 'src', v: line.slice(j + IOPEN.length, close) });
            j = close + 1; continue;
          }
          lit += line[j]; j++;
        }
        if (!closed) throw new LangError('Unclosed text string on line ' + lineNo, lineNo, 'Every opening quote needs a closing quote on the same line.');
        if (lit) parts.push({ t: 'lit', v: lit });
        push('STRI', parts, lineNo, i);
        i = j + 1; continue;
      }

      // string
      if (c === '"' || c === "'") {
        const quote = c; let j = i + 1; let out = '';
        while (j < line.length && line[j] !== quote) {
          if (line[j] === '\\') {
            const n = line[j + 1];
            out += n === 'n' ? '\n' : n === 't' ? '\t' : n === '\\' ? '\\' : n === quote ? quote : ('\\' + n);
            j += 2;
          } else { out += line[j]; j++; }
        }
        if (j >= line.length) {
          throw new LangError('Unclosed text string on line ' + lineNo, lineNo,
            'Every opening quote needs a matching closing quote on the same line.');
        }
        push('STR', out, lineNo, i);
        i = j + 1; continue;
      }

      // number
      if (/[0-9]/.test(c)) {
        let j = i; let seenDot = false;
        while (j < line.length && (/[0-9]/.test(line[j]) || (line[j] === '.' && !seenDot && /[0-9]/.test(line[j + 1] || '')))) {
          if (line[j] === '.') seenDot = true;
          j++;
        }
        push('NUM', parseFloat(line.slice(i, j)), lineNo, i);
        i = j; continue;
      }

      // PHP writes every variable with a leading $
      if (spec.varPrefix && c === spec.varPrefix) {
        let j = i + 1;
        while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j++;
        if (j === i + 1) throw new LangError('Expected a variable name after ' + spec.varPrefix + ' on line ' + lineNo, lineNo, '');
        push('NAME', line.slice(i + 1, j), lineNo, i);
        i = j; continue;
      }

      // Ruby writes instance fields as @name
      if (spec.ivarSigil && c === spec.ivarSigil) {
        let j = i + 1;
        while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j++;
        if (j === i + 1) throw new LangError('Expected a field name after @ on line ' + lineNo, lineNo, '');
        push('IVAR', line.slice(i + 1, j), lineNo, i);
        i = j; continue;
      }

      // name / keyword
      if (/[A-Za-z_]/.test(c)) {
        let j = i;
        while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j++;
        // Ruby lets a method name end in ? or !
        if (spec.nameSuffix && j < line.length && spec.nameSuffix.indexOf(line[j]) >= 0) j++;
        const word = line.slice(i, j);
        // hasOwnProperty, or "constructor" and "toString" resolve to Object.prototype
        const canon = Object.prototype.hasOwnProperty.call(spec.words, word) ? spec.words[word] : undefined;
        if (canon) push('KW', canon, lineNo, i);
        else push('NAME', word, lineNo, i);
        i = j; continue;
      }

      // range operators must be seen before the "." punctuation rule
      if (c === '.' && (line.startsWith('...', i) || line.startsWith('..', i))) {
        const op = line.startsWith('...', i) ? '...' : '..';
        push('OP', op, lineNo, i);
        i += op.length; continue;
      }

      // := must be seen before the ":" punctuation rule
      if (spec.walrus && line.startsWith(spec.walrus, i)) {
        push('OP', spec.walrus, lineNo, i);
        i += spec.walrus.length; continue;
      }

      // :: must be seen before the ":" punctuation rule
      if (spec.scopeOpToken && line.startsWith(spec.scopeOpToken, i)) {
        push('OP', spec.scopeOpToken, lineNo, i);
        i += spec.scopeOpToken.length; continue;
      }

      // in PHP a dot joins text; members are reached with ->
      if (spec.concatOp === '.' && c === '.') { push('OP', '+', lineNo, i); i++; continue; }

      // punctuation
      if (PUNCT.includes(c)) {
        if (c === '(' || c === '[') depth++;
        if (c === ')' || c === ']') depth--;
        if (c === '{' && spec.blocks === 'braces') { /* block brace, not a bracket */ }
        push('PUNCT', c, lineNo, i);
        i++; continue;
      }

      // operators (longest first)
      let matched = null;
      for (const op of MULTI_OPS) { if (line.startsWith(op, i)) { matched = op; break; } }
      if (!matched) { for (const op of SINGLE_OPS) { if (c === op) { matched = op; break; } } }
      if (matched) {
        const canon = Object.prototype.hasOwnProperty.call(spec.ops, matched) ? spec.ops[matched] : matched;
        push('OP', canon, lineNo, i);
        i += matched.length; continue;
      }

      throw new LangError('I don\'t recognise the character "' + c + '" on line ' + lineNo, lineNo,
        'Check for a stray symbol or a character from another language.');
    }

    if (depth === 0) push('NEWLINE', null, lineNo, line.length);
  }

  while (indentStack.length > 1) { indentStack.pop(); push('DEDENT', 0, lines.length, 0); }
  push('EOF', null, lines.length + 1, 0);
  return toks;
}


/* ---------- 3b. TYPE INFERENCE ----------
   Statically typed targets need real types, not "dynamic". The subset is
   small enough that a few propagation passes settle every program in the
   curriculum; anything that does not settle is refused rather than guessed. */

const T_INT = 'int', T_DOUBLE = 'double', T_STR = 'string', T_BOOL = 'bool', T_VOID = 'void', T_UNK = 'unknown';
const listOf = t => 'list:' + t;
const isList = t => typeof t === 'string' && t.indexOf('list:') === 0;
const elemOf = t => isList(t) ? t.slice(5) : T_UNK;

let OBJ_BASE = null;   // set while inferring so merging two object types can find a common parent
function mergeType(a, b) {
  if (a === T_UNK || a === undefined) return b === undefined ? T_UNK : b;
  if (b === T_UNK || b === undefined) return a;
  if (a === b) return a;
  if ((a === T_INT && b === T_DOUBLE) || (a === T_DOUBLE && b === T_INT)) return T_DOUBLE;
  if (isList(a) && isList(b)) return listOf(mergeType(elemOf(a), elemOf(b)));
  if (a.indexOf('map:') === 0 && b.indexOf('map:') === 0) {
    return 'map:' + mergeType(a.slice(4, a.indexOf('>')), b.slice(4, b.indexOf('>'))) +
           '>' + mergeType(a.slice(a.indexOf('>') + 1), b.slice(b.indexOf('>') + 1));
  }
  if (a.indexOf('obj:') === 0 && b.indexOf('obj:') === 0 && OBJ_BASE) return OBJ_BASE(a.slice(4), b.slice(4));
  return T_UNK;
}

function inferTypes(ast) {
  const funcs = new Map();
  const classes = new Map();
  const scopes = new Map();
  scopes.set('main', new Map());
  for (const st of ast.body) {
    if (st.kind === 'Class') {
      const methods = new Map();
      for (const m of st.methods) methods.set(m.name, { params: m.params.map(() => T_UNK), ret: T_UNK, node: m, hasReturn: false });
      classes.set(st.name, {
        name: st.name, parent: st.parent, node: st, methods,
        fields: new Map(), ctorParams: st.ctor ? st.ctor.params.map(() => T_UNK) : []
      });
      scopes.set('class:' + st.name + ':new', new Map());
      for (const m of st.methods) scopes.set('class:' + st.name + ':' + m.name, new Map());
    }
  }
  const ancestors = (n) => { const out = []; let c = classes.get(n); while (c) { out.push(c.name); c = c.parent ? classes.get(c.parent) : null; } return out; };
  const commonBase = (a, b) => {
    const as = ancestors(a), bs = ancestors(b);
    for (const x of as) if (bs.indexOf(x) >= 0) return 'obj:' + x;
    return T_UNK;
  };
  const findField = (cls, name) => { let c = classes.get(cls); while (c) { if (c.fields.has(name)) return c.fields.get(name); c = c.parent ? classes.get(c.parent) : null; } return T_UNK; };
  const findMethodSig = (cls, name) => { let c = classes.get(cls); while (c) { if (c.methods.has(name)) return c.methods.get(name); c = c.parent ? classes.get(c.parent) : null; } return null; };
  for (const st of ast.body) {
    if (st.kind === 'Func') {
      funcs.set(st.name, { params: st.params.map(() => T_UNK), ret: T_UNK, node: st, hasReturn: false });
      scopes.set(st.name, new Map());
    }
  }

  const envOf = (scope) => scopes.get(scope) || scopes.get('main');
  function lookup(name, scope) {
    const local = envOf(scope);
    if (local.has(name)) return local.get(name);
    const fn = funcs.get(scope);
    if (fn) { const i = fn.node.params.indexOf(name); if (i >= 0) return fn.params[i]; }
    const g = scopes.get('main');
    return g.has(name) ? g.get(name) : T_UNK;
  }

  const scopeClass = (scope) => scope.indexOf('class:') === 0 ? scope.split(':')[1] : null;

  function typeOf(e, scope) {
    if (!e) return T_UNK;
    switch (e.kind) {
      case 'Self': { const c = scopeClass(scope); return c ? 'obj:' + c : T_UNK; }
      case 'New': {
        const c = classes.get(e.name);
        if (c) e.args.forEach((a, i) => { if (i < c.ctorParams.length) c.ctorParams[i] = mergeType(c.ctorParams[i], typeOf(a, scope)); });
        return 'obj:' + e.name;
      }
      case 'Attr': {
        const ot = typeOf(e.obj, scope);
        return ot.indexOf('obj:') === 0 ? findField(ot.slice(4), e.name) : T_UNK;
      }
      case 'Invoke': {
        const ot = typeOf(e.obj, scope);
        const argTypes = e.args.map(a => typeOf(a, scope));
        if (ot.indexOf('obj:') !== 0) return T_UNK;
        const sig = findMethodSig(ot.slice(4), e.name);
        if (!sig) return T_UNK;
        argTypes.forEach((t, i) => { if (i < sig.params.length) sig.params[i] = mergeType(sig.params[i], t); });
        return sig.ret;
      }
      case 'SuperCall': {
        const c = scopeClass(scope);
        const parent = c && classes.get(c) ? classes.get(c).parent : null;
        e.args.forEach(a => typeOf(a, scope));
        const sig = parent ? findMethodSig(parent, e.name) : null;
        return sig ? sig.ret : T_UNK;
      }
      case 'SuperInit': {
        const c = scopeClass(scope);
        const parent = c && classes.get(c) ? classes.get(c).parent : null;
        const pc = parent ? classes.get(parent) : null;
        e.args.forEach((a, i) => { const t = typeOf(a, scope); if (pc && i < pc.ctorParams.length) pc.ctorParams[i] = mergeType(pc.ctorParams[i], t); });
        return T_VOID;
      }
      case 'Num': return Number.isInteger(e.v) ? T_INT : T_DOUBLE;
      case 'Str': return T_STR;
      case 'Bool': return T_BOOL;
      case 'Null': return T_UNK;
      case 'Ident': {
        const cl = scopeClass(scope);
        if (cl) {
          const own = scopes.get(scope);
          if (own.has(e.name)) return own.get(e.name);
          const holder = scope.split(':')[2] === 'new' ? classes.get(cl) : findMethodSig(cl, scope.split(':')[2]);
          const plist = scope.split(':')[2] === 'new' ? (holder ? holder.ctorParams : []) : (holder ? holder.params : []);
          const pnames = scope.split(':')[2] === 'new' ? (classes.get(cl).node.ctor ? classes.get(cl).node.ctor.params : []) : (holder ? holder.node.params : []);
          const i = pnames.indexOf(e.name);
          if (i >= 0) return plist[i];
          const g = scopes.get('main');
          return g.has(e.name) ? g.get(e.name) : T_UNK;
        }
        return lookup(e.name, scope);
      }
      case 'List': return listOf(e.items.length ? e.items.map(x => typeOf(x, scope)).reduce(mergeType, T_UNK) : T_UNK);
      case 'Dict': {
        const kt = e.pairs.length ? e.pairs.map(([k]) => typeOf(k, scope)).reduce(mergeType, T_UNK) : T_UNK;
        const vt = e.pairs.length ? e.pairs.map(([, v]) => typeOf(v, scope)).reduce(mergeType, T_UNK) : T_UNK;
        return 'map:' + kt + '>' + vt;
      }
      case 'ErrMessage': return T_STR;
      case 'StrUpper': case 'StrLower': case 'StrTrim': return T_STR;
      case 'StrStarts': case 'StrHas': return T_BOOL;
      case 'Index': {
        const base = typeOf(e.obj, scope);
        if (typeof base === 'string' && base.indexOf('map:') === 0) return base.slice(base.indexOf('>') + 1);
        return base === T_STR ? T_STR : elemOf(base);
      }
      case 'Un': return e.op === 'not' ? T_BOOL : typeOf(e.x, scope);
      case 'Bin': {
        if (['==', '!=', '<', '<=', '>', '>=', 'and', 'or', 'in'].includes(e.op)) return T_BOOL;
        if (e.op === '/') return T_DOUBLE;
        if (e.op === 'idiv') return T_INT;
        if (e.op === '**') return T_DOUBLE;
        const l = typeOf(e.l, scope), r = typeOf(e.r, scope);
        if (e.op === '+' && (l === T_STR || r === T_STR)) return T_STR;
        if (e.op === '+' && (isList(l) || isList(r))) return isList(l) ? l : r;
        return mergeType(l, r) === T_DOUBLE ? T_DOUBLE : (l === T_UNK || r === T_UNK ? T_UNK : T_INT);
      }
      case 'Method': {
        typeOf(e.obj, scope);
        const argTs = e.args.map(a => typeOf(a, scope));
        // xs.append(v) teaches the list its element type, exactly like xs[k] = v does
        if (e.name === 'append' && e.obj.kind === 'Ident' && argTs.length) {
          const cur = lookup(e.obj.name, scope);
          if (cur === T_UNK || isList(cur)) {
            const merged = listOf(mergeType(elemOf(cur), argTs[0]));
            const own = envOf(scope);
            if (own.has(e.obj.name)) own.set(e.obj.name, merged);
            else if (scopes.get('main').has(e.obj.name)) scopes.get('main').set(e.obj.name, merged);
            else {
              // a parameter learns its shape from what the body does to it
              const fn = funcs.get(scope);
              if (fn) {
                const i = fn.node.params.indexOf(e.obj.name);
                if (i >= 0) fn.params[i] = mergeType(fn.params[i], merged);
              }
            }
          }
        }
        return T_VOID;
      }
      case 'Call': {
        const argTypes = e.args.map(a => typeOf(a, scope));   // always visit, so nested calls unify
        if (e.name === 'len') return T_INT;
        if (e.name === 'print') return T_VOID;
        if (e.name === 'sorted') return argTypes[0] || T_UNK;
        if (e.name === 'str' || e.name === 'input') return T_STR;
        if (['abs', 'min', 'max'].includes(e.name)) return argTypes.reduce(mergeType, T_INT);
        const f = funcs.get(e.name);
        if (!f) return T_UNK;
        argTypes.forEach((t, i) => { if (i < f.params.length) f.params[i] = mergeType(f.params[i], t); });
        e.args.forEach((a, i) => {
          if (a.kind !== 'Ident' || i >= f.params.length) return;
          const known = f.params[i];
          if (known === T_UNK) return;
          const own = envOf(scope);
          if (own.has(a.name)) own.set(a.name, mergeType(own.get(a.name), known));
          else if (scopes.get('main').has(a.name)) scopes.get('main').set(a.name, mergeType(scopes.get('main').get(a.name), known));
        });
        return f.ret;
      }
      default: return T_UNK;
    }
  }

  function walk(body, scope) {
    const env = envOf(scope);
    for (const st of body) {
      switch (st.kind) {
        case 'Assign':
          typeOf(st.value, scope);
          if (st.target.kind === 'Ident') env.set(st.target.name, mergeType(env.get(st.target.name), typeOf(st.value, scope)));
          else if (st.target.kind === 'Index' && st.target.obj.kind === 'Ident') {
            // seen[x] = 1 tells us what the keys and values actually are
            const holder = st.target.obj.name;
            const cur = lookup(holder, scope);
            const kT = typeOf(st.target.idx, scope), vT = typeOf(st.value, scope);
            const record = (merged) => {
              if (env.has(holder)) { env.set(holder, merged); return; }
              // a parameter learns its shape from what the body does to it
              const fn = funcs.get(scope);
              if (fn) {
                const i = fn.node.params.indexOf(holder);
                if (i >= 0) { fn.params[i] = mergeType(fn.params[i], merged); return; }
              }
              const cl = scopeClass(scope);
              if (cl) {
                const mname = scope.split(':')[2];
                const sig = mname === 'new' ? null : findMethodSig(cl, mname);
                if (sig) {
                  const i = sig.node.params.indexOf(holder);
                  if (i >= 0) { sig.params[i] = mergeType(sig.params[i], merged); return; }
                }
              }
              scopes.get('main').set(holder, merged);
            };
            if (typeof cur === 'string' && cur.indexOf('map:') === 0) {
              record('map:' + mergeType(cur.slice(4, cur.indexOf('>')), kT) + '>' + mergeType(cur.slice(cur.indexOf('>') + 1), vT));
            } else if (isList(cur)) {
              record(listOf(mergeType(elemOf(cur), vT)));
            } else if (cur === T_UNK) {
              // a list would already be known from its literal, so writing by key means a map
              record('map:' + kT + '>' + vT);
            }
          }
          else if (st.target.kind === 'Attr' && st.target.obj.kind === 'Self') {
            const cl = scopeClass(scope);
            if (cl) { const c = classes.get(cl); c.fields.set(st.target.name, mergeType(c.fields.get(st.target.name), typeOf(st.value, scope))); }
          }
          else typeOf(st.target, scope);
          break;
        case 'Class': break;
        case 'Try': walk(st.body, scope); env.set('err', T_STR); walk(st.handler, scope); break;
        case 'Throw': typeOf(st.msg, scope); break;
        case 'ExprStmt': typeOf(st.expr, scope); break;
        case 'Return': {
          const cl = scopeClass(scope);
          if (cl) {
            const mname = scope.split(':')[2];
            const sig = mname === 'new' ? null : findMethodSig(cl, mname);
            if (sig) { sig.hasReturn = true; sig.ret = mergeType(sig.ret, st.value ? typeOf(st.value, scope) : T_VOID); }
            break;
          }
          const f = funcs.get(scope);
          if (f) { f.hasReturn = true; f.ret = mergeType(f.ret, st.value ? typeOf(st.value, scope) : T_VOID); }
          break;
        }
        case 'If': typeOf(st.cond, scope); walk(st.body, scope); walk(st.orelse || [], scope); break;
        case 'While': typeOf(st.cond, scope); walk(st.body, scope); break;
        case 'ForRange':
          typeOf(st.start, scope); typeOf(st.end, scope);
          env.set(st.var, mergeType(env.get(st.var), T_INT));
          walk(st.body, scope);
          break;
        case 'ForEach': {
          const it = typeOf(st.iter, scope);
          const bound = (typeof it === 'string' && it.indexOf('map:') === 0)
            ? it.slice(4, it.indexOf('>'))
            : (it === T_STR ? T_STR : elemOf(it));
          env.set(st.var, mergeType(env.get(st.var), bound));
          walk(st.body, scope);
          break;
        }
        case 'Func': break;
        default: break;
      }
    }
  }

  OBJ_BASE = commonBase;
  for (let pass = 0; pass < 5; pass++) {
    walk(ast.body, 'main');
    for (const [name, f] of funcs) walk(f.node.body, name);
    for (const [cn, c] of classes) {
      if (c.node.ctor) walk(c.node.ctor.body, 'class:' + cn + ':new');
      for (const m of c.node.methods) walk(m.body, 'class:' + cn + ':' + m.name);
    }
  }
  for (const [, f] of funcs) if (!f.hasReturn) f.ret = T_VOID;
  for (const [, c] of classes) for (const [, m] of c.methods) if (!m.hasReturn) m.ret = T_VOID;

  OBJ_BASE = null;
  const withBase = (fn) => (...a) => {
    const prev = OBJ_BASE; OBJ_BASE = commonBase;
    try { return fn(...a); } finally { OBJ_BASE = prev; }
  };
  return {
    funcs, classes, scopes,
    overrides: (cls, method) => { let c = classes.get(cls); c = c && c.parent ? classes.get(c.parent) : null;
      while (c) { if (c.methods.has(method)) return true; c = c.parent ? classes.get(c.parent) : null; } return false; },
    overridden: (cls, method) => {
      for (const [, c] of classes) {
        if (c.name === cls || !c.methods.has(method)) continue;
        let a = c.parent ? classes.get(c.parent) : null;
        while (a) { if (a.name === cls) return true; a = a.parent ? classes.get(a.parent) : null; }
      }
      return false;
    },
    typeOf: withBase((e, scope) => typeOf(e, scope || 'main')),
    varType: withBase((name, scope) => lookup(name, scope || 'main'))
  };
}

/* ---------- 4. PARSER (shared, spec-driven) ---------- */

// Canonical AST node kinds:
//   Program{body} Num{v} Str{v} Bool{v} Null Ident{name} List{items}
//   Bin{op,l,r} Un{op,x} Index{obj,idx} Call{name,args} Method{obj,name,args}
//   Assign{target,value} If{cond,body,orelse} While{cond,body}
//   ForRange{var,start,end,body} ForEach{var,iter,body}
//   Func{name,params,body} Return{value} Break Continue ExprStmt{expr}

const PREC = {
  'to': 0.5, 'or': 1, 'and': 2, 'in': 3, 'idiv': 6,
  '==': 4, '!=': 4, '<': 4, '<=': 4, '>': 4, '>=': 4,
  '+': 5, '-': 5,
  '*': 6, '/': 6, '%': 6,
  '**': 8
};

class Parser {
  constructor(toks, spec) { this.t = toks; this.i = 0; this.spec = spec; this.allowIn = true; }

  peek(k = 0) { return this.t[this.i + k]; }
  next() { return this.t[this.i++]; }
  at(kind, value) {
    const t = this.peek();
    return t.kind === kind && (value === undefined || t.value === value);
  }
  eat(kind, value) { if (this.at(kind, value)) { return this.next(); } return null; }
  expect(kind, value, what) {
    if (this.at(kind, value)) return this.next();
    const t = this.peek();
    throw new LangError(
      'Expected ' + (what || (value != null ? '"' + value + '"' : kind)) + ' on line ' + t.line +
      ', but found ' + describe(t),
      t.line, '');
  }
  skipNewlines() { while (this.at('NEWLINE')) this.next(); }

  // "name: number" / "name: string[]": the annotation is surface only
  skipTypeAnnotation() {
    if (!this.spec.annot) return;
    if (!this.at('PUNCT', ':')) return;
    this.next();
    this.expect('NAME', undefined, 'a type name');
    if (this.at('OP', '<')) {           // Record<string, number> and friends
      let depth = 0;
      do {
        if (this.at('OP', '<')) depth++;
        if (this.at('OP', '>')) depth--;
        this.next();
      } while (depth > 0 && !this.at('EOF'));
    }
    while (this.at('PUNCT', '[') && this.peek(1).kind === 'PUNCT' && this.peek(1).value === ']') { this.next(); this.next(); }
  }

  parseProgram() {
    const body = [];
    this.skipNewlines();
    while (!this.at('EOF')) {
      body.push(this.parseStatement());
      this.skipNewlines();
    }
    return { kind: 'Program', body };
  }

  endStatement() {
    if (this.spec.blocks === 'braces') {
      this.eat('PUNCT', ';');
      if (this.at('NEWLINE')) this.next();
      return;
    }
    if (this.at('EOF') || this.at('DEDENT')) return;
    this.expect('NEWLINE', undefined, 'end of line');
  }

  atStop(stops) {
    const t = this.peek();
    return t.kind === 'KW' && (stops || ['end']).includes(t.value);
  }
  closeEnd() { if (this.spec.blocks === 'end') this.expect('KW', 'end', '"end" to close the block'); }

  parseBlock(stops, allowEmpty) {
    const spec = this.spec;
    const body = [];
    if (spec.blocks === 'end') {
      this.expect('NEWLINE', undefined, 'a new line after the header');
      this.skipNewlines();
      while (!this.atStop(stops || ['end']) && !this.at('EOF')) {
        body.push(this.parseStatement());
        this.skipNewlines();
      }
      if (body.length === 0) throw new LangError('This block is empty', this.peek().line, 'Put at least one statement inside.');
      return body;
    }
    if (spec.blocks === 'indent') {
      this.expect('PUNCT', ':', '":" at the end of the line');
      this.expect('NEWLINE', undefined, 'a new line after ":"');
      this.expect('INDENT', undefined, 'an indented block');
      this.skipNewlines();
      while (!this.at('DEDENT') && !this.at('EOF')) {
        body.push(this.parseStatement());
        this.skipNewlines();
      }
      this.eat('DEDENT');
    } else {
      this.skipNewlines();
      this.expect('PUNCT', '{', '"{" to open the block');
      this.skipNewlines();
      while (!this.at('PUNCT', '}') && !this.at('EOF')) {
        body.push(this.parseStatement());
        this.skipNewlines();
      }
      this.expect('PUNCT', '}', '"}" to close the block');
    }
    if (body.length === 0 && !allowEmpty) {
      throw new LangError('This block is empty', this.peek().line, 'Put at least one statement inside.');
    }
    return body;
  }

  parseCond() {
    if (this.spec.condParens) {
      this.expect('PUNCT', '(', '"(" around the condition');
      const c = this.parseExpr();
      this.expect('PUNCT', ')', '")" after the condition');
      return c;
    }
    return this.parseExpr();
  }

  skipModifiers() { while (this.at('KW', 'modifier')) this.next(); }

  atGoType() { return this.at('NAME') || (this.at('PUNCT', '[') && this.peek(1).kind === 'PUNCT' && this.peek(1).value === ']'); }
  consumeGoType() {
    if (this.at('PUNCT', '[') && this.peek(1).kind === 'PUNCT' && this.peek(1).value === ']') { this.next(); this.next(); }
    if (this.at('NAME')) this.next();
  }

  /* ---- Java and C#: a type is a name, optionally with generics or brackets ---- */
  atTypeStart() { return this.at('NAME'); }
  tryType() {
    if (!this.at('NAME')) return false;
    let k = 1;
    if (this.peek(k).kind === 'OP' && this.peek(k).value === '<') {
      let depth = 0;
      while (this.peek(k).kind !== 'EOF') {
        const t = this.peek(k);
        if (t.kind === 'OP' && t.value === '<') depth++;
        if (t.kind === 'OP' && t.value === '>') { depth--; k++; if (depth === 0) break; continue; }
        k++;
      }
    }
    while (this.peek(k).kind === 'PUNCT' && this.peek(k).value === '[' &&
           this.peek(k + 1).kind === 'PUNCT' && this.peek(k + 1).value === ']') k += 2;
    return this.peek(k).kind === 'NAME' ? k : false;
  }
  consumeType() { const k = this.tryType(); for (let i = 0; i < k; i++) this.next(); }

  /* "a + \" \" + b" is how some languages print several values; take it apart again */
  unjoinPrint(e) {
    const parts = [];
    const flat = n => {
      if (n.kind === 'Bin' && n.op === '+') { flat(n.l); flat(n.r); }
      else parts.push(n);
    };
    flat(e);
    if (parts.length < 3 || parts.length % 2 === 0) return [e];
    for (let i = 1; i < parts.length; i += 2) {
      if (!(parts[i].kind === 'Str' && parts[i].v === ' ')) return [e];
    }
    return parts.filter((_, i) => i % 2 === 0);
  }

  parseStatement() {
    this.skipModifiers();
    const t = this.peek();
    const line = t.line;

    if (t.kind === 'KW') {
      switch (t.value) {
        case 'if': return this.parseIf();
        case 'while': {
          this.next();
          const cond = this.parseCond();
          const body = this.parseBlock();
          this.closeEnd();
          return { kind: 'While', cond, body, line };
        }
        case 'for': return this.parseFor();
        case 'func': return this.parseFunc();
        case 'class': return this.parseClass();
        case 'try': return this.parseTry();
        case 'throw': {
          this.next();
          let e = this.parseExpr();
          // raise Exception("x") / throw new Error("x") / raise "x" all carry one message
          if ((e.kind === 'New' || e.kind === 'Call') && e.args && e.args.length) e = e.args[0];
          this.endStatement();
          return { kind: 'Throw', msg: e, line };
        }
        case 'return': {
          this.next();
          let value = null;
          if (!this.at('NEWLINE') && !this.at('EOF') && !this.at('DEDENT') && !this.at('PUNCT', ';') && !this.at('PUNCT', '}')) {
            value = this.parseExpr();
          }
          this.endStatement();
          return { kind: 'Return', value, line };
        }
        case 'break': this.next(); this.endStatement(); return { kind: 'Break', line };
        case 'continue': this.next(); this.endStatement(); return { kind: 'Continue', line };
        case 'let': {
          this.next();
          const name = this.expect('NAME', undefined, 'a variable name').value;
          if (this.spec.goSyntax && this.atGoType()) {   // Go puts the type after the name
            this.consumeGoType();
            this.endStatement();
            return { kind: 'DeclareOnly', names: [name], line };
          }
          this.skipTypeAnnotation();
          if (this.at('OP', '=')) {
            this.next();
            const value = this.parseExpr();
            this.endStatement();
            return { kind: 'Assign', target: { kind: 'Ident', name }, value, line };
          }
          const names = [name];
          while (this.eat('PUNCT', ',')) {
            names.push(this.expect('NAME', undefined, 'a variable name').value);
            this.skipTypeAnnotation();
          }
          this.endStatement();
          return { kind: 'DeclareOnly', names, line };   // stripped by normalize()
        }
      }
    }

    if (this.spec.goSyntax) {
      if (this.at('KW', 'let')) {                 // var x T
        this.next();
        const nm = this.expect('NAME', undefined, 'a variable name').value;
        if (this.at('NAME')) this.next();          // its type
        this.endStatement();
        return { kind: 'DeclareOnly', names: [nm], line };
      }
      if (this.at('NAME') && this.peek(1).kind === 'OP' && this.peek(1).value === this.spec.walrus) {
        const nm = this.next().value;
        this.next();
        const value = this.parseExpr();
        this.endStatement();
        return { kind: 'Assign', target: { kind: 'Ident', name: nm }, value, line };
      }
    }

    // Java and C#: "int total = 0;" and "static int area(int a, int b) {"
    if (this.spec.typedSyntax && this.atTypeStart()) {
      const k = this.tryType();
      if (k) {
        const after = this.peek(k + 1);
        const isDecl = after.kind === 'OP' && after.value === '=';
        const isBare = after.kind === 'PUNCT' && after.value === ';';
        const isFunc = after.kind === 'PUNCT' && after.value === '(';
        if (isFunc) {
          this.consumeType();
          return this.parseTypedFunc(line);
        }
        if (isDecl || isBare) {
          this.consumeType();
          const name = this.expect('NAME', undefined, 'a variable name').value;
          if (isBare) { this.next(); this.endStatement(); return { kind: 'DeclareOnly', names: [name], line }; }
          this.expect('OP', '=');
          const value = this.parseExpr();
          this.endStatement();
          return { kind: 'Assign', target: { kind: 'Ident', name }, value, line };
        }
      }
    }

    // Ruby lets you write  puts "hi"  with no brackets
    if (this.spec.parenlessPrint && this.at('NAME', this.spec.print.name)) {
      const after = this.peek(1);
      // echo is never a call, so a bracketed first value is still just its first value
      if (this.spec.printStyle === 'echo' || !(after.kind === 'PUNCT' && after.value === '(')) {
        this.next();
        const args = [];
        if (!this.at('NEWLINE') && !this.at('EOF')) {
          do { args.push(this.parseExpr()); } while (this.eat('PUNCT', ','));
        }
        this.endStatement();
        let out = expandArgs(args);
        if (this.spec.printStyle === 'echo') {
          if (out.length && out[out.length - 1].kind === 'Str' && out[out.length - 1].v === '\n') out = out.slice(0, -1);
          out = out.filter((a, i) => !(i % 2 === 1 && a.kind === 'Str' && a.v === ' '));
        }
        return { kind: 'ExprStmt', expr: { kind: 'Call', name: 'print', args: out }, line };
      }
    }

    // assignment or expression statement
    const expr = this.parseExpr();
    if (this.at('OP', '=')) {
      this.next();
      const value = this.parseExpr();
      this.endStatement();
      if (!['Ident', 'Index', 'Attr'].includes(expr.kind)) {
        throw new LangError('You can only assign to a variable, a list slot or a field (line ' + line + ')', line, '');
      }
      // Go grows a slice with  xs = append(xs, v)
      if (value.kind === 'GoAppend') {
        return { kind: 'ExprStmt', expr: { kind: 'Method', obj: value.args[0], name: 'append', args: value.args.slice(1) }, line };
      }
      return { kind: 'Assign', target: expr, value, line };
    }
    for (const cop of ['+=', '-=', '*=', '/=']) {
      if (this.at('OP', cop)) {
        this.next();
        const rhs = this.parseExpr();
        this.endStatement();
        return { kind: 'Assign', target: expr, value: { kind: 'Bin', op: cop[0], l: expr, r: rhs }, line };
      }
    }
    if (this.at('OP', '++') || this.at('OP', '--')) {
      const op = this.next().value;
      this.endStatement();
      return { kind: 'Assign', target: expr, value: { kind: 'Bin', op: op[0], l: expr, r: { kind: 'Num', v: 1 } }, line };
    }
    this.endStatement();
    if (expr.kind === 'Assign' && expr.value && expr.value.kind === 'GoAppend') { /* unreachable */ }
    if (expr.kind === 'IndexSet') {
      return { kind: 'Assign', target: { kind: 'Index', obj: expr.obj, idx: expr.idx }, value: expr.value, line };
    }
    return { kind: 'ExprStmt', expr, line };
  }

  parseIf(nested) {
    const line = this.peek().line;
    this.expect('KW', 'if');
    const cond = this.parseCond();
    const body = this.parseBlock(['elif', 'else', 'end']);
    let orelse = [];
    this.skipNewlinesIfBraces();
    if (this.at('KW', 'elif')) {
      orelse = [this.parseElif(true)];
    } else if (this.at('KW', 'else')) {
      this.next();
      if (this.at('KW', 'if')) orelse = [this.parseIf(true)];    // JS "else if"
      else orelse = this.parseBlock(['end']);
    }
    if (!nested) this.closeEnd();   // an if/elsif/else chain shares one "end"
    return { kind: 'If', cond, body, orelse, line };
  }

  parseElif(nested) {
    const line = this.peek().line;
    this.expect('KW', 'elif');
    const cond = this.parseCond();
    const body = this.parseBlock(['elif', 'else', 'end']);
    let orelse = [];
    if (this.at('KW', 'elif')) orelse = [this.parseElif(true)];
    else if (this.at('KW', 'else')) { this.next(); orelse = this.parseBlock(['end']); }
    if (!nested) this.closeEnd();
    return { kind: 'If', cond, body, orelse, line };
  }

  skipNewlinesIfBraces() {
    if (this.spec.blocks === 'braces') { while (this.at('NEWLINE')) this.next(); }
  }

  parseFor() {
    const line = this.peek().line;
    this.expect('KW', 'for');
    if (this.spec.goSyntax) {
      // for _, x := range list      for i := 0; i < n; i++      for cond
      if (this.at('NAME', '_') && this.peek(1).kind === 'PUNCT' && this.peek(1).value === ',') {
        this.next(); this.next();
        const v = this.expect('NAME', undefined, 'the loop variable name').value;
        this.expect('OP', this.spec.walrus);
        this.expect('KW', 'range', '"range"');
        this.allowIn = false;
        const iter = this.parseExpr();
        this.allowIn = true;
        const body = this.parseBlock();
        return { kind: 'ForEach', var: v, iter, body, line };
      }
      if (this.at('NAME') && this.peek(1).kind === 'OP' && this.peek(1).value === this.spec.walrus) {
        const v = this.next().value;
        this.next();
        const start = this.parseExpr();
        this.expect('PUNCT', ';');
        const cond = this.parseExpr();
        this.expect('PUNCT', ';');
        const upd = this.parseExpr();
        const okUpd = (this.at('OP', '++') && (this.next(), true));
        if (!okUpd || !(cond.kind === 'Bin' && cond.op === '<' && cond.l.kind === 'Ident' && cond.l.name === v) ||
            !(upd.kind === 'Ident' && upd.name === v)) {
          throw new LangError('This loop shape is not supported yet (line ' + line + ')', line,
            'Use for i := 0; i < limit; i++.');
        }
        const body = this.parseBlock();
        return { kind: 'ForRange', var: v, start, end: cond.r, body, line };
      }
      const cond = this.parseCond();               // for used as a while
      const body = this.parseBlock();
      return { kind: 'While', cond, body, line };
    }
    if (this.spec.id === 'php') {
      this.expect('PUNCT', '(');
      const first = this.parseExpr();
      if (this.at('KW', 'of')) {            // foreach ($list as $x)
        this.next();
        const v = this.expect('NAME', undefined, 'the loop variable name').value;
        this.expect('PUNCT', ')');
        const body = this.parseBlock();
        return { kind: 'ForEach', var: v, iter: first, body, line };
      }
      this.expect('OP', '=', '"=" to set the starting value');
      const start = this.parseExpr();
      this.expect('PUNCT', ';');
      const cond = this.parseExpr();
      this.expect('PUNCT', ';');
      const upd = this.parseExpr();
      const okUpd = (this.at('OP', '++') && (this.next(), true));
      const v = first.kind === 'Ident' ? first.name : null;
      if (!v || !okUpd || !(cond.kind === 'Bin' && cond.op === '<')) {
        throw new LangError('This loop shape is not supported yet (line ' + line + ')', line,
          'Use for ($i = 0; $i < limit; $i++).');
      }
      this.expect('PUNCT', ')');
      const body = this.parseBlock();
      return { kind: 'ForRange', var: v, start, end: cond.r, body, line };
    }
    if (this.spec.loopStyle === 'typedfor') {
      this.expect('PUNCT', '(');
      this.consumeType();
      const v = this.expect('NAME', undefined, 'the loop variable name').value;
      if (this.at('PUNCT', ':') || this.at('KW', 'of') || this.at('KW', 'in')) {
        this.next();
        this.allowIn = false;
        const iter = this.parseExpr();
        this.allowIn = true;
        this.expect('PUNCT', ')');
        const body = this.parseBlock();
        return { kind: 'ForEach', var: v, iter, body, line };
      }
      this.expect('OP', '=', '"=" to set the starting value');
      const start = this.parseExpr();
      this.expect('PUNCT', ';');
      const cond = this.parseExpr();
      if (!(cond.kind === 'Bin' && cond.op === '<' && cond.l.kind === 'Ident' && cond.l.name === v)) {
        throw new LangError('This loop shape is not supported yet (line ' + line + ')', line,
          'Use for (int i = 0; i < limit; i++).');
      }
      this.expect('PUNCT', ';');
      const upd = this.parseExpr();
      const okUpd = (this.at('OP', '++') && (this.next(), true));
      if (!(upd.kind === 'Ident' && upd.name === v && okUpd)) {
        throw new LangError('This loop shape is not supported yet (line ' + line + ')', line, 'The update step must be ' + v + '++.');
      }
      this.expect('PUNCT', ')');
      const body = this.parseBlock();
      return { kind: 'ForRange', var: v, start, end: cond.r, body, line };
    }
    if (this.spec.loopStyle === 'until') {
      this.expect('PUNCT', '(');
      const v = this.expect('NAME', undefined, 'the loop variable name').value;
      this.expect('KW', 'in', '"in"');
      this.allowIn = false;
      const a = this.parseExpr();
      this.allowIn = true;
      if (this.at('KW', 'until')) {
        this.next();
        const b = this.parseExpr();
        this.expect('PUNCT', ')');
        const body = this.parseBlock();
        return { kind: 'ForRange', var: v, start: a, end: b, body, line };
      }
      this.expect('PUNCT', ')');
      const body = this.parseBlock();
      return { kind: 'ForEach', var: v, iter: a, body, line };
    }
    if (this.spec.loopStyle === 'dots') {
      const v = this.expect('NAME', undefined, 'the loop variable name').value;
      this.expect('KW', 'in', '"in"');
      this.allowIn = false;
      const a = this.parseExpr();
      this.allowIn = true;
      if (this.at('OP', '...')) {
        this.next();
        const b = this.parseExpr();
        const body = this.parseBlock();
        this.closeEnd();
        return { kind: 'ForRange', var: v, start: a, end: b, body, line };
      }
      if (this.at('OP', '..')) {
        throw new LangError('Use three dots for a counting loop (line ' + line + ')', line,
          '0...5 stops before 5, which is what other languages do. 0..5 would include 5.');
      }
      const body = this.parseBlock();
      this.closeEnd();
      return { kind: 'ForEach', var: v, iter: a, body, line };
    }
    if (this.spec.loopStyle === 'range') {
      const v = this.expect('NAME', undefined, 'the loop variable name').value;
      this.expect('KW', 'in', '"in"');
      // range(...) or an expression to iterate
      if (this.at('NAME', 'range')) {
        this.next();
        this.expect('PUNCT', '(');
        const a = this.parseExpr();
        let start = { kind: 'Num', v: 0 }, end = a;
        if (this.eat('PUNCT', ',')) { start = a; end = this.parseExpr(); }
        if (this.at('PUNCT', ',')) {
          throw new LangError('range() with a step is not supported yet (line ' + line + ')', line,
            'Use range(start, end) for now.');
        }
        this.expect('PUNCT', ')');
        const body = this.parseBlock();
        return { kind: 'ForRange', var: v, start, end, body, line };
      }
      this.allowIn = false;
      const iter = this.parseExpr();
      this.allowIn = true;
      const body = this.parseBlock();
      return { kind: 'ForEach', var: v, iter, body, line };
    }

    // C-style
    this.expect('PUNCT', '(');
    if (this.at('KW', 'let')) {
      this.next();
      const v = this.expect('NAME', undefined, 'the loop variable name').value;
      this.skipTypeAnnotation();
      if (this.at('KW', 'of')) {
        this.next();
        const iter = this.parseExpr();
        this.expect('PUNCT', ')');
        const body = this.parseBlock();
        return { kind: 'ForEach', var: v, iter, body, line };
      }
      this.expect('OP', '=', '"=" to set the starting value');
      const start = this.parseExpr();
      this.expect('PUNCT', ';');
      const cond = this.parseExpr();
      if (!(cond.kind === 'Bin' && cond.op === '<' && cond.l.kind === 'Ident' && cond.l.name === v)) {
        throw new LangError('This loop shape is not supported yet (line ' + line + ')', line,
          'Use for (let i = 0; i < limit; i++). The condition must be "' + v + ' < something".');
      }
      this.expect('PUNCT', ';');
      const upd = this.parseExpr();
      const okUpd = (this.at('OP', '++') && (this.next(), true));
      if (!(upd.kind === 'Ident' && upd.name === v && okUpd)) {
        throw new LangError('This loop shape is not supported yet (line ' + line + ')', line,
          'The update step must be "' + v + '++".');
      }
      this.expect('PUNCT', ')');
      const body = this.parseBlock();
      return { kind: 'ForRange', var: v, start, end: cond.r, body, line };
    }
    throw new LangError('This loop shape is not supported yet (line ' + line + ')', line,
      'Use for (let i = 0; i < limit; i++) or for (let x of list).');
  }

  parseTry() {
    const spec = this.spec;
    const line = this.peek().line;
    this.expect('KW', 'try');
    const body = this.parseBlock(['catch']);
    this.skipNewlinesIfBraces();
    this.expect('KW', 'catch', spec.errors && spec.errors.style === 'ruby' ? '"rescue"' : '"catch"');
    // each language names the caught error differently; this app always calls it err
    if (spec.errors && spec.errors.style === 'python') {
      if (this.at('NAME')) this.next();
      if (this.at('KW', 'as')) { this.next(); this.expect('NAME', undefined, 'a name for the error'); }
    } else if (spec.errors && spec.errors.style === 'ruby') {
      if (this.at('OP', '=>')) { this.next(); this.expect('NAME', undefined, 'a name for the error'); }
    } else {
      this.expect('PUNCT', '(', '"(" before the error name');
      if (this.at('NAME') && this.peek(1).kind === 'NAME') this.next();   // a type in front of the name
      this.expect('NAME', undefined, 'a name for the error');
      this.skipTypeAnnotation();
      this.expect('PUNCT', ')');
    }
    this.inHandler = (this.inHandler || 0) + 1;
    const handler = this.parseBlock(['end']);
    this.inHandler--;
    this.closeEnd();
    return { kind: 'Try', body, handler, line };
  }

  parseKotlinClass(line) {
    const name = this.expect('NAME', undefined, 'a class name').value;
    const headerParams = [];
    if (this.at('PUNCT', '(')) {
      this.next();
      if (!this.at('PUNCT', ')')) {
        do {
          headerParams.push(this.expect('NAME', undefined, 'a parameter name').value);
          this.skipTypeAnnotation();
        } while (this.eat('PUNCT', ','));
      }
      this.expect('PUNCT', ')');
    }
    let parent = null, parentArgs = [];
    if (this.at('PUNCT', ':')) {
      this.next();
      parent = this.expect('NAME', undefined, 'the parent class name').value;
      if (this.at('PUNCT', '(')) parentArgs = this.parseArgs();
    }
    this.skipNewlines();
    this.expect('PUNCT', '{', '"{" to open the class');
    this.skipNewlines();

    let initBody = null;
    const methods = [];
    while (!this.at('PUNCT', '}') && !this.at('EOF')) {
      this.skipModifiers();
      if (this.at('KW', 'let')) {            // a field declaration; the constructor is what fills it
        this.next();
        this.expect('NAME', undefined, 'a field name');
        this.skipTypeAnnotation();
        if (this.at('OP', '=')) { this.next(); this.parseExpr(); }
        this.skipNewlines();
        continue;
      }
      if (this.at('KW', 'init')) {
        this.next();
        initBody = this.parseBlock();
        this.skipNewlines();
        continue;
      }
      methods.push(this.parseMethod());
      this.skipNewlines();
    }
    this.expect('PUNCT', '}', '"}" to close the class');

    let ctor = null;
    if (initBody) {
      const body = parent ? [{ kind: 'ExprStmt', expr: { kind: 'SuperInit', args: parentArgs }, line }].concat(initBody) : initBody;
      ctor = { params: headerParams, body };
    }
    // no init block and the parent simply receives the header values back: an inherited constructor
    return { kind: 'Class', name, parent, ctor, methods, line };
  }

  parseClass() {
    const spec = this.spec;
    const line = this.peek().line;
    this.expect('KW', 'class');
    if (spec.kotlinClass) return this.parseKotlinClass(line);
    const name = this.expect('NAME', undefined, 'a class name').value;
    let parent = null;
    if (spec.parentStyle === 'parens' && this.at('PUNCT', '(')) {
      this.next();
      parent = this.expect('NAME', undefined, 'the parent class name').value;
      this.expect('PUNCT', ')');
    } else if (spec.parentStyle === 'extends' && this.at('KW', 'extends')) {
      this.next();
      parent = this.expect('NAME', undefined, 'the parent class name').value;
    } else if (spec.parentStyle === 'lt' && this.at('OP', '<')) {
      this.next();
      parent = this.expect('NAME', undefined, 'the parent class name').value;
    } else if (spec.parentStyle === 'colon' && this.at('PUNCT', ':')) {
      this.next();
      parent = this.expect('NAME', undefined, 'the parent class name').value;
    }

    const members = [];
    if (spec.blocks === 'indent') {
      this.expect('PUNCT', ':', '":" after the class name');
      this.expect('NEWLINE', undefined, 'a new line');
      this.expect('INDENT', undefined, 'an indented block');
      this.skipNewlines();
      while (!this.at('DEDENT') && !this.at('EOF')) { members.push(this.parseMethod()); this.skipNewlines(); }
      this.eat('DEDENT');
    } else if (spec.blocks === 'end') {
      this.expect('NEWLINE', undefined, 'a new line');
      this.skipNewlines();
      while (!this.at('KW', 'end') && !this.at('EOF')) {
        if (this.at('NAME', 'attr_reader') || this.at('NAME', 'attr_accessor')) {
          while (!this.at('NEWLINE') && !this.at('EOF')) this.next();
          this.skipNewlines();
          continue;
        }
        members.push(this.parseMethod());
        this.skipNewlines();
      }
      this.expect('KW', 'end', '"end" to close the class');
    } else {
      this.skipNewlines();
      this.expect('PUNCT', '{', '"{" to open the class');
      this.skipNewlines();
      while (!this.at('PUNCT', '}') && !this.at('EOF')) {
        this.skipModifiers();
        // a bare field declaration, as PHP writes them
        if (this.at('NAME') && this.peek(1).kind === 'PUNCT' && this.peek(1).value === ';') {
          this.next(); this.next(); this.skipNewlines(); continue;
        }
        // TypeScript may declare fields up front; they carry no meaning here
        if (this.at('NAME') && this.peek(1).kind === 'PUNCT' && this.peek(1).value === ':') {
          this.next(); this.skipTypeAnnotation(); this.eat('PUNCT', ';'); this.skipNewlines(); continue;
        }
        if (spec.typedSyntax) {
          this.skipModifiers();
          const k = this.tryType();
          if (k && this.peek(k + 1).kind === 'PUNCT' && this.peek(k + 1).value === ';') {
            this.consumeType(); this.next(); this.next(); this.skipNewlines(); continue;   // a field
          }
          if (this.at('NAME', name) && this.peek(1).kind === 'PUNCT' && this.peek(1).value === '(') {
            members.push(this.parseTypedMember(spec.ctorName));
            this.skipNewlines(); continue;
          }
          if (k && this.peek(k + 1).kind === 'PUNCT' && this.peek(k + 1).value === '(') {
            this.consumeType();
            members.push(this.parseTypedMember(null));
            this.skipNewlines(); continue;
          }
        }
        members.push(this.parseMethod());
        this.skipNewlines();
      }
      this.expect('PUNCT', '}', '"}" to close the class');
    }

    let ctor = null;
    const methods = [];
    for (const m of members) {
      if (m.name === spec.ctorName) ctor = { params: m.params, body: m.body };
      else methods.push(m);
    }
    return { kind: 'Class', name, parent, ctor, methods, line };
  }

  parseTypedMember(forcedName) {
    const line = this.peek().line;
    const nm = this.expect('NAME', undefined, 'a member name').value;
    this.expect('PUNCT', '(');
    const params = [];
    if (!this.at('PUNCT', ')')) {
      do {
        this.consumeType();
        params.push(this.expect('NAME', undefined, 'a parameter name').value);
      } while (this.eat('PUNCT', ','));
    }
    this.expect('PUNCT', ')');
    let pre = [];
    if (this.at('PUNCT', ':')) {          // C# writes the parent call in the header
      this.next();
      if (this.at('KW', 'super')) this.next();          // C# spells it base
      else this.expect('NAME', undefined, '"base"');
      pre = [{ kind: 'ExprStmt', expr: { kind: 'SuperInit', args: this.parseArgs() }, line }];
    }
    const body = pre.concat(this.parseBlock(undefined, pre.length > 0));
    return { name: forcedName || nm, params, body, line };
  }

  parseMethod() {
    const spec = this.spec;
    this.skipModifiers();
    const line = this.peek().line;
    if (spec.methodKeyword) this.expect('KW', 'func', '"' + spec.methodKeyword + '"');
    const name = this.expect('NAME', undefined, 'a method name').value;
    this.expect('PUNCT', '(');
    let params = [];
    if (!this.at('PUNCT', ')')) {
      do {
        params.push(this.expect('NAME', undefined, 'a parameter name').value);
        this.skipTypeAnnotation();
      } while (this.eat('PUNCT', ','));
    }
    this.expect('PUNCT', ')');
    this.skipTypeAnnotation();
    // Python names the receiver explicitly; it is implied everywhere else
    if (spec.explicitSelfParam && params[0] === 'self') params = params.slice(1);
    const body = this.parseBlock();
    this.closeEnd();
    return { name, params, body, line };
  }

  parseTypedFunc(line) {
    const name = this.expect('NAME', undefined, 'a function name').value;
    this.expect('PUNCT', '(');
    const params = [];
    if (!this.at('PUNCT', ')')) {
      do {
        this.consumeType();
        params.push(this.expect('NAME', undefined, 'a parameter name').value);
      } while (this.eat('PUNCT', ','));
    }
    this.expect('PUNCT', ')');
    const body = this.parseBlock();
    return { kind: 'Func', name, params, body: stripParamCopies(body, params), line };
  }

  parseFunc() {
    const line = this.peek().line;
    this.expect('KW', 'func');
    const name = this.expect('NAME', undefined, 'a function name').value;
    this.expect('PUNCT', '(');
    const params = [];
    if (!this.at('PUNCT', ')')) {
      do {
        params.push(this.expect('NAME', undefined, 'a parameter name').value);
        if (this.spec.goSyntax && this.atGoType()) this.consumeGoType();   // Go puts the type after the name
        else this.skipTypeAnnotation();
      } while (this.eat('PUNCT', ','));
    }
    this.expect('PUNCT', ')');
    if (this.spec.goSyntax && this.atGoType()) this.consumeGoType();  // and the return type after the brackets
    this.skipTypeAnnotation();
    const body = this.parseBlock();
    this.closeEnd();
    return { kind: 'Func', name, params, body: stripParamCopies(body, params), line };
  }

  /* --- expressions --- */

  parseExpr(minPrec = 0) {
    let left = this.parseUnary();
    for (;;) {
      const t = this.peek();
      let op = (t.kind === 'OP' || t.kind === 'KW') ? t.value : null;
      if (op === 'in' && !this.allowIn) op = null;          // "for x in y" must not be read as a test
      // where a bare slash means integer division, a float cast is what marks the other kind
      if (op === '/' && this.spec.intDiv === 'plain') {
        if (left && left.kind === 'FloatCast') left = left.x;
        else op = 'idiv';
      }
      const prec = op != null ? PREC[op] : undefined;
      if (prec === undefined || prec < minPrec || op === '**') break;  // ** handled in parsePower
      this.next();
      let right = this.parseExpr(prec + 1);
      if (right && right.kind === 'FloatCast') right = right.x;
      if (left && left.kind === 'FloatCast') left = left.x;
      left = { kind: 'Bin', op, l: left, r: right };
    }
    if (minPrec === 0 && this.at('OP', '?')) {
      const line = this.peek().line;
      this.next();
      const a = this.parseExpr();
      this.expect('PUNCT', ':', '":" in the ? : form');
      const b = this.parseExpr();
      // PHP prints booleans as words with this shape; anything else is out of scope
      if (a.kind === 'Str' && a.v === 'true' && b.kind === 'Str' && b.v === 'false') return left;
      throw new LangError('The ? : form is not supported yet (line ' + line + ')', line,
        'Write it as an if and an else instead.');
    }
    if (left && left.kind === 'FloatCast') left = left.x;
    return left;
  }

  parseUnary() {
    if (this.at('KW', 'not') || this.at('OP', 'not')) {
      this.next();
      const np = this.spec.notPrec;
      return { kind: 'Un', op: 'not', x: np >= 7 ? this.parseUnary() : this.parseExpr(np) };
    }
    if (this.at('OP', '-')) { this.next(); return { kind: 'Un', op: '-', x: this.parseUnary() }; }
    return this.parsePower();
  }

  // power ::= postfix ["**" unary]   (right-associative, binds tighter than unary minus)
  parsePower() {
    const left = this.parsePostfix();
    if (this.at('OP', '**')) {
      this.next();
      return { kind: 'Bin', op: '**', l: left, r: this.parseUnary() };
    }
    return left;
  }

  parsePostfix() {
    let node = this.parsePrimary();
    for (;;) {
      if (this.spec.nullAssert && this.at('OP', this.spec.nullAssert)) { this.next(); continue; }
      if (this.at('PUNCT', '[')) {
        this.next();
        const idx = this.parseExpr();
        this.expect('PUNCT', ']');
        node = { kind: 'Index', obj: node, idx };
      } else if (this.at('PUNCT', '.') || (this.spec.memberOpToken && this.at('OP', this.spec.memberOpToken)) ||
                 (this.spec.scopeOpToken && this.at('OP', this.spec.scopeOpToken))) {
        this.next();
        const name = this.expect('NAME', undefined, 'a property or method name').value;
        node = this.finishMember(node, name);
      } else if (this.at('PUNCT', '(')) {
        const args = this.parseArgs();
        if (node.kind === 'Ident') node = this.builtinCall(node.name, args);
        else throw new LangError('This value is not something you can call', this.peek().line, '');
      } else break;
    }
    return node;
  }

  memberPath(node) {
    if (node.kind === 'Ident') return node.name;
    if (node.kind === 'Attr') { const p = this.memberPath(node.obj); return p ? p + '.' + node.name : null; }
    return null;
  }

  finishMember(obj, name) {
    const spec = this.spec;
    if (spec.print.style === 'member' && this.memberPath(obj) === spec.print.obj &&
        name === spec.print.name && this.at('PUNCT', '(')) {
      const args = this.parseArgs();
      return { kind: 'Call', name: 'print', args: (spec.printStyle === 'join' && args.length === 1) ? this.unjoinPrint(args[0]) : args };
    }
    if (spec.typedSyntax) {
      const path = this.memberPath(obj);
      if (path === 'List' && name === 'of' && this.at('PUNCT', '(')) return { kind: 'List', items: this.parseArgs() };
      if ((path === 'String' && name === 'valueOf') || (path === 'Convert' && name === 'ToString')) {
        return { kind: 'Call', name: 'str', args: this.parseArgs() };
      }
      if (name === 'keySet' && this.at('PUNCT', '(')) { this.parseArgs(); return obj; }
      if (name === 'Keys' && !this.at('PUNCT', '(')) return obj;
      if (name === 'size' && this.at('PUNCT', '(')) { this.parseArgs(); return { kind: 'Call', name: 'len', args: [obj] }; }
      if (name === 'length' && this.at('PUNCT', '(')) { this.parseArgs(); return { kind: 'Call', name: 'len', args: [obj] }; }
      if ((name === 'Count' || name === 'Length') && !this.at('PUNCT', '(')) return { kind: 'Call', name: 'len', args: [obj] };
      if (name === 'get' && this.at('PUNCT', '(')) {
        const args = this.parseArgs();
        if (args.length === 1) return { kind: 'Index', obj, idx: args[0] };
      }
      if ((name === 'set' || name === 'put') && this.at('PUNCT', '(')) {
        const args = this.parseArgs();
        if (args.length === 2) return { kind: 'IndexSet', obj, idx: args[0], value: args[1] };
      }
      if ((name === 'containsKey' || name === 'ContainsKey') && this.at('PUNCT', '(')) {
        const args = this.parseArgs();
        return { kind: 'Bin', op: 'in', l: args[0], r: obj };
      }
    }
    if (spec.id === 'ruby' && name === 'new' && obj.kind === 'Ident' && /^[A-Z]/.test(obj.name)) {
      return { kind: 'New', name: obj.name, args: this.parseArgs() };
    }
    // console.log(...)
    if (spec.print.style === 'member' && obj.kind === 'Ident' && obj.name === spec.print.obj && name === spec.print.name) {
      const args = this.parseArgs();
      return { kind: 'Call', name: 'print', args: expandArgs(args) };
    }
    // Math.abs / Math.min / Math.max
    if (obj.kind === 'Ident' && obj.name === 'Math') {
      for (const [canon, surface] of Object.entries(spec.mathCalls)) {
        if (surface === 'Math.' + name) { const args = this.parseArgs(); return { kind: 'Call', name: canon, args }; }
      }
    }
    if (spec.strEq && name === spec.strEq && this.at('PUNCT', '(')) {
      const args = this.parseArgs();
      if (args.length === 1) return { kind: 'Bin', op: '==', l: obj, r: args[0] };
    }
    // a qualified console read (Console.ReadLine(), __in.nextLine()) reads back as input()
    if (spec.inputCall && spec.inputCall.indexOf('.') > 0 && obj.kind === 'Ident' &&
        obj.name + '.' + name === spec.inputCall) {
      if (this.at('PUNCT', '(')) this.parseArgs();
      return { kind: 'Call', name: 'input', args: [] };
    }
    // x.length
    if (spec.len.style === 'property' && name === spec.len.name) {
      return { kind: 'Call', name: 'len', args: [obj] };
    }
    if (spec.id === 'php' && obj.kind === 'Super' ) { /* handled below */ }
    if (obj.kind === 'Ident' && obj.name === 'err' && this.inHandler &&
        ['message', 'getMessage', 'Message'].includes(name)) {
      if (this.at('PUNCT', '(')) this.parseArgs();
      return { kind: 'ErrMessage' };
    }
    if (spec.sortCall && spec.sortCall.suffix && name === 'toMutableList' && this.at('PUNCT', '(')) {
      this.parseArgs();
      return obj;                       // Kotlin's sorted() hands back an immutable list
    }
    if (spec.sortCall && spec.sortCall.style === 'method' && name === spec.sortCall.name && this.at('PUNCT', '(')) {
      this.parseArgs();
      return { kind: 'Call', name: 'sorted', args: [obj] };
    }
    if (spec.charsOf && spec.charsOf.style === 'method' && name === spec.charsOf.name && !this.at('PUNCT', '(')) return obj;
    if (spec.id === 'ruby' && name === 'keys' && !this.at('PUNCT', '(')) return obj;   // d.keys is how Ruby spells it
    if (spec.id === 'kotlin') {
      if (name === 'keys' && !this.at('PUNCT', '(')) return obj;
      if (name === 'containsKey' && this.at('PUNCT', '(')) {
        const args = this.parseArgs();
        return { kind: 'Bin', op: 'in', l: args[0], r: obj };
      }
    }
    if (spec.listOps && spec.listOps.strLen && name === spec.listOps.strLen && !this.at('PUNCT', '(')) {
      return { kind: 'Call', name: 'len', args: [obj] };
    }
    if (obj.kind === 'Ident' && obj.name === 'Object' && name === 'keys' && this.at('PUNCT', '(')) {
      const args = this.parseArgs();
      return args[0];
    }
    if (spec.intDiv === 'mathfloor' && obj.kind === 'Ident' && obj.name === 'Math' && name === 'floor' && this.at('PUNCT', '(')) {
      const fargs = this.parseArgs();
      if (fargs.length === 1 && fargs[0].kind === 'Bin' && fargs[0].op === '/') {
        return { kind: 'Bin', op: 'idiv', l: fargs[0].l, r: fargs[0].r };
      }
      return fargs[0];
    }
    if (spec.intDiv === 'div' && name === 'div' && this.at('PUNCT', '(')) {
      const dargs = this.parseArgs();
      return { kind: 'Bin', op: 'idiv', l: obj, r: dargs[0] };
    }
    // a float cast marks true division rather than the integer kind
    if (name === 'to_f' && spec.id === 'ruby') return { kind: 'FloatCast', x: obj };
    if (name === 'toDouble' && spec.id === 'kotlin' && this.at('PUNCT', '(')) { this.parseArgs(); return { kind: 'FloatCast', x: obj }; }
    // x.push(...) / x.append(...)
    if (name === spec.append) {
      const args = this.parseArgs();
      return { kind: 'Method', obj, name: 'append', args };
    }
    // text helpers, spelled differently everywhere
    const sm = spec.strMethods || {};
    for (const canon of Object.keys(sm)) {
      if (sm[canon] === name && this.at('PUNCT', '(')) {
        const args = this.parseArgs();
        if (canon === 'has') return { kind: 'Bin', op: 'in', l: args[0], r: obj };
        return { kind: 'Str' + canon.charAt(0).toUpperCase() + canon.slice(1), obj, args };
      }
    }
    if (spec.inputSuffix === '.chomp' && name === 'chomp' && obj.kind === 'Call' && obj.name === 'input') {
      if (this.at('PUNCT', '(')) this.parseArgs();
      return obj;
    }
    if (spec.toStr && spec.toStr.style === 'method' && name === spec.toStr.name) {
      if (this.at('PUNCT', '(')) this.parseArgs();     // Ruby writes .to_s with or without brackets
      return { kind: 'Call', name: 'str', args: [obj] };
    }
    if (spec.inOp === 'key?' && name === 'key?' && this.at('PUNCT', '(')) {
      const args = this.parseArgs();
      return { kind: 'Bin', op: 'in', l: args[0], r: obj };
    }
    // anything else is a field read or a method call on an object
    if (this.at('PUNCT', '(')) return { kind: 'Invoke', obj, name, args: this.parseArgs() };
    return { kind: 'Attr', obj, name };
  }

  builtinCall(name, args) {
    const spec = this.spec;
    if (spec.id === 'php') {
      if (name === 'trim' && args.length === 1 && args[0] && args[0].kind === 'Call' &&
          args[0].name === 'fgets') return { kind: 'Call', name: 'input', args: [] };
      if (name === 'array' && !args.length) return { kind: 'Dict', pairs: [] };
      if (name === 'str_split') return args[0];
      if (name === 'intdiv') return { kind: 'Bin', op: 'idiv', l: args[0], r: args[1] };
      if (name === 'count' || name === 'strlen') return { kind: 'Call', name: 'len', args };
      if (name === 'array_push') return { kind: 'Method', obj: args[0], name: 'append', args: args.slice(1) };
      if (name === 'array_key_exists') return { kind: 'Bin', op: 'in', l: args[0], r: args[1] };
      if (name === 'array_keys') return args[0];
      if (name === 'strval') return { kind: 'Call', name: 'str', args };
      if (name === 'strtoupper') return { kind: 'StrUpper', obj: args[0], args: [] };
      if (name === 'strtolower') return { kind: 'StrLower', obj: args[0], args: [] };
      if (name === 'trim') return { kind: 'StrTrim', obj: args[0], args: [] };
      if (name === 'str_starts_with') return { kind: 'StrStarts', obj: args[0], args: [args[1]] };
      if (name === 'str_contains') return { kind: 'Bin', op: 'in', l: args[1], r: args[0] };
    }
    if (spec.goSyntax) {
      if (name === 'float64') return { kind: 'FloatCast', x: args[0] };
      if (name === 'int') return args[0];
      if (name === 'append') return { kind: 'GoAppend', args };
    }
    if (spec.listCall && name === spec.listCall) return { kind: 'List', items: args };
    if (spec.dictCall && name === spec.dictCall) {
      const pairs = args.map(a => {
        if (!(a.kind === 'Bin' && a.op === 'to')) {
          throw new LangError('Each entry needs the form key to value', 0, '');
        }
        return [a.l, a.r];
      });
      return { kind: 'Dict', pairs };
    }
    if (spec.inputCall && name === spec.inputCall) return { kind: 'Call', name: 'input', args: [] };
    if (spec.sortCall && spec.sortCall.style === 'call' && name === spec.sortCall.name) return { kind: 'Call', name: 'sorted', args };
    if (spec.toStr && spec.toStr.style === 'call' && name === spec.toStr.name) return { kind: 'Call', name: 'str', args };
    if (spec.print.style === 'call' && name === spec.print.name) {
      return { kind: 'Call', name: 'print', args: expandArgs(args) };
    }
    if (spec.len.style === 'call' && name === spec.len.name) return { kind: 'Call', name: 'len', args };
    for (const [canon, surface] of Object.entries(spec.mathCalls)) {
      if (surface === name) return { kind: 'Call', name: canon, args };
    }
    return { kind: 'Call', name, args };   // user-defined function
  }

  parseArgs() {
    this.expect('PUNCT', '(');
    const args = [];
    if (!this.at('PUNCT', ')')) {
      do { args.push(this.parseExpr()); } while (this.eat('PUNCT', ','));
    }
    this.expect('PUNCT', ')');
    return args;
  }

  parsePrimary() {
    const t = this.peek();
    if (t.kind === 'NUM') { this.next(); return { kind: 'Num', v: t.value }; }
    if (t.kind === 'STR') { this.next(); return { kind: 'Str', v: t.value }; }
    if (t.kind === 'STRI') {
      this.next();
      const parts = t.value.map(pt => pt.t === 'lit'
        ? { kind: 'lit', v: pt.v }
        : { kind: 'expr', node: new Parser(tokenize(pt.v, this.spec), this.spec).parseExpr() });
      return { kind: 'StrI', parts };
    }
    if (t.kind === 'KW' && t.value === 'true') { this.next(); return { kind: 'Bool', v: true }; }
    if (t.kind === 'KW' && t.value === 'false') { this.next(); return { kind: 'Bool', v: false }; }
    if (t.kind === 'KW' && t.value === 'null') { this.next(); return { kind: 'Null' }; }
    if (t.kind === 'IVAR') { this.next(); return { kind: 'Attr', obj: { kind: 'Self' }, name: t.value }; }
    if (t.kind === 'KW' && t.value === 'new') {
      this.next();
      const cname = this.expect('NAME', undefined, 'a class name').value;
      if (this.at('OP', '<')) {            // the diamond, or an explicit type argument
        let depth = 0;
        do {
          if (this.at('OP', '<')) depth++;
          if (this.at('OP', '>')) depth--;
          this.next();
        } while (depth > 0 && !this.at('EOF'));
      }
      const args = this.at('PUNCT', '(') ? this.parseArgs() : [];
      if (this.at('PUNCT', '{')) {         // C# collection initialiser
        this.next();
        const items = [];
        while (!this.at('PUNCT', '}') && !this.at('EOF')) {
          if (this.at('PUNCT', '{')) {
            this.next();
            const k = this.parseExpr();
            this.expect('PUNCT', ',');
            const v = this.parseExpr();
            this.expect('PUNCT', '}');
            items.push([k, v]);
          } else items.push(this.parseExpr());
          if (!this.eat('PUNCT', ',')) break;
        }
        this.expect('PUNCT', '}');
        if (items.length && Array.isArray(items[0])) return { kind: 'Dict', pairs: items };
        // an empty initialiser tells you nothing, so go by the type that was named
        if (!items.length && /^(Dictionary|Map|LinkedHashMap|HashMap)$/.test(cname)) return { kind: 'Dict', pairs: [] };
        return { kind: 'List', items };
      }
      if (/^(ArrayList|List)$/.test(cname)) {
        if (args.length === 1 && args[0].kind === 'List') return args[0];
        return { kind: 'List', items: [] };
      }
      if (/^(LinkedHashMap|HashMap|Dictionary|Map)$/.test(cname)) return { kind: 'Dict', pairs: [] };
      return { kind: 'New', name: cname, args };
    }
    // a cast such as (double)x carries no meaning here
    if (t.kind === 'PUNCT' && t.value === '(' && (this.spec.castTypes || []).length &&
        this.peek(1).kind === 'NAME' && (this.spec.castTypes || []).includes(this.peek(1).value) &&
        this.peek(2).kind === 'PUNCT' && this.peek(2).value === ')' &&
        ['NAME', 'NUM', 'STR'].includes(this.peek(3).kind) || (t.kind === 'PUNCT' && t.value === '(' &&
        (this.spec.castTypes || []).includes((this.peek(1) || {}).value) && this.peek(2).value === ')' && this.peek(3).value === '(')) {
      this.next(); this.next(); this.next();
      return { kind: 'FloatCast', x: this.parseUnary() };
    }
    if (t.kind === 'KW' && t.value === 'super' && this.spec.scopeOpToken && this.peek(1).kind === 'OP' && this.peek(1).value === this.spec.scopeOpToken) {
      this.next(); this.next();
      const mname = this.expect('NAME', undefined, 'a method name').value;
      const args = this.parseArgs();
      return mname === '__construct' ? { kind: 'SuperInit', args } : { kind: 'SuperCall', name: mname, args };
    }
    if (t.kind === 'KW' && t.value === 'super') {
      this.next();
      if (this.spec.superStyle === 'python') {
        this.expect('PUNCT', '(', '"()" after super');
        this.expect('PUNCT', ')');
        this.expect('PUNCT', '.', '"." after super()');
        const mname = this.expect('NAME', undefined, 'a method name').value;
        const args = this.parseArgs();
        return mname === this.spec.ctorName ? { kind: 'SuperInit', args } : { kind: 'SuperCall', name: mname, args };
      }
      if (this.at('PUNCT', '(')) return { kind: 'SuperInit', args: this.parseArgs() };
      this.expect('PUNCT', '.', '"." after super');
      const mname = this.expect('NAME', undefined, 'a method name').value;
      return { kind: 'SuperCall', name: mname, args: this.parseArgs() };
    }
    if (t.kind === 'NAME') {
      this.next();
      if (this.spec.selfWord && t.value === this.spec.selfWord) return { kind: 'Self' };
      if (this.inHandler && t.value === 'err' && !(this.at('PUNCT', '.') || this.at('OP', '->'))) return { kind: 'ErrMessage' };
      return { kind: 'Ident', name: t.value };
    }
    if (t.kind === 'PUNCT' && t.value === '(') {
      this.next();
      const e = this.parseExpr();
      this.expect('PUNCT', ')');
      return e;
    }
    if (t.kind === 'PUNCT' && t.value === '{') {
      if (!this.spec.dicts) throw new LangError('This language has no dictionary literal here', t.line, '');
      this.next();
      const pairs = [];
      this.skipNewlines();
      if (!this.at('PUNCT', '}')) {
        do {
          this.skipNewlines();
          const k = this.parseExpr();
          if (this.spec.dictSep === '=>') this.expect('OP', '=>', '"=>" between key and value');
          else this.expect('PUNCT', ':', '":" between key and value');
          const v = this.parseExpr();
          pairs.push([k, v]);
          this.skipNewlines();
        } while (this.eat('PUNCT', ','));
      }
      this.skipNewlines();
      this.expect('PUNCT', '}', '"}" to close the dictionary');
      return { kind: 'Dict', pairs };
    }
    if (this.spec.goSyntax && t.kind === 'PUNCT' && t.value === '[' &&
        this.peek(1).kind === 'PUNCT' && this.peek(1).value === ']') {
      this.next(); this.next();
      if (this.at('NAME')) this.next();
      this.expect('PUNCT', '{', '"{" to open the values');
      const items = [];
      if (!this.at('PUNCT', '}')) {
        do { if (this.at('PUNCT', '}')) break; items.push(this.parseExpr()); } while (this.eat('PUNCT', ','));
      }
      this.expect('PUNCT', '}');
      return { kind: 'List', items };
    }
    if (t.kind === 'PUNCT' && t.value === '[') {
      this.next();
      const items = [], pairs = [];
      let isDict = false;
      if (!this.at('PUNCT', ']')) {
        do {
          if (this.at('PUNCT', ']')) break;
          const first = this.parseExpr();
          if (this.at('OP', '=>')) {          // PHP writes both lists and maps in brackets
            this.next();
            isDict = true;
            pairs.push([first, this.parseExpr()]);
          } else items.push(first);
        } while (this.eat('PUNCT', ','));
      }
      this.expect('PUNCT', ']');
      return isDict ? { kind: 'Dict', pairs } : { kind: 'List', items };
    }
    throw new LangError('I got stuck at ' + describe(t) + ' on line ' + t.line, t.line,
      'Something is missing or out of place just before this point.');
  }
}

/* An interpolated string handed to print is the inverse of how print is written out:
   values become #{ } and the spaces between them are the separators. */
function expandArgs(args) {
  if (args.length !== 1 || args[0].kind !== 'StrI') return args;
  const out = [];
  for (const p of args[0].parts) {
    if (p.kind === 'lit') {
      for (const piece of p.v.split(' ')) if (piece !== '') out.push({ kind: 'Str', v: piece });
    } else out.push(p.node);
  }
  return out.length ? out : [{ kind: 'Str', v: '' }];
}

function describe(t) {
  if (t.kind === 'EOF') return 'the end of the program';
  if (t.kind === 'NEWLINE') return 'the end of the line';
  if (t.kind === 'INDENT') return 'an indented block';
  if (t.kind === 'DEDENT') return 'the end of a block';
  if (t.kind === 'STR') return 'the text "' + t.value + '"';
  return '"' + t.value + '"';
}

/* Java, Kotlin, Go and friends wrap everything in an entry point. Take it off
   before parsing, and complain clearly if the expected skeleton is missing. */
function unwrapSource(src, spec) {
  const w = spec.wrapper;
  if (!w) return src;
  let lines = src.replace(/\r\n?/g, '\n').split('\n');
  // A language that needs a helper to read input (Go) emits it as a fixed prefix.
  // Remove it as a block: matching those lines individually would strip things
  // like a bare '}' everywhere else in the program.
  if (spec.inputHead) {
    const head = spec.inputHead;
    let i = 0, j = 0;
    while (j < head.length && i < lines.length) {
      if (lines[i].trim() === head[j].trim()) { i++; j++; }
      else if (head[j].trim() === '') { j++; }
      else if (lines[i].trim() === '') { i++; }
      else break;
    }
    if (j === head.length) lines = lines.slice(i);
  }
  const isOpen = l => (w.open || []).some(o => o.trim() === l.trim() && o.trim() !== '');
  lines = lines.filter(l => !(w.dropRe && w.dropRe.test(l.trim())) && !isOpen(l));
  // The skeleton is optional: writing bare statements is how the lessons work,
  // and a learner should not have to type an entry point to print one line.
  if (w.mainOpen) {
    const idx = lines.findIndex(l => l.trim() === w.mainOpen.trim());
    if (idx >= 0) {
      lines.splice(idx, 1);
      let closes = (w.close || []).length;
      while (closes > 0 && lines.length) {
        const last = lines[lines.length - 1].trim();
        if (last === '') { lines.pop(); continue; }
        if (last === '}') { lines.pop(); closes--; continue; }
        break;
      }
    }
  }
  return lines.join('\n');
}

function parse(src, langId) {
  const spec = SPECS[langId];
  if (!spec) throw new LangError('Unknown language: ' + langId, 0, '');
  if (spec.wrapper) src = unwrapSource(src, spec);
  const p = new Parser(tokenize(src, spec), spec);
  return resolveNew(normalize(p.parseProgram()));
}

/* Python writes Dog("Rex") to build an object and add(1, 2) to call a function.
   Only the class list tells them apart, so that pass happens after parsing. */
function resolveNew(ast) {
  const classNames = new Set();
  const nodes = new Map();
  for (const st of ast.body) if (st.kind === 'Class') { classNames.add(st.name); nodes.set(st.name, st); }
  const ancestorHasCtor = (name) => {
    let n = name ? nodes.get(name) : null;
    while (n) { if (n.ctor) return true; n = n.parent ? nodes.get(n.parent) : null; }
    return false;
  };
  for (const st of ast.body) {
    if (st.kind !== 'Class' || !st.ctor || !st.parent) continue;
    const first = st.ctor.body[0];
    if (first && first.kind === 'ExprStmt' && first.expr.kind === 'SuperInit' &&
        first.expr.args.length === 0 && !ancestorHasCtor(st.parent)) {
      st.ctor.body = st.ctor.body.slice(1);
    }
  }
  if (!classNames.size) return ast;
  const walk = (n) => {
    if (Array.isArray(n)) return n.map(walk);
    if (!n || typeof n !== 'object') return n;
    const out = {};
    for (const [k, v] of Object.entries(n)) out[k] = walk(v);
    if (out.kind === 'Call' && classNames.has(out.name)) return { kind: 'New', name: out.name, args: out.args };
    return out;
  };
  return walk(ast);
}

/* Strip declaration-only statements so ASTs from different languages compare equal. */
function normalize(node) {
  if (Array.isArray(node)) return node.filter(n => n.kind !== 'DeclareOnly').map(normalize);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = normalize(v);
    return out;
  }
  return node;
}

/* Remove position info for structural comparison. */
function stripPos(node) {
  if (Array.isArray(node)) return node.map(stripPos);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) { if (k !== 'line' && k !== 'col') out[k] = stripPos(v); }
    return out;
  }
  return node;
}

/* ---------- 5. PRINTER (AST -> source in any language) ---------- */

const P_PREC = PREC;

let TYPES = null, SCOPE = 'main', LINEMAP = null, DECLARED = null, EXPECT_TYPE = null;

// PHP needs (new Thing())->method(); the others are happy without the brackets
function receiver(obj, spec) {
  const src = expr(obj, spec, 9);
  if (spec.parenNewCall && obj.kind === 'New') return '(' + src + ')';
  return src;
}

const isMap = t => typeof t === 'string' && t.indexOf('map:') === 0;
const printedElem = t => elemOf(t) === T_UNK ? T_INT : elemOf(t);   // a list that never learned its element type prints as an int list
const mapKey = t => t.slice(4, t.indexOf('>'));
const mapVal = t => t.slice(t.indexOf('>') + 1);

function typeSurface(t, spec) {
  const names = spec.typeNames || {};
  if (typeof t === 'string' && t.indexOf('obj:') === 0) return safeName(t.slice(4), spec);
  if (isMap(t)) {
    const k = typeSurface(mapKey(t), spec), v = typeSurface(mapVal(t), spec);
    if (spec.dictStyle === 'javamap') return 'Map<' + (boxed[mapKey(t)] || k) + ', ' + (boxed[mapVal(t)] || v) + '>';
    if (spec.dictStyle === 'kotlin') return 'MutableMap<' + k + ', ' + v + '>';
    if (spec.dictStyle === 'csharp') return 'Dictionary<' + k + ', ' + v + '>';
    if (spec.dictStyle === 'php') return 'array';
    if (spec.annot) return 'Record<' + k + ', ' + v + '>';
    return 'dict';
  }
  if (isList(t)) return spec.listType ? spec.listType(typeSurface(printedElem(t), spec)) : 'list';
  return names[t] || names.unknown || 'any';
}

let CLASS_NODES = null;

function print(ast, langId, opts) {
  const spec = SPECS[langId];
  if (!spec) throw new LangError('Unknown language: ' + langId, 0, '');
  TYPES = inferTypes(ast);      // every language needs this to tell a map from a list
  CLASS_NODES = new Map();
  for (const st of ast.body) if (st.kind === 'Class') CLASS_NODES.set(st.name, st);
  SCOPE = 'main';
  LINEMAP = (opts && opts.map) ? [] : null;
  const out = [];
  if (spec.wrapper) emitWrapped(ast, spec, out);
  else emitBody(ast.body, 0, spec, out, true);
  TYPES = null;
  const map = LINEMAP;
  LINEMAP = null;
  return (opts && opts.map) ? { code: out.join('\n'), map } : out.join('\n');
}

/* Translate, and say which source line produced each output line. */
function translateWithMap(src, fromId, toId) {
  return print(parse(src, fromId), toId, { map: true });
}


const RESERVED = {
  python: ['def','class','return','if','elif','else','for','while','in','not','and','or','import','from','as','pass','break','continue','lambda','global','try','except','finally','raise','with','yield','None','True','False','del','assert','is'],
  javascript: ['let','const','var','function','class','new','return','if','else','for','while','of','in','typeof','instanceof','delete','void','this','super','import','export','default','null','true','false','switch','case','break','continue','try','catch','finally','throw','do','yield','await','async','static','enum'],
  typescript: ['let','const','var','function','class','new','return','if','else','for','while','of','in','typeof','instanceof','delete','void','this','super','import','export','default','null','true','false','switch','case','break','continue','try','catch','finally','throw','do','yield','await','async','static','enum','interface','type','number','string','boolean','any'],
  ruby: ['def','end','class','module','if','elsif','else','unless','while','until','for','in','do','then','begin','rescue','ensure','return','break','next','redo','retry','yield','self','nil','true','false','and','or','not','case','when','alias','super','undef'],
  go: ['func','package','import','var','const','type','struct','interface','map','chan','go','defer','select','range','fallthrough','switch','case','default','if','else','for','return','break','continue','goto','len','cap','make','new','append','copy','delete','string','int','float64','bool','error','nil','true','false','print','println'],
  java: ['double','int','float','class','static','public','void','new','final','import','package','return','if','else','for','while','boolean','char','byte','short','long','abstract','this','super','try','catch','switch','case','default','break','continue','do','enum','extends','implements','instanceof','interface','private','protected','synchronized','throw','throws','transient','volatile','assert','const','goto','null','true','false','record','String'],
  csharp: ['double','int','float','string','object','decimal','bool','class','static','public','void','new','using','namespace','return','if','else','for','foreach','while','in','out','ref','params','base','this','try','catch','switch','case','default','break','continue','do','enum','struct','interface','private','protected','internal','sealed','virtual','override','abstract','readonly','const','null','true','false','var','lock','is','as','typeof','sizeof','checked','unchecked','operator','delegate','event','explicit','implicit'],
  kotlin: ['fun','val','var','class','object','when','is','in','as','if','else','for','while','return','break','continue','try','catch','finally','throw','true','false','null','this','super','open','override','init','companion','data','sealed','interface','abstract','internal','private','public','protected','typealias','Int','Double','String','Boolean','Any','Unit','List','Map'],
  php: ['echo','function','array','list','print','class','new','use','namespace','global','static','public','private','protected','const','var','and','or','xor','endif','endwhile','endfor','foreach','as','do','switch','case','default','break','continue','return','if','else','elseif','while','for','try','catch','finally','throw','null','true','false','empty','isset','unset','include','require','exit','die','clone','instanceof','parent','self','object','string','int','float','bool','iterable','callable','match','fn','readonly','enum']
};

function safeName(name, spec) {
  const list = RESERVED[spec.id] || [];
  if (list.indexOf(name) >= 0) return name + '_';
  // PHP treats class and keyword names case-insensitively, so Parent collides with parent
  if (spec.id === 'php' && list.indexOf(name.toLowerCase()) >= 0) return name + '_';
  return name;
}

function pad(n, spec) { return spec.indentUnit.repeat(n); }

/* Java, C#, Go and PHP need the program split: definitions at the top level,
   everything else inside an entry point. */
function emitWrapped(ast, spec, out) {
  const w = spec.wrapper;
  const klasses = ast.body.filter(st => st.kind === 'Class');
  const funcs = ast.body.filter(st => st.kind === 'Func');
  const rest = ast.body.filter(st => st.kind !== 'Func' && st.kind !== 'Class');
  for (const line of (spec.inputHead && usesInput(ast) ? spec.inputHead : (w.head || []))) out.push(line);
  for (const k of klasses) { emitClass(k, 0, spec, out); out.push(''); }
  for (const line of w.open) out.push(line);
  // Java reads input through one shared Scanner; declare it only if the program asks for input,
  // so every other program's output stays exactly as it was.
  if (spec.inputDecl && usesInput(ast)) { out.push(spec.inputDecl); out.push(''); }
  for (const f of funcs) { emitStatement(f, w.funcIndent, spec, out); out.push(''); }
  if (w.mainOpen) out.push(w.mainOpen);
  emitBody(rest, w.mainIndent, spec, out, true);
  for (const line of w.close) out.push(line);
  while (out.length && out[out.length - 1] === '') out.pop();
}

function usesInput(node) {
  let found = false;
  const walk = (n) => {
    if (found || !n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(walk); return; }
    if (n.kind === 'Call' && n.name === 'input') { found = true; return; }
    for (const v of Object.values(n)) if (v && typeof v === 'object') walk(v);
  };
  walk(node);
  return found;
}

/* Kotlin parameters are `val`. A body that reassigns one needs a local copy
   first, or the program does not compile. */
/* Kotlin printers emit `var x = x` for a reassigned parameter. Reading it back
   would add a statement the author never wrote, so drop those leading no-op
   self-assignments again. */
function stripParamCopies(body, params) {
  const set = new Set(params || []);
  let i = 0;
  while (i < body.length) {
    const st = body[i];
    if (st && st.kind === 'Assign' && st.target && st.target.kind === 'Ident' &&
        st.value && st.value.kind === 'Ident' && st.target.name === st.value.name &&
        set.has(st.target.name)) { i++; continue; }
    break;
  }
  return i ? body.slice(i) : body;
}

function reassignedParams(body, params) {
  const set = new Set(params || []);
  const hit = [];
  const seen = new Set();
  const walk = (stmts) => {
    for (const st of stmts || []) {
      if (st.kind === 'Assign' && st.target && st.target.kind === 'Ident' &&
          set.has(st.target.name) && !seen.has(st.target.name)) {
        seen.add(st.target.name); hit.push(st.target.name);
      }
      if (st.kind === 'If') { walk(st.body); walk(st.orelse); }
      if (st.kind === 'While') walk(st.body);
      if (st.kind === 'ForRange' || st.kind === 'ForEach') walk(st.body);
      if (st.kind === 'Try') { walk(st.body); walk(st.handler); walk(st.finally); }
    }
  };
  walk(body);
  return hit;
}

/* Java and C# declare a `for` variable in the loop header, which collides with
   a hoisted declaration of the same name. Those names keep the hoisted one. */
function forRangeNames(body) {
  const names = new Set();
  const walk = (stmts) => {
    for (const st of stmts || []) {
      if (st.kind === 'ForRange') names.add(st.var);
      if (st.kind === 'If') { walk(st.body); walk(st.orelse); }
      if (st.kind === 'While') walk(st.body);
      if (st.kind === 'ForRange' || st.kind === 'ForEach') walk(st.body);
      if (st.kind === 'Try') { walk(st.body); walk(st.handler); walk(st.finally); }
    }
  };
  walk(body);
  return names;
}

function collectAssigned(body, params) {
  const seen = new Set(params || []);
  const names = [];
  const walk = (stmts) => {
    for (const s of stmts) {
      if (s.kind === 'Assign' && s.target.kind === 'Ident') {
        if (!seen.has(s.target.name)) { seen.add(s.target.name); names.push(s.target.name); }
      }
      if (s.kind === 'If') { walk(s.body); walk(s.orelse); }
      if (s.kind === 'While') walk(s.body);
      if (s.kind === 'ForRange' || s.kind === 'ForEach') walk(s.body);
      // Func bodies are their own scope, so do not descend
    }
  };
  walk(body);
  return names;
}

function defaultValue(t, spec) {
  if (spec.id === 'kotlin') {
    if (isMap(t)) return 'mutableMapOf()';
    if (isList(t)) return 'mutableListOf()';
    if (typeof t === 'string' && (t.indexOf('obj:') === 0 || t === 'unknown')) return 'null';
    if (t === 'string') return '""';
    if (t === 'bool') return 'false';
    if (t === 'double') return '0.0';
    return '0';
  }
  if (isMap(t)) {
    if (spec.dictStyle === 'javamap') return 'new LinkedHashMap<>()';
    if (spec.dictStyle === 'csharp') return 'new ' + typeSurface(t, spec) + '()';
    return 'null';
  }
  if (typeof t === 'string' && t.indexOf('obj:') === 0) return 'null';
  if (t === 'unknown') return 'null';
  if (isList(t)) {
    const el = typeSurface(printedElem(t), spec);
    if (spec.id === 'java') return 'new ArrayList<>()';
    if (spec.id === 'csharp') return 'new List<' + el + '>()';
    return 'null';
  }
  if (t === 'string') return '""';
  if (t === 'bool') return 'false';
  if (t === 'double') return '0.0';
  return '0';
}

function emitTypedDecls(body, depth, spec, out, params) {
  const names = collectAssigned(body, params);
  for (const n of names) {
    const t = TYPES.varType(n, SCOPE);
    if (spec.declStyle === 'kotlin') {
      const objLike = typeof t === 'string' && (t.indexOf('obj:') === 0 || t === 'unknown');
      out.push(pad(depth, spec) + (objLike
        ? 'lateinit var ' + safeName(n, spec) + ': ' + typeSurface(t, spec)
        : 'var ' + safeName(n, spec) + ': ' + typeSurface(t, spec) + ' = ' + defaultValue(t, spec)));
    }
    else if (spec.declStyle === 'go') out.push(pad(depth, spec) + 'var ' + safeName(n, spec) + ' ' + typeSurface(t, spec));
    else out.push(pad(depth, spec) + typeSurface(t, spec) + ' ' + safeName(n, spec) + ' = ' + defaultValue(t, spec) + ';');
  }
}

/* A name first assigned inside an if or a loop would have its declaration trapped
   in that block, so those names (and only those) are declared up front. */
function needsHoisting(body, params) {
  const seen = new Set(params || []);
  const hoist = [];
  const walk = (stmts, nested) => {
    for (const st of stmts) {
      if (st.kind === 'Assign' && st.target.kind === 'Ident' && !seen.has(st.target.name)) {
        seen.add(st.target.name);
        if (nested) hoist.push(st.target.name);
      }
      if (st.kind === 'If') { walk(st.body, true); walk(st.orelse || [], true); }
      if (st.kind === 'While' || st.kind === 'ForRange' || st.kind === 'ForEach') walk(st.body, true);
      if (st.kind === 'Try') { walk(st.body, true); walk(st.handler || [], true); }
    }
  };
  walk(body, false);
  return hoist;
}

function emitBody(body, depth, spec, out, isScopeRoot, params) {
  if (isScopeRoot && (spec.declStyle === 'kotlin' || spec.declStyle === 'prefix')) {
    DECLARED = new Set(params || []);
    if (TYPES) {
      for (const n of needsHoisting(body, params)) {
        const t = TYPES.varType(n, SCOPE);
        DECLARED.add(n);
        // no initialiser, so this reads back as a declaration rather than an assignment
        if (spec.declStyle === 'kotlin') {
          const objLike = typeof t === 'string' && (t.indexOf('obj:') === 0 || t === 'unknown');
          out.push(pad(depth, spec) + (objLike ? 'lateinit var ' : 'var ') + safeName(n, spec) + ': ' + typeSurface(t, spec));
        } else {
          out.push(pad(depth, spec) + typeSurface(t, spec) + ' ' + safeName(n, spec) + ';');
        }
      }
    }
  }
  if (isScopeRoot && spec.declStyle === 'kotlin') {
    for (const n of reassignedParams(body, params)) {
      out.push(pad(depth, spec) + 'var ' + safeName(n, spec) + ' = ' + safeName(n, spec));
    }
  }
  if (isScopeRoot && spec.declStyle === 'go' && TYPES) {
    emitTypedDecls(body, depth, spec, out, params);
  }
  if (spec.hoistDecls && isScopeRoot) {
    const names = collectAssigned(body, params);
    if (names.length) {
      if (spec.typed) {
        for (const n of names) {
          out.push(pad(depth, spec) + spec.declKeyword + ' ' + safeName(n, spec) + ': ' + typeSurface(TYPES.varType(n, SCOPE), spec) + ';');
        }
      } else {
        out.push(pad(depth, spec) + spec.declKeyword + ' ' + names.map(n => safeName(n, spec)).join(', ') + ';');
      }
    }
  }
  for (const s of body) emitStatement(s, depth, spec, out);
}

function emitBlock(body, depth, spec, out) {
  if (spec.blocks === 'indent') {
    for (const s of body) emitStatement(s, depth + 1, spec, out);
  } else {
    for (const s of body) emitStatement(s, depth + 1, spec, out);
  }
}

function header(text, spec) {
  if (spec.blocks === 'indent') return text + ':';
  if (spec.blocks === 'end') return text;
  return text + ' {';
}
function closeBlock(depth, spec, out) {
  if (spec.blocks === 'braces') out.push(pad(depth, spec) + '}');
  else if (spec.blocks === 'end') out.push(pad(depth, spec) + 'end');
}
function cond(e, spec) { return spec.condParens ? '(' + expr(e, spec, 0) + ')' : expr(e, spec, 0); }
function semi(spec) { return (spec.blocks === 'braces' && spec.semis !== false) ? ';' : ''; }
function tOf(node) { return TYPES ? TYPES.typeOf(node, SCOPE) : 'unknown'; }
function vname(n, spec) { return (spec.varPrefix || '') + safeName(n, spec); }

function emitStatement(s, depth, spec, out) {
  const start = out.length;
  emitStatementInner(s, depth, spec, out);
  if (LINEMAP) {
    // inner statements claim their lines first; whatever is left belongs to this one
    for (let i = start; i < out.length; i++) if (LINEMAP[i] === undefined) LINEMAP[i] = s.line || 0;
  }
}

function emitStatementInner(s, depth, spec, out) {
  const ind = pad(depth, spec);
  switch (s.kind) {
    case 'Assign': {
      if (spec.dictLiteral === 'statements' && s.value.kind === 'Dict' && s.target.kind === 'Ident') {
        const nm = vname(s.target.name, spec);
        const first = DECLARED && !DECLARED.has(s.target.name);
        if (first) DECLARED.add(s.target.name);
        const decl = first ? typeSurface(TYPES.varType(s.target.name, SCOPE), spec) + ' ' : '';
        out.push(ind + decl + nm + ' = new LinkedHashMap<>()' + semi(spec));
        for (const [k, v] of s.value.pairs) {
          out.push(ind + nm + '.put(' + expr(k, spec, 0) + ', ' + expr(v, spec, 0) + ')' + semi(spec));
        }
        return;
      }
      const lo = spec.listOps;
      // writing to a map slot needs no null assertion; only reading does
      if (s.target.kind === 'Index' && isMap(tOf(s.target.obj)) && spec.dictStyle === 'kotlin') {
        out.push(ind + expr(s.target.obj, spec, 9) + '[' + expr(s.target.idx, spec, 0) + '] = ' + expr(s.value, spec, 0) + semi(spec));
        return;
      }
      if (s.target.kind === 'Index' && isMap(tOf(s.target.obj)) && spec.dictStyle === 'javamap') {
        out.push(ind + expr(s.target.obj, spec, 9) + '.put(' + expr(s.target.idx, spec, 0) + ', ' + expr(s.value, spec, 0) + ')' + semi(spec));
        return;
      }
      if (s.target.kind === 'Index' && !isMap(tOf(s.target.obj)) && lo && lo.set === 'method') {
        out.push(ind + expr(s.target.obj, spec, 9) + '.' + lo.setName + '(' +
          expr(s.target.idx, spec, 0) + ', ' + expr(s.value, spec, 0) + ')' + semi(spec));
        return;
      }
      if ((spec.declStyle === 'kotlin' || spec.declStyle === 'prefix') && s.target.kind === 'Ident' && DECLARED && !DECLARED.has(s.target.name)) {
        DECLARED.add(s.target.name);
        const t = TYPES ? TYPES.varType(s.target.name, SCOPE) : 'unknown';
        if (spec.declStyle === 'kotlin') {
          out.push(ind + 'var ' + safeName(s.target.name, spec) + ': ' + typeSurface(t, spec) + ' = ' + expr(s.value, spec, 0));
        } else {
          EXPECT_TYPE = t;    // an empty literal has no type of its own; the declaration does
          const rhs = expr(s.value, spec, 0);
          EXPECT_TYPE = null;
          out.push(ind + typeSurface(t, spec) + ' ' + safeName(s.target.name, spec) + ' = ' + rhs + semi(spec));
        }
        return;
      }
      out.push(ind + expr(s.target, spec, 0) + ' = ' + expr(s.value, spec, 0) + semi(spec));
      return;
    }
    case 'ExprStmt': {
      const lo = spec.listOps;
      if (s.expr.kind === 'Method' && s.expr.name === 'append' && lo && lo.append === 'reassign') {
        const o = expr(s.expr.obj, spec, 0);
        out.push(ind + o + ' = append(' + o + ', ' + expr(s.expr.args[0], spec, 0) + ')' + semi(spec));
        return;
      }
      out.push(ind + expr(s.expr, spec, 0) + semi(spec));
      return;
    }
    case 'Return':
      out.push(ind + 'return' + (s.value ? ' ' + expr(s.value, spec, 0) : '') + semi(spec));
      return;
    case 'Break': out.push(ind + 'break' + semi(spec)); return;
    case 'Continue': out.push(ind + 'continue' + semi(spec)); return;
    case 'If': {
      const chained = spec.blocks === 'end';
      // Go insists on "} else {" on one line; the others read better that way too
      const cuddle = spec.blocks === 'braces';
      const more = o => !!(o && o.length);
      out.push(ind + header('if ' + cond(s.cond, spec), spec));
      emitBlock(s.body, depth, spec, out);
      let orelse = s.orelse;
      if (!chained && !(cuddle && more(orelse))) closeBlock(depth, spec, out);
      while (orelse && orelse.length === 1 && orelse[0].kind === 'If') {
        const e = orelse[0];
        const word = spec.blocks === 'indent' ? 'elif ' : (chained ? 'elsif ' : 'else if ');
        out.push(ind + (cuddle ? '} ' : '') + header(word + cond(e.cond, spec), spec));
        emitBlock(e.body, depth, spec, out);
        orelse = e.orelse;
        if (!chained && !(cuddle && more(orelse))) closeBlock(depth, spec, out);
      }
      if (more(orelse)) {
        out.push(ind + (cuddle ? '} ' : '') + header('else', spec));
        emitBlock(orelse, depth, spec, out);
        if (!chained) closeBlock(depth, spec, out);
      }
      if (chained) out.push(ind + 'end');
      return;
    }
    case 'While':
      out.push(ind + header((spec.whileWord || 'while') + ' ' + cond(s.cond, spec), spec));
      emitBlock(s.body, depth, spec, out);
      closeBlock(depth, spec, out);
      return;
    case 'ForRange': {
      let head;
      if (spec.loopStyle === 'until') {
        head = 'for (' + safeName(s.var, spec) + ' in ' + expr(s.start, spec, 0) + ' until ' + expr(s.end, spec, 0) + ')';
      } else if (spec.loopStyle === 'go') {
        head = 'for ' + safeName(s.var, spec) + ' := ' + expr(s.start, spec, 0) + '; ' + safeName(s.var, spec) + ' < ' + expr(s.end, spec, 0) + '; ' + safeName(s.var, spec) + '++';
      } else if (spec.loopStyle === 'typedfor') {
        // if the name already has a hoisted declaration in this scope, reuse it
        const v = safeName(s.var, spec);
        const decl = (DECLARED && DECLARED.has(s.var)) ? '' : 'int ';
        head = 'for (' + decl + v + ' = ' + expr(s.start, spec, 0) + '; ' + v + ' < ' + expr(s.end, spec, 0) + '; ' + v + '++)';
      } else if (spec.loopStyle === 'cstyle' && spec.varPrefix) {
        const v = vname(s.var, spec);
        head = 'for (' + v + ' = ' + expr(s.start, spec, 0) + '; ' + v + ' < ' + expr(s.end, spec, 0) + '; ' + v + '++)';
      } else if (spec.loopStyle === 'dots') {
        head = 'for ' + safeName(s.var, spec) + ' in ' + expr(s.start, spec, 0) + '...' + expr(s.end, spec, 0);
      } else if (spec.loopStyle === 'range') {
        const isZero = s.start.kind === 'Num' && s.start.v === 0;
        const args = isZero ? expr(s.end, spec, 0) : expr(s.start, spec, 0) + ', ' + expr(s.end, spec, 0);
        head = 'for ' + s.var + ' in range(' + args + ')';
      } else {
        head = 'for (' + spec.declKeyword + ' ' + s.var + ' = ' + expr(s.start, spec, 0) +
          '; ' + s.var + ' < ' + expr(s.end, spec, 0) + '; ' + s.var + '++)';
      }
      out.push(ind + header(head, spec));
      emitBlock(s.body, depth, spec, out);
      closeBlock(depth, spec, out);
      return;
    }
    case 'ForEach': {
      let head;
      if (tOf(s.iter) === 'string' && spec.charsOf) {
        const src2 = spec.charsOf.style === 'method'
          ? expr(s.iter, spec, 9) + '.' + spec.charsOf.name
          : spec.charsOf.name + '(' + expr(s.iter, spec, 0) + ')';
        const head2 = spec.id === 'php'
          ? 'foreach (' + src2 + ' as ' + vname(s.var, spec) + ')'
          : 'for ' + safeName(s.var, spec) + ' in ' + src2;
        out.push(ind + header(head2, spec));
        emitBlock(s.body, depth, spec, out);
        closeBlock(depth, spec, out);
        return;
      }
      if (isMap(tOf(s.iter))) {
        const d = expr(s.iter, spec, 9), v2 = safeName(s.var, spec);
        if (spec.id === 'python') head = 'for ' + v2 + ' in ' + d;
        else if (spec.id === 'ruby') head = 'for ' + v2 + ' in ' + d + '.keys';
        else if (spec.dictStyle === 'javamap') head = 'for (' + typeSurface(mapKey(tOf(s.iter)), spec) + ' ' + v2 + ' : ' + d + '.keySet())';
        else if (spec.dictStyle === 'kotlin') head = 'for (' + v2 + ' in ' + d + '.keys)';
        else if (spec.dictStyle === 'csharp') head = 'foreach (' + typeSurface(mapKey(tOf(s.iter)), spec) + ' ' + v2 + ' in ' + d + '.Keys)';
        else if (spec.dictStyle === 'php') head = 'foreach (array_keys(' + d + ') as ' + vname(s.var, spec) + ')';
        else head = 'for (' + spec.declKeyword + ' ' + v2 + ' of Object.keys(' + d + '))';
        out.push(ind + header(head, spec));
        emitBlock(s.body, depth, spec, out);
        closeBlock(depth, spec, out);
        return;
      }
      if (spec.loopStyle === 'go') head = 'for _, ' + safeName(s.var, spec) + ' := range ' + expr(s.iter, spec, 0);
      else if (spec.id === 'java') head = 'for (' + typeSurface(tOf(s.iter) === 'string' ? 'string' : elemOf(tOf(s.iter)), spec) + ' ' + safeName(s.var, spec) + ' : ' + expr(s.iter, spec, 0) + ')';
      else if (spec.id === 'csharp') head = 'foreach (' + typeSurface(tOf(s.iter) === 'string' ? 'string' : elemOf(tOf(s.iter)), spec) + ' ' + safeName(s.var, spec) + ' in ' + expr(s.iter, spec, 0) + ')';
      else if (spec.id === 'kotlin') head = 'for (' + safeName(s.var, spec) + ' in ' + expr(s.iter, spec, 0) + ')';
      else if (spec.id === 'php') head = 'foreach (' + expr(s.iter, spec, 0) + ' as ' + vname(s.var, spec) + ')';
      else if (spec.loopStyle === 'range' || spec.loopStyle === 'dots') head = 'for ' + s.var + ' in ' + expr(s.iter, spec, 0);
      else head = 'for (' + spec.declKeyword + ' ' + s.var + ' of ' + expr(s.iter, spec, 0) + ')';
      out.push(ind + header(head, spec));
      emitBlock(s.body, depth, spec, out);
      closeBlock(depth, spec, out);
      return;
    }
    case 'Try': {
      const er = spec.errors;
      if (!er) throw new LangError(spec.name + ' has no exceptions', s.line || 0,
        spec.id === 'go' ? 'Go returns errors as ordinary values instead, which is a different lesson.' : '');
      if (er.style === 'ruby') {
        out.push(ind + 'begin');
        emitBlock(s.body, depth, spec, out);
        out.push(ind + 'rescue => err');
        emitBlock(s.handler, depth, spec, out);
        out.push(ind + 'end');
      } else if (er.style === 'python') {
        out.push(ind + 'try:');
        emitBlock(s.body, depth, spec, out);
        out.push(ind + 'except Exception as err:');
        emitBlock(s.handler, depth, spec, out);
      } else {
        out.push(ind + 'try {');
        emitBlock(s.body, depth, spec, out);
        const decl = er.style === 'typed'
          ? '} catch (' + er.errType + ' ' + (spec.varPrefix || '') + 'err) {'
          : '} catch (err' + (er.catchAnnot || '') + ') {';
        out.push(ind + decl);
        emitBlock(s.handler, depth, spec, out);
        out.push(ind + '}');
      }
      return;
    }
    case 'Throw': {
      const er = spec.errors;
      if (!er) throw new LangError(spec.name + ' has no exceptions', s.line || 0, '');
      const m = expr(s.msg, spec, 0);
      const body = er.throwWrap === 'bare' ? m : er.throwWrap + '(' + m + ')';
      out.push(ind + (er.style === 'python' || er.style === 'ruby' ? 'raise ' : 'throw ') + body + semi(spec));
      return;
    }
    case 'Class': emitClass(s, depth, spec, out); return;
    case 'Func': {
      let head;
      const fname = safeName(s.name, spec);
      const sp = pn => safeName(pn, spec);
      if (spec.typed && spec.declStyle === 'prefix') {
        const f = TYPES.funcs.get(s.name);
        const ps = s.params.map((pn, i) => typeSurface(f ? f.params[i] : 'unknown', spec) + ' ' + sp(pn)).join(', ');
        head = 'static ' + typeSurface(f ? f.ret : 'void', spec) + ' ' + fname + '(' + ps + ')';
      } else if (spec.typed && spec.declStyle === 'kotlin') {
        const f = TYPES.funcs.get(s.name);
        const ps = s.params.map((pn, i) => sp(pn) + ': ' + typeSurface(f ? f.params[i] : 'unknown', spec)).join(', ');
        const ret = f && f.ret !== 'void' ? ': ' + typeSurface(f.ret, spec) : '';
        head = 'fun ' + fname + '(' + ps + ')' + ret;
      } else if (spec.typed && spec.declStyle === 'go') {
        const f = TYPES.funcs.get(s.name);
        const ps = s.params.map((pn, i) => sp(pn) + ' ' + typeSurface(f ? f.params[i] : 'unknown', spec)).join(', ');
        const ret = f && f.ret !== 'void' ? ' ' + typeSurface(f.ret, spec) : '';
        head = 'func ' + fname + '(' + ps + ')' + ret;
      } else if (spec.varPrefix) {
        head = spec.funcKeyword + ' ' + fname + '(' + s.params.map(pn => vname(pn, spec)).join(', ') + ')';
      } else if (spec.typed) {
        const f = TYPES.funcs.get(s.name);
        const ps = s.params.map((pn, i) => sp(pn) + ': ' + typeSurface(f ? f.params[i] : 'unknown', spec)).join(', ');
        head = spec.funcKeyword + ' ' + fname + '(' + ps + '): ' + typeSurface(f ? f.ret : 'void', spec);
      } else {
        head = spec.funcKeyword + ' ' + fname + '(' + s.params.map(sp).join(', ') + ')';
      }
      out.push(ind + header(head, spec));
      const outerScope = SCOPE;
      SCOPE = s.name;
      const inner = [];
      const savedDecl = DECLARED;
      emitBody(s.body, depth + 1, spec, inner, true, s.params);
      DECLARED = savedDecl;
      SCOPE = outerScope;
      for (const l of inner) out.push(l);
      closeBlock(depth, spec, out);
      return;
    }
    default:
      throw new LangError('Cannot print node kind ' + s.kind, s.line || 0, '');
  }
}

function classFieldNames(node) {
  const names = [];
  const seen = new Set();
  const scan = (body) => {
    for (const st of body || []) {
      if (st.kind === 'Assign' && st.target.kind === 'Attr' && st.target.obj.kind === 'Self' && !seen.has(st.target.name)) {
        seen.add(st.target.name); names.push(st.target.name);
      }
      if (st.body) scan(st.body);
      if (st.orelse) scan(st.orelse);
    }
  };
  if (node.ctor) scan(node.ctor.body);
  for (const m of node.methods) scan(m.body);
  return names;
}

function emitKotlinClass(s, depth, spec, out) {
  const ind = pad(depth, spec);
  const inner = depth + 1;
  const info = TYPES ? TYPES.classes.get(s.name) : null;
  const fields = classFieldNames(s);
  const isParent = CLASS_NODES && [...CLASS_NODES.values()].some(c => c.parent === s.name);

  // the nearest constructor above, since Kotlin does not inherit constructors either
  let up = s.parent && CLASS_NODES ? CLASS_NODES.get(s.parent) : null;
  while (up && !up.ctor) up = up.parent ? CLASS_NODES.get(up.parent) : null;

  const ctorParams = s.ctor ? s.ctor.params : (up ? up.ctor.params : []);
  const ctorInfo = s.ctor ? info : (up && TYPES ? TYPES.classes.get(up.name) : null);
  const paramList = ctorParams.map((pn, i) =>
    safeName(pn, spec) + ': ' + typeSurface(ctorInfo ? ctorInfo.ctorParams[i] : 'unknown', spec)).join(', ');

  let body = s.ctor ? s.ctor.body : [];
  let baseArgs = null;
  if (body.length && body[0].kind === 'ExprStmt' && body[0].expr.kind === 'SuperInit') {
    baseArgs = body[0].expr.args.map(a => expr(a, spec, 0)).join(', ');
    body = body.slice(1);
  } else if (!s.ctor && up) {
    baseArgs = up.ctor.params.map(pn => safeName(pn, spec)).join(', ');
  }

  let head = (isParent ? 'open ' : '') + 'class ' + safeName(s.name, spec);
  if (ctorParams.length) head += '(' + paramList + ')';
  if (s.parent) head += ' : ' + safeName(s.parent, spec) + '(' + (baseArgs || '') + ')';
  out.push(ind + head + ' {');

  const outerScope = SCOPE;
  for (const f of fields) {
    out.push(pad(inner, spec) + 'var ' + safeName(f, spec) + ': ' +
      typeSurface(info.fields.get(f), spec) + ' = ' + defaultValue(info.fields.get(f), spec));
  }
  if (body.length) {
    SCOPE = 'class:' + s.name + ':new';
    DECLARED = new Set(ctorParams);
    out.push(pad(inner, spec) + 'init {');
    for (const st of body) emitStatement(st, inner + 1, spec, out);
    out.push(pad(inner, spec) + '}');
    SCOPE = outerScope;
  }
  for (const m of s.methods) {
    SCOPE = 'class:' + s.name + ':' + m.name;
    const sig = info ? info.methods.get(m.name) : null;
    let mod = '';
    if (TYPES.overrides(s.name, m.name)) mod = 'override ';
    else if (TYPES.overridden(s.name, m.name)) mod = 'open ';
    const ps = m.params.map((pn, i) => safeName(pn, spec) + ': ' + typeSurface(sig.params[i], spec)).join(', ');
    const ret = sig && sig.ret !== 'void' ? ': ' + typeSurface(sig.ret, spec) : '';
    out.push(pad(inner, spec) + mod + 'fun ' + safeName(m.name, spec) + '(' + ps + ')' + ret + ' {');
    DECLARED = new Set(m.params);
    for (const st of m.body) emitStatement(st, inner + 1, spec, out);
    out.push(pad(inner, spec) + '}');
    SCOPE = outerScope;
  }
  out.push(ind + '}');
}

function emitClass(s, depth, spec, out) {
  if (spec.kotlinClass) return emitKotlinClass(s, depth, spec, out);
  if (!spec.classes) {
    throw new LangError(spec.name + ' has no classes or inheritance', s.line || 0,
      spec.id === 'go' ? 'Go leaves inheritance out on purpose. Read this lesson in another language.' : '');
  }
  const ind = pad(depth, spec);
  const cname = safeName(s.name, spec);
  const pname = s.parent ? safeName(s.parent, spec) : null;
  let head = 'class ' + cname;
  if (pname) {
    if (spec.parentStyle === 'parens') head += '(' + pname + ')';
    else if (spec.parentStyle === 'lt') head += ' < ' + pname;
    else if (spec.parentStyle === 'colon') head += ' : ' + pname;
    else head += ' extends ' + pname;
  }
  out.push(ind + header(head, spec));
  const inner = depth + 1;
  const fields = classFieldNames(s);

  if (spec.attrReader && fields.length) out.push(pad(inner, spec) + 'attr_reader ' + fields.map(f => ':' + f).join(', '));
  if (spec.typed && spec.declStyle === 'prefix' && TYPES) {
    const info = TYPES.classes.get(s.name);
    for (const f of fields) out.push(pad(inner, spec) + (spec.fieldModifier || '') + typeSurface(info.fields.get(f), spec) + ' ' + safeName(f, spec) + ';');
  } else if (spec.typed && spec.annot && TYPES) {
    const info = TYPES.classes.get(s.name);
    for (const f of fields) out.push(pad(inner, spec) + safeName(f, spec) + ': ' + typeSurface(info.fields.get(f), spec) + ';');
  } else if (spec.fieldModifier && spec.varPrefix) {
    for (const f of fields) out.push(pad(inner, spec) + spec.fieldModifier + spec.varPrefix + safeName(f, spec) + ';');
  }

  const outerScope = SCOPE;
  const info = TYPES ? TYPES.classes.get(s.name) : null;

  // the nearest constructor above this class, if any
  const inheritedCtor = (() => {
    let node = s.parent && CLASS_NODES ? CLASS_NODES.get(s.parent) : null;
    while (node) { if (node.ctor) return node; node = node.parent ? CLASS_NODES.get(node.parent) : null; }
    return null;
  })();

  // Java and C# do not inherit constructors: a child with none needs one that forwards
  if (!s.ctor && inheritedCtor && spec.needsForwardingCtor) {
    const pinfo = TYPES ? TYPES.classes.get(inheritedCtor.name) : null;
    const ps = inheritedCtor.ctor.params.map((pn, i) =>
      typeSurface(pinfo ? pinfo.ctorParams[i] : 'unknown', spec) + ' ' + safeName(pn, spec)).join(', ');
    const call = inheritedCtor.ctor.params.map(pn => safeName(pn, spec)).join(', ');
    if (spec.baseInHeader) {
      out.push(pad(inner, spec) + header((spec.memberModifier || '') + cname + '(' + ps + ') : base(' + call + ')', spec));
      out.push(pad(inner, spec) + '}');
    } else {
      out.push(pad(inner, spec) + header((spec.memberModifier || '') + cname + '(' + ps + ')', spec));
      out.push(pad(inner + 1, spec) + 'super(' + call + ');');
      out.push(pad(inner, spec) + '}');
    }
  }

  if (s.ctor) {
    SCOPE = 'class:' + s.name + ':new';
    let body = s.ctor.body;
    let headText;
    if (spec.ctorName === 'ctor') {
      const ps = s.ctor.params.map((pn, i) => (spec.typed ? typeSurface(info.ctorParams[i], spec) + ' ' : '') + safeName(pn, spec)).join(', ');
      let baseSuffix = '';
      if (spec.baseInHeader && body.length && body[0].kind === 'ExprStmt' && body[0].expr.kind === 'SuperInit') {
        baseSuffix = ' : base(' + body[0].expr.args.map(a => expr(a, spec, 0)).join(', ') + ')';
        body = body.slice(1);
      }
      headText = (spec.memberModifier || '') + cname + '(' + ps + ')' + baseSuffix;
    } else if (spec.varPrefix) {
      headText = 'function ' + spec.ctorName + '(' + s.ctor.params.map(pn => vname(pn, spec)).join(', ') + ')';
    } else if (spec.typed && spec.annot) {
      headText = spec.ctorName + '(' + s.ctor.params.map((pn, i) => pn + ': ' + typeSurface(info.ctorParams[i], spec)).join(', ') + ')';
    } else if (spec.methodKeyword) {
      const ps = (spec.explicitSelfParam ? ['self'] : []).concat(s.ctor.params);
      headText = 'def ' + spec.ctorName + '(' + ps.join(', ') + ')';
    } else {
      headText = spec.ctorName + '(' + s.ctor.params.join(', ') + ')';
    }
    DECLARED = new Set(s.ctor.params);
    out.push(pad(inner, spec) + header(headText, spec));
    // JavaScript and TypeScript refuse a derived constructor that never calls super()
    const callsSuper = body.length && body[0].kind === 'ExprStmt' && body[0].expr.kind === 'SuperInit';
    // A parent with no constructor still needs an explicit super() here. If the parent
    // does have one and the author skipped it, the program is genuinely broken in this
    // language too, so leave it broken rather than papering over the bug.
    if (spec.needsExplicitSuper && s.parent && !callsSuper && !inheritedCtor) {
      out.push(pad(inner + 1, spec) + 'super();');
    }
    for (const st of body) emitStatement(st, inner + 1, spec, out);
    if (spec.blocks === 'braces') out.push(pad(inner, spec) + '}');
    else if (spec.blocks === 'end') out.push(pad(inner, spec) + 'end');
    SCOPE = outerScope;
  }

  for (const m of s.methods) {
    SCOPE = 'class:' + s.name + ':' + m.name;
    const sig = info ? info.methods.get(m.name) : null;
    let headText;
    if (spec.declStyle === 'prefix' && spec.typed) {
      const ps = m.params.map((pn, i) => typeSurface(sig.params[i], spec) + ' ' + safeName(pn, spec)).join(', ');
      let virt = '';
      if (spec.needsVirtual && TYPES) {
        if (TYPES.overrides(s.name, m.name)) virt = 'override ';
        else if (TYPES.overridden(s.name, m.name)) virt = 'virtual ';
      }
      headText = (spec.memberModifier || '') + virt + typeSurface(sig.ret, spec) + ' ' + safeName(m.name, spec) + '(' + ps + ')';
    } else if (spec.typed && spec.annot) {
      const ps = m.params.map((pn, i) => pn + ': ' + typeSurface(sig.params[i], spec)).join(', ');
      headText = m.name + '(' + ps + '): ' + typeSurface(sig.ret, spec);
    } else if (spec.varPrefix) {
      headText = 'function ' + safeName(m.name, spec) + '(' + m.params.map(pn => vname(pn, spec)).join(', ') + ')';
    } else if (spec.methodKeyword) {
      const ps = (spec.explicitSelfParam ? ['self'] : []).concat(m.params);
      headText = 'def ' + m.name + '(' + ps.join(', ') + ')';
    } else {
      headText = m.name + '(' + m.params.join(', ') + ')';
    }
    DECLARED = new Set(m.params);
    out.push(pad(inner, spec) + header(headText, spec));
    for (const st of m.body) emitStatement(st, inner + 1, spec, out);
    if (spec.blocks === 'braces') out.push(pad(inner, spec) + '}');
    else if (spec.blocks === 'end') out.push(pad(inner, spec) + 'end');
    SCOPE = outerScope;
  }
  closeBlock(depth, spec, out);
}

function surfaceWord(canon, spec) {
  for (const [surface, c] of Object.entries(spec.words)) if (c === canon) return surface;
  return canon;
}

function opSurface(op, spec) {
  for (const [surface, c] of Object.entries(spec.ops)) if (c === op && surface !== c) return surface;
  if (op === 'and') return spec.id === 'javascript' ? '&&' : 'and';
  if (op === 'or') return spec.id === 'javascript' ? '||' : 'or';
  return op;
}

function expr(e, spec, minPrec) {
  switch (e.kind) {
    case 'Num': return String(e.v);
    case 'Str': return '"' + e.v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
    case 'Bool': return e.v ? spec.literals.true : spec.literals.false;
    case 'Null': return spec.literals.null;
    case 'Ident': return vname(e.name, spec);
    case 'Dict': {
      if (!spec.dicts) throw new LangError(spec.name + ' has no dictionary literal', 0,
        spec.id === 'go' ? 'Go has maps, but it looks them up and walks them differently enough that this lesson is better read elsewhere.' : '');
      if (spec.dictLiteral === 'statements') throw new LangError('Java has no dictionary literal', 0,
        'You create the map first, then put entries in one at a time.');
      const sep = spec.dictSep === '=>' ? ' => ' : ': ';
      const body = e.pairs.map(([k, v]) => expr(k, spec, 0) + sep + expr(v, spec, 0)).join(', ');
      if (spec.dictStyle === 'kotlin') return 'mutableMapOf(' + e.pairs.map(([k, v]) => expr(k, spec, 0) + ' to ' + expr(v, spec, 0)).join(', ') + ')';
      if (spec.dictStyle === 'csharp') {
        const own = tOf(e);
        const useT = (isMap(own) && own.indexOf('unknown') < 0) ? own : (EXPECT_TYPE || own);
        if (!e.pairs.length) return 'new ' + typeSurface(useT, spec) + '()';
        // a value that is itself an empty literal takes its type from the map,
        // the same way a declaration passes one down
        const valT = isMap(useT) ? useT.slice(useT.indexOf('>') + 1) : null;
        const saved = EXPECT_TYPE;
        const pairs = e.pairs.map(([k, v]) => {
          const kt = expr(k, spec, 0);
          if (valT) EXPECT_TYPE = valT;
          const vt = expr(v, spec, 0);
          EXPECT_TYPE = saved;
          return '{ ' + kt + ', ' + vt + ' }';
        });
        return 'new ' + typeSurface(useT, spec) + ' { ' + pairs.join(', ') + ' }';
      }
      // PHP uses one type for both, so an empty map is written array() to stay readable back
      if (spec.dictStyle === 'php') return e.pairs.length ? '[' + body + ']' : 'array()';
      return '{' + body + '}';
    }
    case 'StrUpper': case 'StrLower': case 'StrTrim': case 'StrStarts': case 'StrHas': {
      const canon = e.kind.slice(3).toLowerCase();
      const nm = (spec.strMethods || {})[canon];
      if (!nm) throw new LangError(spec.name + ' spells this text helper differently', 0, '');
      const args = (e.args || []).map(a => expr(a, spec, 0));
      if (spec.varPrefix) return nm + '(' + [expr(e.obj, spec, 0)].concat(args).join(', ') + ')';
      return expr(e.obj, spec, 9) + '.' + nm + '(' + args.join(', ') + ')';
    }
    case 'List': {
      const items = e.items.map(x => expr(x, spec, 0)).join(', ');
      // an empty literal has no element type of its own; the declaration does,
      // the same way Dict literals already read EXPECT_TYPE
      const own = tOf(e);
      const useT = (!e.items.length && elemOf(own) === T_UNK && isList(EXPECT_TYPE)) ? EXPECT_TYPE : own;
      const el = typeSurface(printedElem(useT), spec);
      const lit = spec.listOps && spec.listOps.literal;
      if (lit === 'kotlin') return 'mutableListOf(' + items + ')';
      if (lit === 'javalist') return e.items.length ? 'new ArrayList<>(List.of(' + items + '))' : 'new ArrayList<>()';
      if (lit === 'brace') return 'new List<' + el + '> { ' + items + ' }';
      if (spec.id === 'go') return '[]' + el + '{' + items + '}';
      return '[' + items + ']';
    }
    case 'Index': {
      const lo = spec.listOps;
      const onMap = isMap(tOf(e.obj));
      if (onMap && spec.dictStyle === 'javamap') return expr(e.obj, spec, 9) + '.get(' + expr(e.idx, spec, 0) + ')';
      if (onMap && spec.dictStyle === 'kotlin') return expr(e.obj, spec, 9) + '[' + expr(e.idx, spec, 0) + ']!!';
      if (!onMap && lo && lo.get === 'method') return expr(e.obj, spec, 9) + '.' + lo.getName + '(' + expr(e.idx, spec, 0) + ')';
      return expr(e.obj, spec, 9) + '[' + expr(e.idx, spec, 0) + ']';
    }
    case 'Un': {
      if (e.op === 'not') {
        const s = spec.notPrec >= 7 ? '!' + expr(e.x, spec, 7) : 'not ' + expr(e.x, spec, spec.notPrec);
        return minPrec > 3 ? '(' + s + ')' : s;
      }
      // "-x ** y" means -(x ** y); wrap so it can never re-parse as (-x) ** y
      const s = '-' + expr(e.x, spec, 9);
      return minPrec >= 8 ? '(' + s + ')' : s;
    }
    case 'Bin': {
      if (spec.strEq && (e.op === '==' || e.op === '!=') &&
          (tOf(e.l) === T_STR || tOf(e.r) === T_STR)) {
        const call = expr(e.l, spec, 9) + '.' + spec.strEq + '(' + expr(e.r, spec, 0) + ')';
        const s2 = e.op === '!=' ? '!' + call : call;
        return minPrec > 3 && e.op === '!=' ? '(' + s2 + ')' : s2;
      }
      const p = P_PREC[e.op];
      if (e.op === '/' && spec.floatDivision === false) {
        // these languages truncate when both sides are whole numbers
        let s2;
        if (spec.castStyle === 'suffix') s2 = expr(e.l, spec, 9) + spec.castFloat + ' / ' + expr(e.r, spec, p + 1);
        else if (spec.castStyle === 'call') s2 = spec.castFloat + '(' + expr(e.l, spec, 0) + ') / ' + spec.castFloat + '(' + expr(e.r, spec, 0) + ')';
        else if (spec.castStyle === 'prefix') s2 = spec.castFloat + expr(e.l, spec, 9) + ' / ' + expr(e.r, spec, p + 1);
        else s2 = expr(e.l, spec, 9) + '.to_f / ' + expr(e.r, spec, p + 1);
        return p < minPrec ? '(' + s2 + ')' : s2;
      }
      if (e.op === 'idiv') {
        const style = spec.intDiv;
        const l = expr(e.l, spec, 6), r = expr(e.r, spec, 7);
        let out2;
        if (style === '//') out2 = l + ' // ' + r;
        else if (style === 'mathfloor') out2 = 'Math.floor(' + expr(e.l, spec, 6) + ' / ' + expr(e.r, spec, 7) + ')';
        else if (style === 'div') out2 = expr(e.l, spec, 9) + '.div(' + expr(e.r, spec, 0) + ')';
        else if (style === 'intdiv') out2 = 'intdiv(' + expr(e.l, spec, 0) + ', ' + expr(e.r, spec, 0) + ')';
        else out2 = l + ' / ' + r;
        return 6 < minPrec ? '(' + out2 + ')' : out2;
      }
      if (e.op === 'in') {
        const container = tOf(e.r);
        const k = expr(e.l, spec, 0), d = expr(e.r, spec, 9);
        if (isMap(container)) {
          if (spec.id === 'ruby') return d + '.key?(' + k + ')';
          if (spec.dictStyle === 'javamap') return d + '.containsKey(' + k + ')';
          if (spec.dictStyle === 'kotlin') return d + '.containsKey(' + k + ')';
          if (spec.dictStyle === 'csharp') return d + '.ContainsKey(' + k + ')';
          if (spec.dictStyle === 'php') return 'array_key_exists(' + k + ', ' + d + ')';
          if (spec.id === 'python') return k + ' in ' + d;
          return k + ' in ' + d;
        }
        const hasName = (spec.strMethods || {}).has;
        if (spec.id === 'python') return k + ' in ' + d;
        if (spec.varPrefix && hasName) return hasName + '(' + d + ', ' + k + ')';
        if (hasName) return d + '.' + hasName + '(' + k + ')';
        throw new LangError(spec.name + ' has no simple membership test here', 0, '');
      }
      if (e.op === '+' && spec.concatOp && (tOf(e.l) === 'string' || tOf(e.r) === 'string')) {
        const s3 = expr(e.l, spec, p) + ' ' + spec.concatOp + ' ' + expr(e.r, spec, p + 1);
        return p < minPrec ? '(' + s3 + ')' : s3;
      }
      const s = expr(e.l, spec, p) + ' ' + opSurface(e.op, spec) + ' ' + expr(e.r, spec, p + 1);
      return p < minPrec ? '(' + s + ')' : s;
    }
    case 'ErrMessage': {
      const er = spec.errors || { errMsg: 'bare' };
      const v = (spec.varPrefix || '') + 'err';
      return er.errMsg === 'bare' ? v : v + er.errMsg;
    }
    case 'Self': return spec.selfSurface || 'self';
    case 'New': {
      const args = e.args.map(a => expr(a, spec, 0)).join(', ');
      const cn = safeName(e.name, spec);
      if (spec.newStyle === 'dotnew') return cn + '.new(' + args + ')';
      if (spec.newStyle === 'new') return 'new ' + cn + '(' + args + ')';
      return cn + '(' + args + ')';
    }
    case 'Attr': {
      if (spec.ivarSigil && e.obj.kind === 'Self') return spec.ivarSigil + e.name;
      return receiver(e.obj, spec) + (spec.memberOp || '.') + safeName(e.name, spec);
    }
    case 'Invoke':
      return receiver(e.obj, spec) + (spec.memberOp || '.') + safeName(e.name, spec) +
        '(' + e.args.map(a => expr(a, spec, 0)).join(', ') + ')';
    case 'SuperInit': {
      const args = e.args.map(a => expr(a, spec, 0)).join(', ');
      if (spec.superStyle === 'python') return 'super().__init__(' + args + ')';
      if (spec.phpParentInit) return 'parent::__construct(' + args + ')';
      return 'super(' + args + ')';
    }
    case 'SuperCall': {
      const args = e.args.map(a => expr(a, spec, 0)).join(', ');
      if (spec.superStyle === 'python') return 'super().' + e.name + '(' + args + ')';
      if (spec.superStyle === 'ruby') return 'super(' + args + ')';
      if (spec.phpParentInit) return 'parent::' + e.name + '(' + args + ')';
      return 'super.' + e.name + '(' + args + ')';
    }
    case 'Method': {
      const lo = spec.listOps;
      const args = e.args.map(a => expr(a, spec, 0)).join(', ');
      if (lo && lo.append === 'call') return lo.appendName + '(' + expr(e.obj, spec, 0) + ', ' + args + ')';
      if (lo && lo.append === 'reassign') return 'append(' + expr(e.obj, spec, 0) + ', ' + args + ')';
      const nm = (lo && lo.appendName) || spec.append;
      return expr(e.obj, spec, 9) + '.' + nm + '(' + args + ')';
    }
    case 'Call': {
      if (e.name === 'print') {
        if (spec.printStyle === 'join') {
          const parts = e.args.map(a => expr(a, spec, 6));
          const joined = parts.length === 1 ? parts[0] : parts.join(' ' + spec.joinOp + ' " " ' + spec.joinOp + ' ');
          return spec.print.obj + '.' + spec.print.name + '(' + joined + ')';
        }
        if (spec.printStyle === 'echo') {
          // echo prints 1 and nothing for true and false, so say the words instead
          const parts = e.args.map(a => spec.boolEcho && tOf(a) === 'bool'
            ? '(' + expr(a, spec, 0) + ' ? "true" : "false")'
            : expr(a, spec, 0));
          return 'echo ' + parts.join(', ", ", ').replace(/, ", ", /g, ', " ", ') + ', "\\n"';
        }
        if (spec.interp && e.args.length > 1) {
          const open = spec.interpOpen || '#{';
          const body = e.args.map(a => a.kind === 'Str'
            ? a.v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
            : open + expr(a, spec, 0) + '}').join(' ');
          const call = spec.print.name + ' "' + body + '"';
          return spec.parenlessPrint ? call : spec.print.name + '("' + body + '")';
        }
        const inner = e.args.map(a => expr(a, spec, 0)).join(', ');
        return spec.print.style === 'member' ? spec.print.obj + '.' + spec.print.name + '(' + inner + ')' : spec.print.name + '(' + inner + ')';
      }
      if (e.name === 'sorted') {
        const sc = spec.sortCall;
        if (!sc) throw new LangError(spec.name + ' sorts differently', 0, 'This lesson runs in another language for now.');
        if (sc.style === 'method') return expr(e.args[0], spec, 9) + '.' + sc.name + '()' + (sc.suffix || '');
        if (sc.style === 'wrap') return sc.name + '(' + expr(e.args[0], spec, 0) + ')';
        return sc.name + '(' + expr(e.args[0], spec, 0) + ')';
      }
      if (e.name === 'input') {
        if (spec.inputExpr) return spec.inputExpr;
        if (!spec.inputCall) throw new LangError(spec.name + ' reads input differently', 0,
          'Reading typed-in answers works in Python, JavaScript, TypeScript, Ruby, Java, Kotlin and C#.');
        return spec.inputCall + '()' + (spec.inputSuffix || '');
      }
      if (e.name === 'str') {
        const a = e.args[0];
        const ts = spec.toStr || { style: 'call', name: 'str' };
        if (ts.style === 'method') return expr(a, spec, 9) + '.' + ts.name + (ts.parens ? '()' : '');
        return ts.name + '(' + expr(a, spec, 0) + ')';
      }
      if (e.name === 'len') {
        const a = e.args[0];
        const lo = spec.listOps;
        if (isMap(tOf(a))) {
          if (spec.dictStyle === 'javamap') return expr(a, spec, 9) + '.size()';
          if (spec.dictStyle === 'csharp') return expr(a, spec, 9) + '.Count';
          if (spec.dictStyle === 'kotlin') return expr(a, spec, 9) + '.size';
          if (spec.dictStyle === 'php') return 'count(' + expr(a, spec, 0) + ')';
          if (spec.id === 'ruby') return expr(a, spec, 9) + '.length';
          if (spec.id === 'python') return 'len(' + expr(a, spec, 0) + ')';
          return 'Object.keys(' + expr(a, spec, 0) + ').length';
        }
        if (lo && tOf(a) === 'string') {
          if (spec.id === 'java') return expr(a, spec, 9) + '.length()';
          if (spec.id === 'csharp') return expr(a, spec, 9) + '.Length';
          if (spec.id === 'php') return 'strlen(' + expr(a, spec, 0) + ')';
          if (lo.strLen && lo.strLen !== lo.lenName) return expr(a, spec, 9) + '.' + lo.strLen;
        }
        if (lo && lo.len === 'method') return expr(a, spec, 9) + '.' + lo.lenName + '()';
        return spec.len.style === 'property'
          ? expr(a, spec, 9) + '.' + spec.len.name
          : spec.len.name + '(' + expr(a, spec, 0) + ')';
      }
      if (spec.mathCalls[e.name]) {
        return spec.mathCalls[e.name] + '(' + e.args.map(a => expr(a, spec, 0)).join(', ') + ')';
      }
      return safeName(e.name, spec) + '(' + e.args.map(a => expr(a, spec, 0)).join(', ') + ')';
    }
    default: throw new LangError('Cannot print expression kind ' + e.kind, 0, '');
  }
}

/* ---------- 6. EVALUATOR (trace-recording) ---------- */

function fmt(v, langId) {
  const spec = SPECS[langId] || JAVASCRIPT;
  if (v instanceof Map) return '{' + [...v.entries()].map(([k, x]) => fmtInner(k, langId) + ': ' + fmtInner(x, langId)).join(', ') + '}';
  if (v && typeof v === 'object' && v.__obj) return 'a ' + v.cls;
  if (v === null || v === undefined) return spec.literals.null;
  if (typeof v === 'boolean') return v ? spec.literals.true : spec.literals.false;
  if (typeof v === 'number') {
    if (Number.isInteger(v)) return String(v);
    return String(Math.round(v * 1e10) / 1e10);
  }
  if (Array.isArray(v)) return '[' + v.map(x => fmtInner(x, langId)).join(', ') + ']';
  return String(v);
}
function fmtInner(v, langId) {
  if (typeof v === 'string') return '"' + v + '"';
  return fmt(v, langId);
}

class ReturnSignal { constructor(v) { this.v = v; } }
class BreakSignal { }
class ContinueSignal { }

function run(ast, options = {}) {
  const lang = options.lang || 'python';
  const maxSteps = options.maxSteps || 200000;
  const maxTrace = options.maxTrace || 4000;

  const output = [];
  const trace = [];
  const inputQueue = (options.inputs || []).slice();
  const funcs = new Map();
  const classes = new Map();
  let steps = 0;
  let error = null;

  const globalFrame = { name: 'main', vars: new Map(), self: null, defining: null };
  const stack = [globalFrame];

  const copyVal = (v) => v instanceof Map ? new Map(v) : (Array.isArray(v) ? v.slice() : v);
  const snapshotVars = (frame) => {
    const o = {};
    for (const [k, v] of frame.vars) o[k] = copyVal(v);
    if (frame.self) for (const [k, v] of frame.self.fields) o['self.' + k] = copyVal(v);
    return o;
  };

  const record = (node, note) => {
    steps++;
    if (steps > maxSteps) {
      const tooLong = new LangError('This program ran too long and was stopped', node.line || 0,
        'It probably has a loop that never ends. Check the loop condition.');
      tooLong.fatal = true;
      throw tooLong;
    }
    if (trace.length < maxTrace) {
      trace.push({
        line: node.line || 0,
        note: note || '',
        depth: stack.length,
        frame: stack[stack.length - 1].name,
        vars: snapshotVars(stack[stack.length - 1]),
        globals: stack.length > 1 ? snapshotVars(globalFrame) : null,
        outputLen: output.length
      });
    }
  };

  const lookup = (name, line) => {
    const top = stack[stack.length - 1];
    if (top.vars.has(name)) return top.vars.get(name);
    if (globalFrame.vars.has(name)) return globalFrame.vars.get(name);
    throw new LangError('"' + name + '" has no value yet (line ' + line + ')', line,
      'Give it a value before using it, and check the spelling.');
  };

  const setVar = (name, value) => { stack[stack.length - 1].vars.set(name, value); };

  const truthy = (v, line) => {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') return v.length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return false;
  };

  const isObj = (v) => !!(v && typeof v === 'object' && v.__obj);
  const classOf = (name, line) => {
    const c = classes.get(name);
    if (!c) throw new LangError('There is no class called "' + name + '" (line ' + line + ')', line,
      'Define the class before creating one, and check the spelling.');
    return c;
  };
  const findMethod = (clsName, method) => {
    let c = classes.get(clsName);
    while (c) {
      if (c.methods.has(method)) return { m: c.methods.get(method), owner: c };
      c = c.parent ? classes.get(c.parent) : null;
    }
    return null;
  };
  const findCtor = (clsName) => {
    let c = classes.get(clsName);
    while (c) { if (c.ctor) return { ctor: c.ctor, owner: c }; c = c.parent ? classes.get(c.parent) : null; }
    return null;
  };

  const isDict = (v) => v instanceof Map;
  const typeName = (v) => isObj(v) ? ('a ' + v.cls) : isDict(v) ? 'a dictionary' : Array.isArray(v) ? 'a list' : v === null ? 'nothing' :
    typeof v === 'string' ? 'text' : typeof v === 'number' ? 'a number' : 'a true/false value';

  function evalExpr(e, line) {
    switch (e.kind) {
      case 'Num': return e.v;
      case 'Str': return e.v;
      case 'Bool': return e.v;
      case 'Null': return null;
      case 'Ident': return lookup(e.name, line);
      case 'List': return e.items.map(x => evalExpr(x, line));
      case 'Dict': {
        const m = new Map();
        for (const [k, v] of e.pairs) {
          const key = evalExpr(k, line);
          if (typeof key !== 'string' && typeof key !== 'number') {
            throw new LangError('A dictionary key must be text or a number (line ' + line + ')', line, '');
          }
          m.set(key, evalExpr(v, line));
        }
        return m;
      }
      case 'StrUpper': { const v = evalExpr(e.obj, line); reqText(v, 'upper', line); return v.toUpperCase(); }
      case 'StrLower': { const v = evalExpr(e.obj, line); reqText(v, 'lower', line); return v.toLowerCase(); }
      case 'StrTrim': { const v = evalExpr(e.obj, line); reqText(v, 'trim', line); return v.trim(); }
      case 'StrStarts': { const v = evalExpr(e.obj, line); reqText(v, 'starts with', line); return v.startsWith(String(evalExpr(e.args[0], line))); }
      case 'StrHas': {
        const v = evalExpr(e.obj, line);
        const needle = evalExpr(e.args[0], line);
        if (Array.isArray(v)) return v.some(x => eq(x, needle));
        reqText(v, 'contains', line);
        return v.indexOf(String(needle)) >= 0;
      }
      case 'Index': {
        const obj = evalExpr(e.obj, line);
        const idx = evalExpr(e.idx, line);
        if (isDict(obj)) {
          if (!obj.has(idx)) {
            throw new LangError('This dictionary has no key ' + fmt(idx, lang) + ' (line ' + line + ')', line,
              'It holds: ' + (obj.size ? [...obj.keys()].map(k => fmt(k, lang)).join(', ') : 'nothing yet') + '.');
          }
          return obj.get(idx);
        }
        if (!Array.isArray(obj) && typeof obj !== 'string') {
          throw new LangError('You can only use [ ] on a list or text (line ' + line + ')', line, 'This value is ' + typeName(obj) + '.');
        }
        if (typeof idx !== 'number' || !Number.isInteger(idx)) {
          throw new LangError('A list position must be a whole number (line ' + line + ')', line, '');
        }
        if (idx < 0 || idx >= obj.length) {
          throw new LangError('Position ' + idx + ' is outside this list (line ' + line + ')', line,
            'It holds ' + obj.length + ' item' + (obj.length === 1 ? '' : 's') + ', so valid positions are 0 to ' + (obj.length - 1) + '.');
        }
        return obj[idx];
      }
      case 'Un': {
        const x = evalExpr(e.x, line);
        if (e.op === 'not') return !truthy(x, line);
        if (typeof x !== 'number') throw new LangError('You can only negate a number (line ' + line + ')', line, 'This value is ' + typeName(x) + '.');
        return -x;
      }
      case 'Bin': {
        if (e.op === 'and') { const l = evalExpr(e.l, line); return truthy(l, line) ? evalExpr(e.r, line) : l; }
        if (e.op === 'or') { const l = evalExpr(e.l, line); return truthy(l, line) ? l : evalExpr(e.r, line); }
        const a = evalExpr(e.l, line), b = evalExpr(e.r, line);
        return binop(e.op, a, b, line);
      }
      case 'Method': {
        const obj = evalExpr(e.obj, line);
        if (!Array.isArray(obj)) throw new LangError('Only a list can use .' + e.name + '() (line ' + line + ')', line, 'This value is ' + typeName(obj) + '.');
        if (e.args.length !== 1) throw new LangError('.' + e.name + '() takes exactly one value (line ' + line + ')', line, '');
        obj.push(evalExpr(e.args[0], line));
        return null;
      }
      case 'Call': return callFn(e, line);
      case 'ErrMessage': {
        const top = stack[stack.length - 1];
        if (top.vars.has('err')) return top.vars.get('err');
        if (globalFrame.vars.has('err')) return globalFrame.vars.get('err');
        throw new LangError('There is no caught error here (line ' + line + ')', line, '');
      }
      case 'Self': {
        const self = stack[stack.length - 1].self;
        if (!self) throw new LangError('There is no object here (line ' + line + ')', line,
          'This only means something inside a method.');
        return self;
      }
      case 'New': {
        const cls = classOf(e.name, line);
        const obj = { __obj: true, cls: e.name, fields: new Map() };
        const found = findCtor(e.name);
        if (found) runMethod(found.ctor, found.owner, obj, e.args.map(a => evalExpr(a, line)), e.name + '.new', line);
        else if (e.args.length) throw new LangError(e.name + ' takes no values when you create it (line ' + line + ')', line, '');
        return obj;
      }
      case 'Attr': {
        const obj = evalExpr(e.obj, line);
        if (!isObj(obj)) throw new LangError('Only an object has fields (line ' + line + ')', line, 'This value is ' + typeName(obj) + '.');
        if (!obj.fields.has(e.name)) throw new LangError('"' + e.name + '" has not been set on this ' + obj.cls + ' (line ' + line + ')', line,
          'Fields are created in the constructor, usually from its values.');
        return obj.fields.get(e.name);
      }
      case 'Invoke': {
        const obj = evalExpr(e.obj, line);
        if (!isObj(obj)) throw new LangError('Only an object has methods (line ' + line + ')', line, 'This value is ' + typeName(obj) + '.');
        const found = findMethod(obj.cls, e.name);
        if (!found) throw new LangError('A ' + obj.cls + ' has no method called "' + e.name + '" (line ' + line + ')', line,
          'Check the spelling, and that the method is defined in this class or a parent.');
        return runMethod(found.m, found.owner, obj, e.args.map(a => evalExpr(a, line)), obj.cls + '.' + e.name, line);
      }
      case 'SuperCall': {
        const fr = stack[stack.length - 1];
        if (!fr.self || !fr.defining) throw new LangError('super only means something inside a method (line ' + line + ')', line, '');
        const parentName = classes.get(fr.defining).parent;
        const found = parentName ? findMethod(parentName, e.name) : null;
        if (!found) throw new LangError('The parent class has no method called "' + e.name + '" (line ' + line + ')', line, '');
        return runMethod(found.m, found.owner, fr.self, e.args.map(a => evalExpr(a, line)), parentName + '.' + e.name, line);
      }
      case 'SuperInit': {
        const fr = stack[stack.length - 1];
        if (!fr.self || !fr.defining) throw new LangError('super only means something inside a constructor (line ' + line + ')', line, '');
        const parentName = classes.get(fr.defining).parent;
        const found = parentName ? findCtor(parentName) : null;
        if (!parentName) throw new LangError('This class has no parent to set up (line ' + line + ')', line, '');
        if (!found) return null;   // the parent has no constructor of its own: nothing to do
        return runMethod(found.ctor, found.owner, fr.self, e.args.map(a => evalExpr(a, line)), parentName + '.new', line);
      }
      default: throw new LangError('Cannot evaluate ' + e.kind, line, '');
    }
  }

  function reqText(v, what, line) {
    if (typeof v !== 'string') throw new LangError('Only text can use ' + what + ' (line ' + line + ')', line, 'This value is ' + typeName(v) + '.');
  }

  function binop(op, a, b, line) {
    if (op === 'in') {
      if (b instanceof Map) return b.has(a);
      if (Array.isArray(b)) return b.some(x => eq(x, a));
      if (typeof b === 'string') return b.indexOf(String(a)) >= 0;
      throw new LangError('"in" needs a dictionary, a list or text on the right (line ' + line + ')', line, '');
    }
    if (op === '==') return eq(a, b);
    if (op === '!=') return !eq(a, b);
    if (op === '+') {
      if (typeof a === 'string' && typeof b === 'string') return a + b;
      if (typeof a === 'number' && typeof b === 'number') return a + b;
      if (Array.isArray(a) && Array.isArray(b)) return a.concat(b);
      throw new LangError('You can\'t add ' + typeName(a) + ' to ' + typeName(b) + ' (line ' + line + ')', line,
        'Both sides of + must be the same kind of thing.');
    }
    if (['-', '*', '/', '%', '**', 'idiv'].includes(op)) {
      if (typeof a !== 'number' || typeof b !== 'number') {
        throw new LangError('"' + op + '" only works on numbers (line ' + line + ')', line,
          'Left side is ' + typeName(a) + ', right side is ' + typeName(b) + '.');
      }
      if ((op === '/' || op === '%' || op === 'idiv') && b === 0) {
        throw new LangError('Division by zero (line ' + line + ')', line, 'Check the value on the right of "' + op + '".');
      }
      switch (op) {
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        case 'idiv': return Math.floor(a / b);
        case '%': return ((a % b) + b) % b;   // floored (Python-style)
        case '**': return Math.pow(a, b);
      }
    }
    if (['<', '<=', '>', '>='].includes(op)) {
      if (typeof a !== typeof b || (typeof a !== 'number' && typeof a !== 'string')) {
        throw new LangError('Can\'t compare ' + typeName(a) + ' with ' + typeName(b) + ' using "' + op + '" (line ' + line + ')', line, '');
      }
      switch (op) { case '<': return a < b; case '<=': return a <= b; case '>': return a > b; case '>=': return a >= b; }
    }
    throw new LangError('Unknown operator ' + op, line, '');
  }

  function eq(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => eq(x, b[i]));
    return a === b;
  }

  function callFn(e, line) {
    const name = e.name;
    if (name === 'print') {
      const parts = e.args.map(a => {
        const v = evalExpr(a, line);
        return typeof v === 'string' ? v : fmt(v, lang);
      });
      output.push(parts.join(' '));
      return null;
    }
    if (name === 'len') {
      const v = evalExpr(e.args[0], line);
      if (v instanceof Map) return v.size;
      if (!Array.isArray(v) && typeof v !== 'string') throw new LangError('Only a list, text or a dictionary has a length (line ' + line + ')', line, 'This value is ' + typeName(v) + '.');
      return v.length;
    }
    if (name === 'input') {
      if (inputQueue.length) return inputQueue.shift();
      const waiting = new LangError('Waiting for you to type something', line, '');
      waiting.fatal = true;      // a program cannot catch its own need for input
      waiting.waiting = true;
      throw waiting;
    }
    if (name === 'sorted') {
      const v = evalExpr(e.args[0], line);
      if (!Array.isArray(v)) throw new LangError('sorted() needs a list (line ' + line + ')', line, 'This value is ' + typeName(v) + '.');
      const kinds = new Set(v.map(x => typeof x));
      if (kinds.size > 1) throw new LangError('sorted() needs every value to be the same kind (line ' + line + ')', line, '');
      return v.slice().sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    }
    if (name === 'str') {
      const v = evalExpr(e.args[0], line);
      if (v instanceof Map || Array.isArray(v) || isObj(v)) throw new LangError('str() is for numbers and true/false values (line ' + line + ')', line, '');
      return typeof v === 'string' ? v : fmt(v, lang);
    }
    if (name === 'abs' || name === 'min' || name === 'max') {
      const vs = e.args.map(a => evalExpr(a, line));
      if (vs.some(v => typeof v !== 'number')) throw new LangError(name + '() only works on numbers (line ' + line + ')', line, '');
      if (name === 'abs') return Math.abs(vs[0]);
      return name === 'min' ? Math.min(...vs) : Math.max(...vs);
    }
    const fn = funcs.get(name);
    if (!fn) throw new LangError('There is no function called "' + name + '" (line ' + line + ')', line,
      'Define it before you call it, and check the spelling.');
    if (fn.params.length !== e.args.length) {
      throw new LangError(name + '() expects ' + fn.params.length + ' value' + (fn.params.length === 1 ? '' : 's') +
        ' but got ' + e.args.length + ' (line ' + line + ')', line, '');
    }
    const argv = e.args.map(a => evalExpr(a, line));
    if (stack.length > 60) {
      const deep = new LangError('Too many nested function calls (line ' + line + ')', line,
        'A function is probably calling itself without a stopping condition.');
      deep.fatal = true;
      throw deep;
    }
    const frame = { name: name, vars: new Map() };
    fn.params.forEach((p, i) => frame.vars.set(p, argv[i]));
    stack.push(frame);
    let result = null;
    try {
      execBlock(fn.body);
    } catch (sig) {
      if (sig instanceof ReturnSignal) result = sig.v;
      else { stack.pop(); throw sig; }
    }
    stack.pop();
    return result;
  }

  function runMethod(def, owner, self, argv, label, line) {
    if (def.params.length !== argv.length) {
      throw new LangError(label + ' expects ' + def.params.length + ' value' + (def.params.length === 1 ? '' : 's') +
        ' but got ' + argv.length + ' (line ' + line + ')', line, '');
    }
    if (stack.length > 60) throw new LangError('Too many nested calls (line ' + line + ')', line,
      'Something is probably calling itself without a stopping condition.');
    const frame = { name: label, vars: new Map(), self, defining: owner.name };
    def.params.forEach((pn, i) => frame.vars.set(pn, argv[i]));
    stack.push(frame);
    let result = null;
    try { execBlock(def.body); }
    catch (sig) {
      if (sig instanceof ReturnSignal) result = sig.v;
      else { stack.pop(); throw sig; }
    }
    stack.pop();
    return result;
  }

  function execBlock(body) { for (const s of body) execStatement(s); }

  function execStatement(s) {
    switch (s.kind) {
      case 'Func': return;   // hoisted
      case 'Class': return;  // hoisted
      case 'Assign': {
        record(s, 'assign');
        const v = evalExpr(s.value, s.line);
        if (s.target.kind === 'Ident') setVar(s.target.name, v);
        else if (s.target.kind === 'Attr') {
          const obj = evalExpr(s.target.obj, s.line);
          if (!isObj(obj)) throw new LangError('Only an object has fields (line ' + s.line + ')', s.line, '');
          obj.fields.set(s.target.name, v);
        }
        else {
          const obj = evalExpr(s.target.obj, s.line);
          const idx = evalExpr(s.target.idx, s.line);
          if (obj instanceof Map) { obj.set(idx, v); return; }
          if (!Array.isArray(obj)) throw new LangError('You can only assign into a list or a dictionary (line ' + s.line + ')', s.line, '');
          if (typeof idx !== 'number' || idx < 0 || idx >= obj.length) {
            throw new LangError('Position ' + fmt(idx, lang) + ' is outside this list (line ' + s.line + ')', s.line, '');
          }
          obj[idx] = v;
        }
        return;
      }
      case 'ExprStmt': record(s, 'run'); evalExpr(s.expr, s.line); return;
      case 'Return': record(s, 'return'); throw new ReturnSignal(s.value ? evalExpr(s.value, s.line) : null);
      case 'Break': record(s, 'break'); throw new BreakSignal();
      case 'Continue': record(s, 'continue'); throw new ContinueSignal();
      case 'If': {
        record(s, 'check');
        if (truthy(evalExpr(s.cond, s.line), s.line)) execBlock(s.body);
        else if (s.orelse && s.orelse.length) execBlock(s.orelse);
        return;
      }
      case 'While': {
        for (;;) {
          record(s, 'check');
          if (!truthy(evalExpr(s.cond, s.line), s.line)) break;
          try { execBlock(s.body); }
          catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            throw sig;
          }
        }
        return;
      }
      case 'ForRange': {
        const start = evalExpr(s.start, s.line);
        const end = evalExpr(s.end, s.line);
        if (typeof start !== 'number' || typeof end !== 'number') {
          throw new LangError('A counting loop needs numbers (line ' + s.line + ')', s.line, '');
        }
        const frame = stack[stack.length - 1];
        const had = frame.vars.has(s.var);
        const old = frame.vars.get(s.var);
        for (let i = start; i < end; i++) {
          frame.vars.set(s.var, i);
          record(s, 'loop');
          try { execBlock(s.body); }
          catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            if (had) frame.vars.set(s.var, old); else frame.vars.delete(s.var);
            throw sig;
          }
        }
        if (had) frame.vars.set(s.var, old); else frame.vars.delete(s.var);
        return;
      }
      case 'ForEach': {
        let it = evalExpr(s.iter, s.line);
        if (it instanceof Map) it = [...it.keys()];   // looping a dictionary visits its keys
        if (!Array.isArray(it) && typeof it !== 'string') {
          throw new LangError('You can only loop over a list, text or a dictionary (line ' + s.line + ')', s.line, '');
        }
        const frame = stack[stack.length - 1];
        const had = frame.vars.has(s.var);
        const old = frame.vars.get(s.var);
        for (const item of it) {
          frame.vars.set(s.var, item);
          record(s, 'loop');
          try { execBlock(s.body); }
          catch (sig) {
            if (sig instanceof BreakSignal) break;
            if (sig instanceof ContinueSignal) continue;
            if (had) frame.vars.set(s.var, old); else frame.vars.delete(s.var);
            throw sig;
          }
        }
        if (had) frame.vars.set(s.var, old); else frame.vars.delete(s.var);
        return;
      }
      case 'Try': {
        record(s, 'try');
        try { execBlock(s.body); }
        catch (err) {
          if (err instanceof ReturnSignal || err instanceof BreakSignal || err instanceof ContinueSignal) throw err;
          if (!(err instanceof LangError) || err.fatal) throw err;
          setVar('err', err.message);
          execBlock(s.handler);
        }
        return;
      }
      case 'Throw': {
        record(s, 'throw');
        const m = evalExpr(s.msg, s.line);
        const e = new LangError(typeof m === 'string' ? m : fmt(m, lang), s.line, '');
        e.thrown = true;
        throw e;
      }
      case 'DeclareOnly': return;
      default: throw new LangError('Cannot execute ' + s.kind, s.line || 0, '');
    }
  }

  try {
    // hoist function definitions (both languages allow calling a function defined above; we allow either order)
    const hoist = (body) => {
      for (const s of body) {
        if (s.kind === 'Func') funcs.set(s.name, s);
        if (s.kind === 'Class') {
          const methods = new Map();
          for (const m of s.methods) methods.set(m.name, m);
          classes.set(s.name, { name: s.name, parent: s.parent, ctor: s.ctor, methods });
        }
      }
      for (const [, c] of classes) {
        if (c.parent && !classes.has(c.parent)) {
          throw new LangError('Class "' + c.name + '" says its parent is "' + c.parent + '", which does not exist', 0,
            'Define the parent class above the one that extends it.');
        }
      }
    };
    hoist(ast.body);
    execBlock(ast.body);
    // terminal step: program finished, everything printed, final values in view
    if (trace.length < maxTrace) {
      const lastStmt = ast.body.length ? ast.body[ast.body.length - 1] : null;
      trace.push({
        line: (trace.length ? trace[trace.length - 1].line : (lastStmt && lastStmt.line) || 0),
        note: 'done', depth: 1, frame: 'main',
        vars: snapshotVars(globalFrame), globals: null,
        outputLen: output.length
      });
    }
  } catch (err) {
    if (err instanceof ReturnSignal) error = new LangError('"return" used outside a function', 0, '');
    else if (err instanceof BreakSignal || err instanceof ContinueSignal) error = new LangError('"break"/"continue" used outside a loop', 0, '');
    else if (err instanceof LangError) error = err;
    else throw err;
  }

  return { output, trace, error, steps, waiting: !!(error && error.waiting), inputsLeft: inputQueue.length };
}

/* Convenience: source -> result, in one call. */
function execute(src, langId, options = {}) {
  const ast = parse(src, langId);
  return run(ast, Object.assign({ lang: langId }, options));
}

/* Translate source from one language to another. */
function translate(src, fromId, toId) {
  return print(parse(src, fromId), toId);
}
/* CORE-END */
