"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Alert extends base_1.Base {
    setAlert(text) {
        return this.webdriver.setAlertText({ text });
    }
    getAlert() {
        return this.webdriver.getAlertText();
    }
    okAlert() {
        return this.webdriver.acceptAlert();
    }
    cancelAlert() {
        return this.webdriver.dismissAlert();
    }
    async alert(accept, text) {
        if (text)
            await this.setAlert(text);
        if (accept) {
            await this.okAlert();
        }
        else {
            await this.cancelAlert();
        }
    }
}
exports.Alert = Alert;
