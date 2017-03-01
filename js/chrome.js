"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("./browser");
const helpers_1 = require("./helpers");
const fs = require("fs");
const path = require("path");
const URL = require("url");
const extensionsDir = path.resolve(__dirname, '../extensions');
const driverExtension = fs.readFileSync(`${extensionsDir}/driver.crx`, 'base64');
class Chrome extends browser_1.Browser {
    constructor(chromeOptions) {
        const options = JSON.parse(JSON.stringify(chromeOptions));
        const dc = {
            browserName: 'chrome',
            chromeOptions: {
                args: [...new Set(Chrome.default_args.concat(options.args || []))],
                binary: options.binary,
                extensions: Chrome.default_extensions.concat(options.extensions || []),
                localState: options.localState,
                prefs: options.prefs || Chrome.default_prefs,
                detach: options.detach,
                debuggerAddress: options.debuggerAddress,
                excludeSwitches: options.excludeSwitches,
                minidumpPath: options.minidumpPath,
                windowTypes: options.windowTypes,
                mobileEmulation: options.mobileEmulation,
                perfLoggingPrefs: options.perfLoggingPrefs
            }
        };
        options.desiredCapabilities = Object.assign(options.desiredCapabilities || {}, dc);
        super(options);
    }
    async start(startOptions) {
        const options = JSON.parse(JSON.stringify(Object.assign({}, this.options, startOptions)));
        const chromeOptions = options.desiredCapabilities.chromeOptions;
        if (options.dataDir) {
            const userDataDir = path.join(options.dataDir, options.user ? options.user + '' : '');
            const sessions = await this.webdriver.getSessions();
            for (const v of sessions) {
                if (v.capabilities.chrome.userDataDir === userDataDir) {
                    switch (options.ifActiveSession) {
                        case 'continue':
                            try {
                                await this.webdriver.getCurrentURL({ sessionId: v.id });
                                this.sessionId = this.webdriver.sessionId = v.id;
                                this.capabilities = v.capabilities;
                                this.started = true;
                                return;
                            }
                            catch (err) {
                                if (err.statusCode != 100)
                                    throw err;
                            }
                        case 'restart':
                            await this.webdriver.deleteSession({ sessionId: v.id });
                            break;
                        case 'exception':
                        default:
                            throw new Error(`session ${v.id} with profile ${userDataDir} is exists`);
                    }
                    break;
                }
            }
            setArgs(chromeOptions.args, 'user-data-dir', userDataDir);
        }
        if (options.useragent) {
            setArgs(chromeOptions.args, 'user-agent', options.useragent);
        }
        if (options.enableFlash) {
            setArgs(chromeOptions.args, 'disable-bundled-ppapi-flash', false);
        }
        if (options.proxy) {
            let proxy = options.proxy.split('@').reverse()[0];
            options.desiredCapabilities.proxy = {
                proxyType: 'manual',
                httpProxy: proxy,
                sslProxy: proxy,
            };
        }
        const res = await this.webdriver.initSession({ desiredCapabilities: options.desiredCapabilities });
        this.sessionId = res.sessionId;
        this.capabilities = res.value;
        this.started = true;
        const timeouts = Object.assign({}, Chrome.default_timeouts, options.timeouts);
        await this._.setTimeouts(timeouts);
        await this.webdriver.go({ url: 'chrome://newtab' });
        if (options.proxy) {
            await this._.setProxy(options.proxy);
        }
        if (options.maximaze) {
            await this._.maximize();
        }
        else if (options.fullscreen) {
            //TODO 
            //await this._.fullscreen()
        }
        else {
            if (options.window) {
                options.windowPosition = [options.window[0], options.window[1]];
                options.windowSize = [options.window[2], options.window[3]];
            }
            if (options.windowPosition) {
                await this._.setPosition(options.windowPosition[0], options.windowPosition[1]);
            }
            if (options.windowSize) {
                await this._.setSize(options.windowSize[0], options.windowSize[1]);
            }
        }
        if (options.url) {
            await this._.go(options.url);
        }
    }
    setArgs(args, value) {
        if (Array.isArray(args)) {
            this.options.desiredCapabilities.chromeOptions.args = args;
            return 0;
        }
        else if (typeof args === 'string') {
            return setArgs(this.options.desiredCapabilities.chromeOptions.args, args, value);
        }
        for (let k of Object.keys(args)) {
            setArgs(this.options.desiredCapabilities.chromeOptions.args, k, value);
        }
        return 0;
    }
    clearProxy() {
        return this._.extension(() => {
            chrome.proxy.settings.clear({});
            proxy_auth = null;
        });
    }
    setProxy(proxy) {
        if (!proxy) {
            return this._.clearProxy();
        }
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
        return this._.extension((scheme, host, port, auth) => {
            console.log(scheme, host, port, auth);
            chrome.proxy.settings.set({
                value: {
                    mode: "fixed_servers",
                    rules: {
                        singleProxy: {
                            scheme, host, port
                        }
                    }
                },
                scope: 'regular'
            });
            proxy_auth = auth;
        }, scheme, hostname, +port, pauth);
    }
    async saveAsMHTML(filePath) {
        const mhtml = await this._.extension(() => {
            return new Promise((resolve, reject) => {
                chrome.tabs.query({ active: true }, tabs => {
                    chrome.pageCapture.saveAsMHTML({ tabId: tabs[0].id }, mhtml => {
                        const reader = new FileReader();
                        reader.readAsDataURL(mhtml);
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                    });
                });
            });
        });
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
        const lastError = JSON.stringify(this._lastError, null, '  ');
        const error = new Promise((resolve, reject) => {
            fs.writeFile(`${dir}/last_error.json`, lastError, err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
        const html_page = await this._.html();
        const html = new Promise((resolve, reject) => {
            fs.writeFile(`${dir}/page.html`, html_page, err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
        const mhtml = this._.saveAsMHTML(`${dir}/page.mht`);
        const screenshot = this._.screenshot(`${dir}/screenshot.png`);
        return Promise.all([history, error, html, mhtml, screenshot]);
    }
}
Chrome._no_proxy_list = browser_1.Browser._no_proxy_list.concat('setArgs');
Chrome.default_prefs = {
    session: {
        restore_on_startup: 4,
        startup_urls: ['about:blank']
    }
};
Chrome.default_timeouts = {
    implicit: 100,
    script: 1000,
    'page load': 30000
};
Chrome.default_extensions = [driverExtension];
Chrome.default_args = [
    //`load-extension=${extensionsDir}/driver`,
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
    'disable-web-security',
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
    'disable-bundled-ppapi-flash'
];
exports.Chrome = Chrome;
function setArgs(args, key, value) {
    let i = args.findIndex(v => v.split('=')[0] === key);
    if (typeof value === 'string') {
        const val = key + '=' + value;
        if (i >= 0) {
            args[i] = val;
        }
        else {
            args.push(val);
            i = args.length - 1;
        }
    }
    else if (i < 0 && (value || value == null)) {
        args.push(key);
        i = args.length - 1;
    }
    else if (i >= 0) {
        args.splice(i, 1);
        i = -1;
    }
    return i;
}
