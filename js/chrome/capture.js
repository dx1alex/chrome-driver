"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../browser/base");
class ChromeCapture extends base_1.Base {
    async captureTab() {
        const png = await this.extension(() => {
            return new Promise((resolve, reject) => {
                chrome.tabs.captureVisibleTab({ format: 'png' }, resolve);
            });
        });
        return png.substr('data:image/png;base64,'.length);
    }
}
exports.ChromeCapture = ChromeCapture;
