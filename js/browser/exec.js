"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Exec extends base_1.Base {
    execute(code, ...args) {
        let script = '' + code;
        if (typeof code === 'function') {
            if (script.startsWith('async')) {
                return this.executeAsync(code, ...args);
            }
            script = `return (${script}).apply(null, arguments)`;
        }
        return this.webdriver.executeScript({ script, args });
    }
    async executeAsync(code, ...args) {
        const script = typeof code === 'function'
            ? `let done = arguments[arguments.length -1];      
      let result = (${code}).apply(null, arguments);
      if(result instanceof Promise) { 
        result.then(done, err => done({__error: {message: err.message, stack: err.stack}}))
      }`
            : code;
        const res = await this.webdriver.executeAsyncScript({ script, args });
        if (res && res.__error) {
            const error = new Error(res.__error.message);
            error.stack += `\n(browser context stack)\n${res.__error.stack}`;
            throw error;
        }
        return res;
    }
    async script(selector, code, ...args) {
        let sel;
        if (Array.isArray(selector)) {
            sel = [];
            for (let s of selector) {
                sel.push(typeof s === 'string' ? await this.element(s) : s);
            }
        }
        else {
            sel = typeof selector === 'string' ? await this.element(selector) : selector;
        }
        return this.execute(code, sel, ...args);
    }
    async scriptAll(selector, code, ...args) {
        let sel;
        if (Array.isArray(selector)) {
            sel = [];
            for (let s of selector) {
                sel.concat(typeof s === 'string' ? await this.element(s) : (Array.isArray(s) ? s : [s]));
            }
        }
        else {
            sel = typeof selector === 'string' ? await this.elements(selector) : [selector];
        }
        return this.execute(code, sel, ...args);
    }
    async scriptAllAsync(selector, code, ...args) {
        let sel;
        if (Array.isArray(selector)) {
            sel = [];
            for (let s of selector) {
                sel.concat(typeof s === 'string' ? await this.element(s) : (Array.isArray(s) ? s : [s]));
            }
        }
        else {
            sel = typeof selector === 'string' ? await this.elements(selector) : [selector];
        }
        return this.executeAsync(code, sel, ...args);
    }
    async scriptAsync(selector, code, ...args) {
        let sel;
        if (Array.isArray(selector)) {
            sel = [];
            for (let s of selector) {
                sel.push(typeof s === 'string' ? await this.element(s) : s);
            }
        }
        else {
            sel = typeof selector === 'string' ? await this.element(selector) : selector;
        }
        return this.executeAsync(code, sel, ...args);
    }
}
exports.Exec = Exec;
