"use strict";
const base_1 = require("./base");
class Scroll extends base_1.Base {
    //TODO оптимизировать чтобы offsetTop при alignToTop == 'center' вычислялся на стороне браузера
    async scroll(selector, alignToTop = true, offsetTop = 0) {
        if (alignToTop === 'top')
            alignToTop = true;
        if (alignToTop === 'bottom')
            alignToTop = false;
        if (alignToTop === 'center') {
            alignToTop = true;
            const size = await this.webdriver.getElementSize({ id: await this.elementId(selector) });
            const winSize = await this._.getViewSize();
            offsetTop = offsetTop - (winSize.height / 2 + size.height / 2);
        }
        await this._.script(selector, (el, align, offsetTop) => {
            el.scrollIntoView(align);
            if (offsetTop)
                scrollBy(0, offsetTop);
        }, alignToTop, offsetTop);
    }
    //TODO
    scrollToElement(selector, parent, alignToTop = true, offsetTop) {
    }
    async scrollBy(selector, top, left) {
        if (typeof selector !== 'number') {
            return this._.script(selector, (el, top, left) => {
                if (top != null)
                    el.scrollTop += top;
                if (left != null)
                    el.scrollLeft += left;
            }, top, left);
        }
        left = top;
        top = selector;
        return this._.execute((top = 0, left = 0) => scrollBy(left, top), top, left);
    }
    async scrollTo(selector, top, left) {
        if (typeof selector !== 'number') {
            if (top < 0)
                top = Number.MAX_SAFE_INTEGER;
            if (left < 0)
                left = Number.MAX_SAFE_INTEGER;
            return this._.script(selector, (el, top, left) => {
                if (top != null)
                    el.scrollTop = top;
                if (left != null)
                    el.scrollLeft = left;
            }, top, left);
        }
        left = top;
        top = selector;
        if (top < 0)
            top = Number.MAX_SAFE_INTEGER;
        if (left < 0)
            left = Number.MAX_SAFE_INTEGER;
        return this._.execute((top = 0, left = 0) => scrollTo(left, top), top, left);
    }
    scrollTop(selector, px) {
        if (px < 0)
            px = Number.MAX_SAFE_INTEGER;
        return this._.script(selector, (el, px) => el.scrollTop = px, px);
    }
    scrollLeft(selector, px) {
        if (px < 0)
            px = Number.MAX_SAFE_INTEGER;
        return this._.script(selector, (el, px) => el.scrollLeft = px, px);
    }
}
exports.Scroll = Scroll;
