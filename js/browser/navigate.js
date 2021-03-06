"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Navigate extends base_1.Base {
    async go(url, pause = 0) {
        await this.webdriver.go({ url });
        await this.sleep(pause || this.options.pause.navigate);
    }
    async refresh(pause = 0) {
        await this.webdriver.refresh();
        await this.sleep(pause || this.options.pause.navigate);
    }
    async back(pause = 0) {
        await this.webdriver.goBack();
        await this.sleep(pause || this.options.pause.navigate);
    }
    async forward(pause = 0) {
        await this.webdriver.goForward();
        await this.sleep(pause || this.options.pause.navigate);
    }
}
exports.Navigate = Navigate;
Navigate.prototype.url = async function url(url, pause = 0) {
    if (url)
        await this.go(url, pause);
    return this.webdriver.getCurrentURL();
};
