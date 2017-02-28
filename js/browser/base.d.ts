export * from '../webdriver';
import { Webdriver, Capabilities, Timeouts, LocatorStrategy } from '../webdriver';
export declare abstract class Base {
    options: BrowserOptions;
    webdriver: Webdriver;
    capabilities: Capabilities;
    sessionId: string;
    started: boolean;
    protected _this_proxy: this;
    protected readonly _: this;
}
export interface PauseSettings {
    click?: number;
    navigate?: number;
    mouse?: number;
    keys?: number;
    submit?: number;
    upload?: number;
}
export interface WebElement {
    ELEMENT: string;
    using?: LocatorStrategy | [LocatorStrategy, LocatorStrategy];
    value?: string | [string, string];
    index?: number;
}
export declare type Selector = string | WebElement;
export interface BrowserOptions extends BrowserStartOptions {
    remote: string;
    log?: string | boolean;
    verbose?: boolean;
    waitTimeout?: number;
    waitInterval?: number;
    pause?: PauseSettings;
    noCommandHistory?: boolean;
}
export interface BrowserStartOptions {
    proxy?: string;
    url?: string;
    maximaze?: boolean;
    windowSize?: number[];
    windowPosition?: number[];
    window?: number[];
    timeouts?: Timeouts;
    desiredCapabilities?: Capabilities;
}
