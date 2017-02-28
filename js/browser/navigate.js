"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Navigate extends base_1.Base {
    async url(url, pause = 0) {
        if (url) {
            await this.webdriver.go({ url });
            await this._.sleep(pause || this.options.pause.navigate);
        }
        return this.webdriver.getCurrentURL();
    }
    async go(url, pause = 0) {
        await this.webdriver.go({ url });
        await this._.sleep(pause || this.options.pause.navigate);
    }
    async refresh(pause = 0) {
        await this.webdriver.refresh();
        await this._.sleep(pause || this.options.pause.navigate);
    }
    async back(pause = 0) {
        await this.webdriver.goBack();
        await this._.sleep(pause || this.options.pause.navigate);
    }
    async forward(pause = 0) {
        await this.webdriver.goForward();
        await this._.sleep(pause || this.options.pause.navigate);
    }
}
exports.Navigate = Navigate;
