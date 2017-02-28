"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Sessions extends base_1.Base {
    getSession(sessionId) {
        if (!sessionId)
            sessionId = this.sessionId;
        return this.webdriver.getSession({ sessionId });
    }
    deleteSession(sessionId) {
        return this.webdriver.deleteSession({ sessionId });
    }
    getSessions() {
        return this.webdriver.getSessions();
    }
}
exports.Sessions = Sessions;
