"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class CommandHistory extends base_1.Base {
    getCommandHistory(endItems = 0) {
        return this.commandHistory.slice(-endItems);
    }
    getCommandHistoryErrors(endItems = 0) {
        return this.commandHistory.filter(v => v.error).slice(-endItems);
    }
    lastError(err) {
        return this._lastError && this._lastError === err ? this._lastError : err;
    }
    lastCommand() {
        return this._lastCommand;
    }
}
exports.CommandHistory = CommandHistory;
