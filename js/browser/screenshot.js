"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const base_1 = require("./base");
class Screenshot extends base_1.Base {
    async getImage(image, filePath) {
        const png = await this.scriptAsync(image, (el, done) => {
            const url = el.getAttribute('src');
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.src = url;
            if (img.complete) {
                toDataUrl();
            }
            else {
                img.addEventListener('load', () => toDataUrl());
            }
            function toDataUrl() {
                const canvas = document.createElement('canvas');
                canvas.height = img.height;
                canvas.width = img.width;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL();
                done(dataURL);
            }
        });
        let base64Data = png.substr(22);
        if (filePath) {
            return await new Promise((resolve, reject) => {
                fs.writeFile(filePath, base64Data, 'base64', (err) => {
                    if (err)
                        return reject(err);
                    resolve(base64Data);
                });
            });
        }
        return base64Data;
    }
    async screenshot(filePath, fullPage) {
        let base64Data;
        if (filePath && typeof filePath !== 'string') {
            fullPage = filePath;
            filePath = void 0;
        }
        if (fullPage) {
            const body = await this.element('body'), { height } = await this.getViewSize(), screens = [];
            let scroll = -1;
            while (true) {
                await this.scrollTo(scroll);
                let scrollTop = await this.prop(body, 'scrollTop');
                scrollTop |= 0;
                screens.push({
                    scrollTop,
                    img: await this.captureTab()
                });
                if (scrollTop <= 0)
                    break;
                scroll = scrollTop - height;
                if (scroll < 0)
                    scroll = 0;
            }
            const png = await this.execute((screens) => {
                console.log('screenshot');
                const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                const canvas = document.createElement('canvas');
                canvas.height = screens[0].scrollTop + height;
                canvas.width = width;
                const ctx = canvas.getContext('2d');
                const img = new Image(width, height);
                img.setAttribute('crossOrigin', 'anonymous');
                for (let screen of screens) {
                    img.src = 'data:image/png;base64,' + screen.img;
                    ctx.drawImage(img, 0, screen.scrollTop);
                }
                const png = canvas.toDataURL();
                console.log(png.length);
                return png;
            }, screens.slice(0, 2));
            base64Data = png.substr('data:image/png;base64,'.length);
        }
        else {
            base64Data = await this.captureTab();
        }
        if (filePath) {
            return await new Promise((resolve, reject) => {
                fs.writeFile(filePath, base64Data, 'base64', err => {
                    if (err)
                        return reject(err);
                    resolve(base64Data);
                });
            });
        }
        return base64Data;
    }
    //TODO full page
    async capture(selector, filePath, offset) {
        if (filePath && typeof filePath !== 'string') {
            offset = filePath;
            filePath = void 0;
        }
        const off = Object.assign({ x: 0, y: 0, w: 0, h: 0 }, offset);
        if (selector) {
            let loc = await this.locationInView(selector);
            let size = await this.size(selector);
            off.x += loc.x;
            off.y += loc.y;
            off.w += size.width;
            off.h += size.height;
        }
        const screen = await this.captureTab();
        const png = await this.execute((screen, offset) => {
            const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const canvas = document.createElement('canvas');
            canvas.height = offset.h;
            canvas.width = offset.w;
            const ctx = canvas.getContext('2d');
            const img = new Image(width, height);
            img.setAttribute('crossOrigin', 'anonymous');
            img.src = 'data:image/png;base64,' + screen;
            ctx.drawImage(img, offset.x, offset.y, offset.w, offset.h, 0, 0, offset.w, offset.h);
            return canvas.toDataURL();
        }, screen, off);
        const base64Data = png.substr('data:image/png;base64,'.length);
        if (filePath) {
            return await new Promise((resolve, reject) => {
                fs.writeFile(filePath, base64Data, 'base64', err => {
                    if (err)
                        return reject(err);
                    resolve(base64Data);
                });
            });
        }
        return base64Data;
    }
    captureTab() {
        return this.webdriver.screenshot();
    }
    getScreenshot() {
        return this.webdriver.screenshot();
    }
}
exports.Screenshot = Screenshot;
