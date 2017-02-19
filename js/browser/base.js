"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require("../webdriver"));
class Base {
    constructor() {
        this.sessionId = '';
        this.started = false;
    }
    get _() {
        return this;
    }
}
exports.Base = Base;
