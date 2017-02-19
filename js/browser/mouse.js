"use strict";
const base_1 = require("./base");
class Mouse extends base_1.Base {
    async click(selector, pause) {
        if (!Array.isArray(selector)) {
            selector = [selector];
        }
        for (let s of selector) {
            await this.webdriver.click({ id: await this._.elementId(s) });
            await this._.sleep(pause || this.options.pause.click);
        }
    }
    async mouseDoubleClick(pause) {
        await this.webdriver.mouseDoubleClick();
        await this._.sleep(pause || this.options.pause.mouse);
    }
    async mouseButtonClick(button = 0, pause) {
        await this.webdriver.mouseClick({ button });
        await this._.sleep(pause || this.options.pause.mouse);
    }
    async mouseButtonUp(button = 0, pause) {
        await this.webdriver.mouseUp({ button });
        await this._.sleep(pause || this.options.pause.mouse);
    }
    async mouseButtonDown(button = 0, pause) {
        await this.webdriver.mouseDown({ button });
        await this._.sleep(pause || this.options.pause.mouse);
    }
    async mouseMoveTo(selector, xoffset, yoffset, pause) {
        let element = await this.elementId(selector);
        await this.webdriver.mouseMoveTo({ element, xoffset, yoffset });
        await this._.sleep(pause || this.options.pause.mouse);
    }
    async mouseMoveBy(xoffset, yoffset, pause) {
        await this.webdriver.mouseMoveTo({ xoffset, yoffset });
        await this._.sleep(pause || this.options.pause.mouse);
    }
    async mouseClickTo(selector, xoffset, yoffset) {
        await this._.mouseMoveTo(selector, xoffset, yoffset);
        return this._.mouseButtonClick();
    }
    async mouseClickBy(xoffset, yoffset) {
        await this._.mouseMoveBy(xoffset, yoffset);
        return this._.mouseButtonClick();
    }
    //TODO
    async dragAndDrop(pause) {
        await this._.sleep(pause || this.options.pause.mouse);
    }
}
exports.Mouse = Mouse;
