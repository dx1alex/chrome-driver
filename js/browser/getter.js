"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Getter extends base_1.Base {
    title() {
        return this.webdriver.getTitle();
    }
    html(selector) {
        if (!selector)
            return this.webdriver.getSource();
        return this._.script(selector, (el) => el.innerHTML);
    }
    async text(selector) {
        if (selector)
            return this.webdriver.getElementText({ id: await this._.elementId(selector) });
        return this.webdriver.getElementText({ id: await this._.elementId('body') });
    }
    async tagName(selector) {
        return this.webdriver.getElementTagName({ id: await this._.elementId(selector) });
    }
    attr(selector, attr) {
        return this._.script(selector, (el, attr) => el.getAttribute(attr), attr);
    }
    prop(selector, prop) {
        return this._.script(selector, (el, prop) => el[prop], prop);
    }
    async css(selector, propertyName) {
        return this.webdriver.getElementCssProperty({ id: await this._.elementId(selector), propertyName });
    }
    classList(selector) {
        return this._.script(selector, (el) => el.classList);
    }
    async size(selector) {
        return this.webdriver.getElementSize({ id: await this._.elementId(selector) });
    }
    async location(selector) {
        return this.webdriver.getElementLocation({ id: await this._.elementId(selector) });
    }
    async locationInView(selector) {
        return this.webdriver.getElementLocationInView({ id: await this._.elementId(selector) });
    }
}
exports.Getter = Getter;
