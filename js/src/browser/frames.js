"use strict";
const base_1 = require("./base");
class Frames extends base_1.Base {
    async switchFrame(frame) {
        const id = typeof frame === 'number' || frame === null ? frame : await this._.elementId(frame);
        await this.webdriver.switchToFrame({ id });
    }
    switchParentFrame() {
        return this.webdriver.switchToParentFrame();
    }
}
exports.Frames = Frames;
