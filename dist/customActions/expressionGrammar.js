"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
/* eslint-disable */
function id(d) {
    return d[0];
}
// @ts-ignore
var format = function (indexes) {
    if (indexes === void 0) { indexes = {}; }
    return function (d) {
        var info = {};
        for (var key in indexes) {
            // @ts-ignore
            var name_1 = d[indexes[key]];
            if (key === 'variable' && name_1 !== undefined) {
                name_1.value = name_1.value.toLowerCase();
            }
            // @ts-ignore
            info[key] = name_1 || {
                // @ts-ignore
                offset: d.map(function (el) { return el.length || el.value.length; }).reduce(function (a, b) { return a + b; }),
                value: ''
            };
        }
        return info;
    };
};
// @ts-ignore
var withOffset = function (d, l) { return ({
    offset: l,
    value: d[0]
}); };
// @ts-ignore
var identifier = function (d) { return d[0] + d[1].join(''); };
var grammar = {
    Lexer: undefined,
    ParserRules: [
        { name: 'dqstring$ebnf$1', symbols: [] },
        {
            name: 'dqstring$ebnf$1',
            symbols: ['dqstring$ebnf$1', 'dstrchar'],
            postprocess: function (d) { return d[0].concat([d[1]]); }
        },
        {
            name: 'dqstring',
            symbols: [{ literal: '"' }, 'dqstring$ebnf$1', { literal: '"' }],
            postprocess: function (d) {
                return d[1].join('');
            }
        },
        { name: 'sqstring$ebnf$1', symbols: [] },
        {
            name: 'sqstring$ebnf$1',
            symbols: ['sqstring$ebnf$1', 'sstrchar'],
            postprocess: function (d) { return d[0].concat([d[1]]); }
        },
        {
            name: 'sqstring',
            symbols: [{ literal: "'" }, 'sqstring$ebnf$1', { literal: "'" }],
            postprocess: function (d) {
                return d[1].join('');
            }
        },
        { name: 'btstring$ebnf$1', symbols: [] },
        {
            name: 'btstring$ebnf$1',
            symbols: ['btstring$ebnf$1', /[^`]/],
            postprocess: function (d) { return d[0].concat([d[1]]); }
        },
        {
            name: 'btstring',
            symbols: [{ literal: '`' }, 'btstring$ebnf$1', { literal: '`' }],
            postprocess: function (d) {
                return d[1].join('');
            }
        },
        { name: 'dstrchar', symbols: [/[^\\"\n]/], postprocess: id },
        {
            name: 'dstrchar',
            symbols: [{ literal: '\\' }, 'strescape'],
            postprocess: function (d) {
                return JSON.parse('"' + d.join('') + '"');
            }
        },
        { name: 'sstrchar', symbols: [/[^\\'\n]/], postprocess: id },
        {
            name: 'sstrchar',
            symbols: [{ literal: '\\' }, 'strescape'],
            postprocess: function (d) {
                return JSON.parse('"' + d.join('') + '"');
            }
        },
        {
            name: 'sstrchar$string$1',
            symbols: [{ literal: '\\' }, { literal: "'" }],
            postprocess: function (d) { return d.join(''); }
        },
        {
            name: 'sstrchar',
            symbols: ['sstrchar$string$1'],
            postprocess: function () {
                return "'";
            }
        },
        { name: 'strescape', symbols: [/["\\\/bfnrt]/], postprocess: id },
        {
            name: 'strescape',
            symbols: [{ literal: 'u' }, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/],
            postprocess: function (d) {
                return d.join('');
            }
        },
        { name: 'expression', symbols: ['name'], postprocess: format({ variable: 0 }) },
        { name: 'expression', symbols: ['name', 'c'], postprocess: format({ variable: 0, itemType: 2 }) },
        {
            name: 'expression',
            symbols: ['name', 'c', 'name'],
            postprocess: format({ variable: 0, itemType: 2 })
        },
        { name: 'expression', symbols: ['name', 'd'], postprocess: format({ variable: 0, property: 2 }) },
        {
            name: 'expression',
            symbols: ['name', 'd', 'name'],
            postprocess: format({ variable: 0, property: 2 })
        },
        { name: 'expression', symbols: ['_p'], postprocess: format({ variable: 1 }) },
        { name: 'expression', symbols: ['_p', 'name'], postprocess: format({ variable: 1 }) },
        { name: 'expression', symbols: ['_p', 'name', 'p_'], postprocess: format({ variable: 1 }) },
        {
            name: 'expression',
            symbols: ['_p', 'name', 'c'],
            postprocess: format({ variable: 1, itemType: 3 })
        },
        {
            name: 'expression',
            symbols: ['_p', 'name', 'c', 'name'],
            postprocess: format({ variable: 1, itemType: 3 })
        },
        {
            name: 'expression',
            symbols: ['_p', 'name', 'c', 'name', 'p_'],
            postprocess: format({ variable: 1, itemType: 3 })
        },
        {
            name: 'expression',
            symbols: ['_p', 'name', 'p_', 'd'],
            postprocess: format({ variable: 1, property: 4 })
        },
        {
            name: 'expression',
            symbols: ['_p', 'name', 'p_', 'd', 'name'],
            postprocess: format({ variable: 1, property: 4 })
        },
        {
            name: 'expression',
            symbols: ['_p', 'name', 'c', 'name', 'p_', 'd'],
            postprocess: format({ variable: 1, itemType: 3, property: 6 })
        },
        {
            name: 'expression',
            symbols: ['_p', 'name', 'c', 'name', 'p_', 'd', 'name'],
            postprocess: format({ variable: 1, itemType: 3, property: 6 })
        },
        { name: 'c', symbols: [{ literal: ':' }], postprocess: id },
        { name: 'd', symbols: [{ literal: '.' }], postprocess: id },
        { name: '_p', symbols: [{ literal: '(' }], postprocess: id },
        { name: 'p_', symbols: [{ literal: ')' }], postprocess: id },
        { name: 'name', symbols: ['identifier'], postprocess: withOffset },
        { name: 'name', symbols: ['qstring'], postprocess: withOffset },
        { name: 'identifier$ebnf$1', symbols: [] },
        {
            name: 'identifier$ebnf$1',
            symbols: ['identifier$ebnf$1', /[a-zA-Z$_0-9]/],
            postprocess: function (d) { return d[0].concat([d[1]]); }
        },
        { name: 'identifier', symbols: [/[a-zA-Z$_]/, 'identifier$ebnf$1'], postprocess: identifier },
        { name: 'qstring', symbols: ['dqstring'], postprocess: id },
        { name: 'qstring', symbols: ['sqstring'], postprocess: id }
    ],
    ParserStart: 'expression'
};
exports.default = grammar;
//# sourceMappingURL=expressionGrammar.js.map