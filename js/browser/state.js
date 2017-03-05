"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class State extends base_1.Base {
    async isExists(selector) {
        return (await this.elements(selector)).length > 0;
    }
    async notExists(selector) {
        return !((await this.elements(selector)).length > 0);
    }
    async isSelected(selector) {
        return this.webdriver.isElementSelected({ id: await this.elementId(selector) });
    }
    async isEnabled(selector) {
        return this.webdriver.isElementEnabled({ id: await this.elementId(selector) });
    }
    isFocused(selector) {
        return this.script(selector, (el) => {
            let focused = document.activeElement;
            if (!focused || focused === document.body) {
                return false;
            }
            return focused === el;
        });
    }
    isReadonly(selector) {
        return this.hasAttribute(selector, 'readonly');
    }
    async isVisible(selector) {
        return this.webdriver.isElementDysplayed({ id: await this.elementId(selector) });
    }
    //TODO
    //isVisibleInViewport() { }
    async hasText(selector, text) {
        const re = text instanceof RegExp ? text : new RegExp(text);
        return re.test(await this.webdriver.getElementText({ id: await this.elementId(selector) }));
    }
    async hasClass(selector, name) {
        return (await this.classList(selector)).includes(name);
    }
    hasAttribute(selector, attr) {
        return this.script(selector, (el, attr) => {
            return el.hasAttribute(attr);
        }, attr);
    }
}
exports.State = State;
