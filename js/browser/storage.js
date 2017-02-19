"use strict";
const base_1 = require("./base");
class Storage extends base_1.Base {
    localStorage(key, value) {
        if (!key) {
            return this.webdriver.getLocalStorageKeys();
        }
        if (!value) {
            return this.webdriver.getLocalStorageValue({ key });
        }
        return this.webdriver.setLocalStorage({ key, value });
    }
    deleteLocalStorage(key) {
        if (!key) {
            return this.webdriver.clearLocalStorage();
        }
        return this.webdriver.deleteLocalStorageValue({ key });
    }
}
exports.Storage = Storage;
