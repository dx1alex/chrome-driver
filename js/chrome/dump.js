"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../browser/base");
const helpers_1 = require("../helpers");
const fs = require("fs");
class ChromeDump extends base_1.Base {
    async saveAsMHTML(filePath) {
        const mhtml = await this.extension(() => saveAsMHTML());
        const base64Data = mhtml.substr('data:;base64,'.length);
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, base64Data, 'base64', err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    async dump(dir) {
        if (!dir) {
            dir = this.capabilities.chrome.userDataDir;
        }
        const dumpDir = helpers_1.getDateTime().replace(' ', '_');
        dir = `${dir}/${dumpDir}`;
        fs.mkdirSync(dir);
        const commandHistory = JSON.stringify(this.commandHistory, null, '  ');
        const history = new Promise((resolve, reject) => {
            fs.writeFile(`${dir}/command_history.json`, commandHistory, err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
        const lastError = JSON.stringify(this.lastError(), null, '  ');
        const error = new Promise((resolve, reject) => {
            fs.writeFile(`${dir}/last_error.json`, lastError, err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
        const html_page = await this.html();
        const html = new Promise((resolve, reject) => {
            fs.writeFile(`${dir}/page.html`, html_page, err => {
                if (err)
                    return reject(err);
                resolve(html_page);
            });
        });
        const mhtml = this.saveAsMHTML(`${dir}/page.mht`);
        const screenshot = this.screenshot(`${dir}/screenshot.png`);
        return Promise.all([history, error, html, mhtml, screenshot]);
    }
}
exports.ChromeDump = ChromeDump;
