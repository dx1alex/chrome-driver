import { Browser, Capabilities, PauseSettings, Timeouts } from './browser';
export declare class Chrome extends Browser {
    protected static _no_proxy_list: string[];
    static default_prefs: object;
    static default_args: string[];
    constructor(chromeOptions: ChromeOptions);
    start(startOptions?: ChromeStartOptions): Promise<void>;
    setArgs(key: string, value?: string | boolean): number;
    setArgs(args: string[]): number;
    setArgs(args: {
        [key: string]: string | boolean;
    }): number;
}
export interface ChromeOptions extends ChromeStartOptions {
    remote: string;
    log?: string | boolean;
    verbose?: boolean;
    waitTimeout?: number;
    waitInterval?: number;
    pause?: PauseSettings;
    noCommandHistory?: boolean;
}
export interface ChromeStartOptions extends ChromeOptionsCapabilities {
    proxy?: any;
    url?: string;
    maximaze?: boolean;
    windowSize?: number[];
    windowPosition?: number[];
    timeouts?: Timeouts;
    useragent?: string;
    fullscreen?: boolean;
    enableFlash?: boolean;
    dataDir?: string;
    user?: string;
    profile?: string;
    ifActiveSession?: 'exception' | 'restart' | 'continue';
    desiredCapabilities?: ChromeOptionsCapabilities;
}
export interface ChromeOptionsCapabilities extends Capabilities {
    args?: string[];
    binary?: string;
    extensions?: string[];
    localState?: {
        [key: string]: any;
    };
    prefs?: {
        [key: string]: any;
    };
    detach?: boolean;
    debuggerAddress?: string;
    excludeSwitches?: string[];
    minidumpPath?: string;
    windowTypes?: string[];
    /**
     * A dictionary with either a value for “deviceName,” or values for “deviceMetrics” and “userAgent”
     * Refer to Mobile Emulation for more information.
     */
    mobileEmulation?: {
        deviceName?: string;
        deviceMetrics?: {
            width: number;
            height: number;
            pixelRatio: number;
        };
        userAgent?: string;
    };
    /**
     * An optional dictionary that specifies performance logging preferences
     */
    perfLoggingPrefs?: {
        /**
         * Whether or not to collect events from Network domain.
         * @type {boolean}
         */
        enableNetwork?: boolean;
        /**
         * Whether or not to collect events from Page domain.
         * @type {boolean}
         */
        enablePage?: boolean;
        /**
         * Whether or not to collect events from Timeline domain.
         * Note: when tracing is enabled, Timeline domain is implicitly disabled, unless enableTimeline is explicitly set to true.
         * (false if tracing is enabled)
         * @type {boolean}
         */
        enableTimeline?: boolean;
        /**
         * A comma-separated string of Chrome tracing categories for which trace events should be collected.
         * An unspecified or empty string disables tracing.
         * (empty)
         * @type {string}
         */
        tracingCategories?: string;
        /**
         * The requested number of milliseconds between DevTools trace buffer usage events.
         * For example, if 1000, then once per second, DevTools will report how full the trace buffer is.
         * If a report indicates the buffer usage is 100%, a warning will be issued.
         * (positive integer 1000)
         * @type {number}
         */
        bufferUsageReportingInterval?: number;
    };
}
