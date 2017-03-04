"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
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
const timeout_1 = require("./timeout");
const command_history_1 = require("./command-history");
const _class_1 = require("./$class");
const fs = require("fs");
class Browser extends base_1.Base {
    constructor(options) {
        super();
        this.options = JSON.parse(JSON.stringify(options));
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
        if (this.options.log) {
            this.logStream = typeof this.options.log === 'boolean'
                ? process.stdout
                : /^console/.test(this.options.log)
                    ? { write: console[this.options.log.split('.')[1] || 'log'] }
                    : fs.createWriteStream(this.options.log, { flags: 'a' });
        }
        this.webdriver = new base_1.Webdriver({
            remote: this.options.remote,
            log: this.logStream
        });
        return this._this_proxy = new Proxy(this, {
            get: (browser, command, r) => {
                if (typeof this[command] !== 'function' || new.target._no_proxy_list.includes(command)) {
                    return Reflect.get(browser, command, r);
                }
                return (...args) => {
                    const date = new Date(), err = new Error, stack = err.stack.split('\n').slice(1).join('\n'), strArgs = JSON.stringify(args.map(arg => typeof arg === 'function' ? arg.name : arg));
                    const lastCommand = { command, args, date, stack };
                    if (!this.options.noCommandHistory && !new.target._no_command_history_list.includes(command)) {
                        this.commandHistory.push(lastCommand);
                        if (this.commandHistory.length > new.target.MAX_COMMAND_HISTORY_ITEMS) {
                            this.commandHistory = this.commandHistory
                                .slice(this.commandHistory.length - new.target.MAX_COMMAND_HISTORY_ITEMS);
                        }
                    }
                    if (this.logStream) {
                        this.logStream.write(`[${++this._numCommand}] ${helpers_1.getDateTime(date)} \n${command} ${strArgs} \n${stack}\n`);
                    }
                    const timeStart = Date.now();
                    const res = browser[command](...args);
                    if (res instanceof Promise) {
                        res.then((res) => {
                            const timeEnd = Date.now();
                            lastCommand.time = timeEnd - timeStart;
                            lastCommand.result = res === this ? 'this' : res;
                            this._lastCommand = lastCommand;
                            return res;
                        }, (err) => {
                            const timeEnd = Date.now();
                            lastCommand.time = timeEnd - timeStart;
                            lastCommand.error = err;
                            this._lastError = lastCommand;
                            return err;
                        });
                    }
                    else {
                        const timeEnd = Date.now();
                        lastCommand.time = timeEnd - timeStart;
                        lastCommand.result = res === this ? 'this' : res;
                        this._lastCommand = lastCommand;
                    }
                    return res;
                };
            }
        });
    }
    getStatus() {
        return this.webdriver.status();
    }
    async quit() {
        await this.webdriver.deleteSession();
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
            await this.maximize();
        }
        else {
            if (init.window) {
                init.windowPosition = [init.window[0], init.window[1]];
                init.windowSize = [init.window[2], init.window[3]];
            }
            if (init.windowPosition) {
                await this.setPosition(init.windowPosition[0], init.windowPosition[1]);
            }
            if (init.windowSize) {
                await this.setSize(init.windowSize[0], init.windowSize[1]);
            }
        }
        if (init.url) {
            await this.go(init.url);
        }
        return this;
    }
}
Browser._no_command_history_list = ['waitFor'];
Browser._no_proxy_list = [_class_1.$Class, command_history_1.CommandHistory]
    .map(n => Object.getOwnPropertyNames(n.prototype).filter(v => v !== 'constructor'))
    .reduce((a, b) => a.concat(b))
    .concat(Object.getOwnPropertyNames(Object.prototype))
    .concat(['elementId']);
exports.Browser = Browser;
helpers_1.applyMixins(Browser, [
    scroll_1.Scroll, screenshot_1.Screenshot, sessions_1.Sessions, utils_1.Utils, storage_1.Storage, mouse_1.Mouse, input_1.Input, getter_1.Getter, command_history_1.CommandHistory,
    frames_1.Frames, cookies_1.Cookies, tabs_1.Tabs, alert_1.Alert, navigate_1.Navigate, exec_1.Exec, elements_1.Elements, state_1.State, timeout_1.Timeout, _class_1.$Class
]);
