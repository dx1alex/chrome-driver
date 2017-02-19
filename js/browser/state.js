"use strict";
const base_1 = require("./base");
class State extends base_1.Base {
    async isExists(selector) {
        return (await this._.elements(selector)).length > 0;
    }
    async isSelected(selector) {
        return this.webdriver.isElementSelected({ id: await this._.elementId(selector) });
    }
    async isEnabled(selector) {
        return this.webdriver.isElementEnabled({ id: await this._.elementId(selector) });
    }
    isFocused(selector) {
        return this._.script(selector, (el) => {
            let focused = document.activeElement;
            if (!focused || focused === document.body) {
                return false;
            }
            return focused === el;
        });
    }
    isReadonly(selector) {
        return this._.hasAttribute(selector, 'readonly');
    }
    async isVisible(selector) {
        return this.webdriver.isElementDysplayed({ id: await this._.elementId(selector) });
    }
    //TODO
    //isVisibleInViewport() { }
    async hasText(selector, text) {
        const re = text instanceof RegExp ? text : new RegExp(text);
        return re.test(await this.webdriver.getElementText({ id: await this._.elementId(selector) }));
    }
    async hasClass(selector, name) {
        return (await this._.classList(selector)).includes(name);
    }
    hasAttribute(selector, attr) {
        return this._.script(selector, (el, attr) => {
            return el.hasAttribute(attr);
        }, attr);
    }
}
exports.State = State;
