"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browser_1 = require("./browser");
const path = require("path");
class Chrome extends browser_1.Browser {
    constructor(chromeOptions) {
        const options = JSON.parse(JSON.stringify(chromeOptions));
        const dc = {
            browserName: 'chrome',
            chromeOptions: {
                args: [...new Set(Chrome.default_args.concat(options.args || []))],
                binary: options.binary,
                extensions: options.extensions,
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
                            this.sessionId = this.webdriver.sessionId = v.id;
                            this.capabilities = v.capabilities;
                            this.started = true;
                            return;
                        case 'restart':
                            this.webdriver.sessionId = v.id;
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
        await super.start(options);
        if (options.fullscreen) {
            //TODO 
            //await this._.fullscreen()
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
}
Chrome._no_proxy_list = browser_1.Browser._no_proxy_list.concat('setArgs');
Chrome.default_prefs = {
    session: {
        restore_on_startup: 4,
        startup_urls: ['about:blank']
    }
};
Chrome.default_args = [
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
