"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Tabs extends base_1.Base {
    maximize(windowHandle = 'current') {
        return this.webdriver.maximizeWindow({ windowHandle });
    }
    setPosition(x, y, windowHandle = 'current') {
        return this.webdriver.setWindowPosition({ windowHandle, x, y });
    }
    getPosition(windowHandle = 'current') {
        return this.webdriver.getWindowPosition({ windowHandle });
    }
    setSize(width, height, windowHandle = 'current') {
        return this.webdriver.setWindowSize({ windowHandle, width, height });
    }
    getSize(windowHandle = 'current') {
        return this.webdriver.getWindowSize({ windowHandle });
    }
    getViewSize() {
        return this._.execute(() => {
            return {
                width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            };
        });
    }
    getTab() {
        return this.webdriver.getWindowHandle();
    }
    getTabs() {
        return this.webdriver.getWindowHandles();
    }
    async switchTab(name, ontop) {
        await this.webdriver.switchToWindow({ name });
        if (ontop)
            return this.webdriver.screenshot();
    }
    async closeTab(name) {
        const tab = await this._.getTab();
        if (name !== tab) {
            await this._.switchTab(name);
            await this.webdriver.closeWindow();
            await this._.switchTab(tab);
        }
        else {
            const tabs = await this._.getTabs();
            let newtab = null;
            if (tabs.length > 1) {
                newtab = tabs[tabs.indexOf(tab) + (tabs[0] != tab ? -1 : 1)];
            }
            await this.webdriver.closeWindow();
            if (newtab != null)
                await this._.switchTab(newtab);
        }
    }
    async newTab(url, switchTo = false) {
        if (typeof url !== 'string') {
            switchTo = url;
            url = undefined;
        }
        await this._.execute((url) => {
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.click();
        }, url || '');
        const tabs = await this._.getTabs();
        const newtab = tabs[tabs.length - 1];
        if (switchTo)
            await this._.switchTab(newtab);
        return newtab;
    }
    onTop() {
        return this.webdriver.screenshot();
    }
}
exports.Tabs = Tabs;
