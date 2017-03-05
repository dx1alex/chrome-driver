"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const state_1 = require("./state");
class Utils extends base_1.Base {
    pause(options, value) {
        const old = Object.assign({}, this.options.pause);
        if (typeof options === 'string') {
            this.options.pause[options] = value;
            return;
        }
        Object.assign(this.options.pause, options);
        return old;
    }
    sleep(ms, ms2 = 0) {
        if (ms2) {
            ms = (Math.random() * Math.abs(ms2 - ms) | 0) + Math.min(ms, ms2) + 1;
        }
        if (ms)
            return new Promise(resolve => setTimeout(resolve, ms));
        return Promise.resolve();
    }
    sleeps(sec, sec2 = 0) {
        return this.sleep(sec * 1000, sec2 * 1000);
    }
    waitUntil(fn, timeoutOrSettings, interval) {
        let message = `waitUntil (${fn.name}) exit by timeout`, timeout = 0, nothrow = false;
        if (timeoutOrSettings && typeof timeoutOrSettings !== 'number') {
            timeout = timeoutOrSettings.timeout;
            interval = timeoutOrSettings.interval;
            message = timeoutOrSettings.message;
            nothrow = timeoutOrSettings.nothrow;
        }
        else {
            timeout = timeoutOrSettings;
        }
        if (!timeout)
            timeout = this.options.waitTimeout;
        if (!interval)
            interval = this.options.waitInterval;
        const now = Date.now();
        return new Promise((resolve, reject) => {
            check();
            async function check() {
                try {
                    if (await fn())
                        return resolve(nothrow ? true : void 0);
                    let time = Date.now() - now;
                    if (time >= timeout)
                        return nothrow ? resolve(false) : reject(new Error(message));
                    setTimeout(check, timeout - time > interval ? interval : timeout - time);
                }
                catch (err) {
                    reject(err);
                }
            }
        });
    }
    waitFor(timeoutOrSettings, interval) {
        return new Proxy(this, {
            get: (browser, state, r) => {
                if (typeof browser[state] !== 'function'
                    || !Object.getOwnPropertyNames(state_1.State.prototype).includes(state))
                    return void 0;
                return async (...args) => {
                    const el = await this.element(args[0]);
                    const name = state.toString() + ' ' + (typeof args[0] === 'string' ? args[0] : args[0].value);
                    const obj = {
                        [name]: () => browser[state](el, ...(args.slice(1)))
                    };
                    return this.waitUntil(obj[name], timeoutOrSettings, interval);
                };
            }
        });
    }
}
exports.Utils = Utils;
