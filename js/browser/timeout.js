"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Timeout extends base_1.Base {
    async setTimeouts(timeouts) {
        for (let [type, ms] of Object.entries(timeouts)) {
            await this.webdriver.setTimeouts({ type, ms });
        }
    }
}
exports.Timeout = Timeout;
