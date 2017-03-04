"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Mouse extends base_1.Base {
    async click(selector, pause) {
        if (!Array.isArray(selector)) {
            selector = [selector];
        }
        for (let s of selector) {
            await this.webdriver.click({ id: await this.elementId(s) });
            await this.sleep(pause || this.options.pause.click);
        }
    }
    async mouseDoubleClick(pause) {
        await this.webdriver.mouseDoubleClick();
        await this.sleep(pause || this.options.pause.mouse);
    }
    async mouseButtonClick(button = 0, pause) {
        await this.webdriver.mouseClick({ button });
        await this.sleep(pause || this.options.pause.mouse);
    }
    async mouseButtonUp(button = 0, pause) {
        await this.webdriver.mouseUp({ button });
        await this.sleep(pause || this.options.pause.mouse);
    }
    async mouseButtonDown(button = 0, pause) {
        await this.webdriver.mouseDown({ button });
        await this.sleep(pause || this.options.pause.mouse);
    }
    async mouseMoveTo(selector, xoffset, yoffset, pause) {
        let element = await this.elementId(selector);
        await this.webdriver.mouseMoveTo({ element, xoffset, yoffset });
        await this.sleep(pause || this.options.pause.mouse);
    }
    async mouseMoveBy(xoffset, yoffset, pause) {
        await this.webdriver.mouseMoveTo({ xoffset, yoffset });
        await this.sleep(pause || this.options.pause.mouse);
    }
    async mouseClickTo(selector, xoffset, yoffset) {
        await this.mouseMoveTo(selector, xoffset, yoffset);
        return this.mouseButtonClick();
    }
    async mouseClickBy(xoffset, yoffset) {
        await this.mouseMoveBy(xoffset, yoffset);
        return this.mouseButtonClick();
    }
    //TODO
    async dragAndDrop(pause) {
        await this.sleep(pause || this.options.pause.mouse);
    }
}
exports.Mouse = Mouse;
