"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("../webdriver"));
const helpers_1 = require("../helpers");
class Base {
    constructor() {
        this.sessionId = '';
        this.started = false;
        this._ = this;
        this._numCommand = 0;
        this.commandHistory = [];
    }
}
Base._no_command_history_list = [];
Base._no_proxy_list = [];
Base.DEFAULT_WAIT_TIMEOUT = 30000;
Base.DEFAULT_WAIT_INTERVAL = 1000;
Base.MAX_COMMAND_HISTORY_ITEMS = 100;
Base.KEY = helpers_1.UNICODE_KEYS;
exports.Base = Base;
