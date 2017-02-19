"use strict";
const base_1 = require("./base");
class Exec extends base_1.Base {
    execute(code, ...args) {
        let script = '' + code;
        let async = script.startsWith('async');
        if (typeof code === 'function')
            script = `return (${script.replace('async', '')}).apply(null, arguments)`;
        if (async) {
            return this.webdriver.executeAsyncScript({ script, args });
        }
        return this.webdriver.executeScript({ script, args });
    }
    executeAsync(code, ...args) {
        const script = typeof code === 'function' ? `return (${code}).apply(null, arguments)` : code;
        return this.webdriver.executeAsyncScript({ script, args });
    }
    async script(selector, code, ...args) {
        let sel;
        if (Array.isArray(selector)) {
            sel = [];
            for (let s of selector) {
                sel.push(typeof s === 'string' ? await this._.element(s) : s);
            }
        }
        else {
            sel = typeof selector === 'string' ? await this._.element(selector) : selector;
        }
        return this._.execute(code, sel, ...args);
    }
    async scriptAll(selector, code, ...args) {
        let sel;
        if (Array.isArray(selector)) {
            sel = [];
            for (let s of selector) {
                sel.concat(typeof s === 'string' ? await this._.element(s) : (Array.isArray(s) ? s : [s]));
            }
        }
        else {
            sel = typeof selector === 'string' ? await this._.elements(selector) : [selector];
        }
        return this._.execute(code, sel, ...args);
    }
    async scriptAllAsync(selector, code, ...args) {
        let sel;
        if (Array.isArray(selector)) {
            sel = [];
            for (let s of selector) {
                sel.concat(typeof s === 'string' ? await this._.element(s) : (Array.isArray(s) ? s : [s]));
            }
        }
        else {
            sel = typeof selector === 'string' ? await this._.elements(selector) : [selector];
        }
        return this._.executeAsync(code, sel, ...args);
    }
    async scriptAsync(selector, code, ...args) {
        let sel;
        if (Array.isArray(selector)) {
            sel = [];
            for (let s of selector) {
                sel.push(typeof s === 'string' ? await this._.element(s) : s);
            }
        }
        else {
            sel = typeof selector === 'string' ? await this._.element(selector) : selector;
        }
        return this._.executeAsync(code, sel, ...args);
    }
}
exports.Exec = Exec;
// function getScript(code: string | Function) {
//   return `return ((sel) => {
//       arguments[0] = Array.isArray(sel) 
//       ? sel.map(s => (s.index != null ? document.querySelectorAll(s.value).item(s.index) : document.querySelector(s.value))) 
//       : (sel.index != null ? document.querySelectorAll(sel.value).item(sel.index) : document.querySelector(sel.value));
//       return (${code}).apply(null, arguments)
//     }).apply(null, arguments)`
// }
