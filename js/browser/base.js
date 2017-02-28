"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("../webdriver"));
class Base {
    constructor() {
        this.sessionId = '';
        this.started = false;
        this._this_proxy = this;
    }
    get _() {
        return this;
    }
}
exports.Base = Base;
