"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../browser/base");
const URL = require("url");
class ChromeProxy extends base_1.Base {
    clearProxy() {
        return this.extension(() => {
            chrome.proxy.settings.clear({});
            proxy_auth = null;
        });
    }
    setProxy(proxy) {
        if (!proxy)
            return this.clearProxy();
        if (!(/^https?:\/\//.test(proxy) || /^socks[4|5]:\/\//.test(proxy)))
            proxy = 'http://' + proxy;
        const { protocol, hostname, port, auth } = URL.parse(proxy), scheme = protocol.slice(0, -1);
        let pauth;
        if (auth) {
            const p = auth.split(':');
            pauth = {
                login: p[0],
                password: p[1]
            };
        }
        return this.extension((scheme, host, port, auth) => {
            return setProxy(scheme, host, port, auth);
        }, scheme, hostname, +port, pauth);
    }
}
exports.ChromeProxy = ChromeProxy;
