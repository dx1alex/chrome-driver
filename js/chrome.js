"use strict";
const browser_1 = require("./browser");
class Chrome extends browser_1.Browser {
    constructor(wd_options, options) {
        super(wd_options, options);
    }
}
let options = {
    proxy: '',
    windowSize: [1200, 800],
    windowPosition: [0, 0],
    timeouts: { implicit: 1000, script: 30000, 'page load': 30000 },
    desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: [
                'new-window',
                'disable-background-networking',
                'disable-client-side-phishing-detection',
                'disable-component-update',
                'disable-hang-monitor',
                'disable-prompt-on-repost',
                'disable-default-apps',
                'disable-translate',
                'disable-sync',
                'disable-web-resources',
                'disable-translate-new-ux',
                'disable-session-crashed-bubble',
                'disable-password-manager-reauthentication',
                'disable-save-password-bubble',
                'disable-plugins-discovery',
                'disable-plugins',
                'disable-gpu',
                'no-sandbox',
                'safe-plugins',
                'allow-running-insecure-content',
                'ignore-urlfetcher-cert-requests',
                'safebrowsing-disable-auto-update',
                'safebrowsing-disable-download-protection',
                'ignore-certificate-errors',
                'metrics-recording-only',
                'no-default-browser-check',
                'no-first-run',
                'no-managed-user-acknowledgment-check',
                'no-network-profile-warning',
                'no-pings',
                'noerrdialogs',
                'password-store=basic',
                'user-data-dir=/tmp/test'
            ]
        }
    }
};
const chrome = new Chrome({ url: 'http://localhost:9500', debug: false }, options);
main();
async function main() {
    try {
        //console.log(await chrome.getStatus())
        await chrome.start();
        //await chrome.go('http://ya.ru')
        //await chrome.keys('#text', 'sex', 1000, true, 3000)
        await chrome.quit();
        chrome.getCommandHistory().forEach(console.log);
    }
    catch (err) {
        console.error(chrome.lastError(err));
    }
}
