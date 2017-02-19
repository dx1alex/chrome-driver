"use strict";
const base_1 = require("./base");
class Cookies extends base_1.Base {
    setCookie(cookie) {
        return this.webdriver.setCookie({ cookie });
    }
    getCookies() {
        return this.webdriver.getAllCookies();
    }
    deleteCookie(name) {
        return this.webdriver.deleteCookie({ name });
    }
    deleteAllCookies() {
        return this.webdriver.deleteAllCookies();
    }
}
exports.Cookies = Cookies;
