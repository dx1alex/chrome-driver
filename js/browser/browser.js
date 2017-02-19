"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("./base"));
const helpers_1 = require("../helpers");
const base_1 = require("./base");
const exec_1 = require("./exec");
const elements_1 = require("./elements");
const state_1 = require("./state");
const navigate_1 = require("./navigate");
const alert_1 = require("./alert");
const tabs_1 = require("./tabs");
const cookies_1 = require("./cookies");
const frames_1 = require("./frames");
const getter_1 = require("./getter");
const input_1 = require("./input");
const mouse_1 = require("./mouse");
const storage_1 = require("./storage");
const utils_1 = require("./utils");
const sessions_1 = require("./sessions");
const screenshot_1 = require("./screenshot");
const scroll_1 = require("./scroll");
class Browser extends base_1.Base {
    constructor(wd_options, options) {
        super();
        this.commandHistory = [];
        this.options = options ? JSON.parse(JSON.stringify(options)) : {};
        this.webdriver = new base_1.Webdriver(wd_options);
        if (!this.options.waitTimeout)
            this.options.waitTimeout = new.target.DEFAULT_WAIT_TIMEOUT;
        if (!this.options.waitInterval)
            this.options.waitInterval = new.target.DEFAULT_WAIT_INTERVAL;
        this.options.pause = Object.assign({
            click: 0,
            navigate: 0,
            mouse: 0,
            keys: 0,
            submit: 0,
            upload: 0,
        }, this.options.pause || {});
        applyMixins(Browser, [
            scroll_1.Scroll, screenshot_1.Screenshot, sessions_1.Sessions, utils_1.Utils, storage_1.Storage, mouse_1.Mouse, input_1.Input, getter_1.Getter,
            frames_1.Frames, cookies_1.Cookies, tabs_1.Tabs, alert_1.Alert, navigate_1.Navigate, exec_1.Exec, elements_1.Elements, state_1.State
        ]);
        return this._thisProxy = new Proxy(this, {
            get: (browser, command, r) => {
                if (typeof browser[command] !== 'function' || new.target._noProxyList.includes(command)) {
                    return Reflect.get(browser, command, r);
                }
                return (...args) => {
                    let lastCommand, date = new Date();
                    if (!new.target._noCommandHistoryList.includes(command)) {
                        const err = new Error, stack = err.stack.split('\n').slice(2).join('\n');
                        if (this.commandHistory.length > new.target.MAX_COMMAND_HISTORY_ITEMS) {
                            this.commandHistory = this.commandHistory.slice(this.commandHistory.length - new.target.MAX_COMMAND_HISTORY_ITEMS);
                        }
                        this.commandHistory.push({
                            command,
                            args,
                            date,
                            stack
                        });
                        lastCommand = this.commandHistory[this.commandHistory.length - 1];
                        // log
                        const strArgs = JSON.stringify(args.map(arg => typeof arg === 'function' ? arg.name : arg));
                        console.log(`${command} ${strArgs} ${getDateTime(date)}\n` + stack);
                    }
                    const res = browser[command](...args);
                    if (res instanceof Promise) {
                        res.then((res) => lastCommand ? lastCommand.result = res : res, (err) => {
                            if (lastCommand) {
                                lastCommand.error = err;
                                browser._lastError = lastCommand;
                            }
                            else {
                                browser._lastError = err;
                            }
                            return err;
                        });
                    }
                    return res;
                };
            }
        });
    }
    get _() {
        return this; //._thisProxy
    }
    getStatus() {
        return this.webdriver.status();
    }
    async setTimeouts(timeouts) {
        for (let [type, ms] of Object.entries(timeouts)) {
            await this.webdriver.setTimeouts({ type, ms });
        }
    }
    async quit() {
        await this.webdriver.deleteSession({ sessionId: this.sessionId });
        this.started = false;
    }
    async start(options = {}) {
        let init = Object.assign({}, this.options, options);
        init = JSON.parse(JSON.stringify(init));
        if (init.proxy) {
            init.desiredCapabilities.proxy = {
                proxyType: 'manual',
                httpProxy: init.proxy,
                sslProxy: init.proxy,
            };
        }
        let res = await this.webdriver.initSession({ desiredCapabilities: init.desiredCapabilities });
        this.sessionId = res.sessionId;
        this.capabilities = res.value;
        this.started = true;
        if (init.timeouts) {
            await this.setTimeouts(init.timeouts);
        }
        if (init.maximaze) {
            await this._.maximize();
        }
        else {
            if (init.windowPosition) {
                await this._.setPosition(init.windowPosition[0], init.windowPosition[1]);
            }
            if (init.windowSize) {
                await this._.setSize(init.windowSize[0], init.windowSize[1]);
            }
        }
        if (init.url) {
            await this._.url(init.url);
        }
    }
    $(selector) {
        return new Proxy(this, {
            get: (browser, command, r) => {
                if (typeof browser[command] !== 'function' || !this.constructor._$List.includes(command)) {
                    return void 0;
                }
                return async (...args) => {
                    if (typeof selector === 'string')
                        selector = await this._.element(selector);
                    return browser[command](selector, ...args);
                };
            }
        });
    }
    getCommandHistory(endItems = 0) {
        return this.commandHistory.slice(-endItems);
    }
    getCommandHistoryErrors(endItems = 0) {
        return this.commandHistory.filter(v => v.error).slice(-endItems);
    }
    lastError(err) {
        return this._lastError && this._lastError == err ? this._lastError : err;
    }
    pause(options, value) {
        if (typeof options === 'string') {
            this.options.pause[options] = value;
            return;
        }
        Object.assign(this.options.pause, options);
    }
    dump() {
    }
    proxy() {
    }
}
Browser._$List = [
    'script', 'scriptAll', 'scriptAllAsync', 'scriptAsync', 'html', 'text', 'tagName', 'attr', 'prop', 'css',
    'classList', 'size', 'location', 'locationInView', 'keys', 'type', 'clear', 'empty', 'submit', 'check',
    'uncheck', 'uploadFile', 'select', 'unselect', 'form', 'click', 'mouseMoveTo', 'mouseClickTo', 'isExists',
    'isSelected', 'isEnabled', 'isFocused', 'isReadonly', 'isVisible', 'hasText', 'hasClass', 'hasAttribute'
];
Browser._noProxyList = ['constructor', '$', 'getCommandHistory', 'getCommandHistoryErrors', 'lastError'];
Browser._noCommandHistoryList = ['waitFor'];
Browser.DEFAULT_WAIT_TIMEOUT = 30000;
Browser.DEFAULT_WAIT_INTERVAL = 1000;
Browser.MAX_COMMAND_HISTORY_ITEMS = 1000;
Browser.KEY = helpers_1.UNICODE_KEYS;
exports.Browser = Browser;
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
function getDateTime(d = new Date()) {
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)} `
        + `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}:${('0' + d.getSeconds()).slice(-2)}.${(d.getMilliseconds())}`;
}
