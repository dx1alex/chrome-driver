export * from '../webdriver';
import { Webdriver, Capabilities, Timeouts, LocatorStrategy } from '../webdriver';
export declare class Base {
    options: BrowserOptions;
    webdriver: Webdriver;
    capabilities: Capabilities;
    sessionId: string;
    started: boolean;
    protected _thisProxy: this;
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
export interface BrowserOptions {
    proxy?: string;
    url?: string;
    maximaze?: boolean;
    windowSize?: [number, number];
    windowPosition?: [number, number];
    timeouts?: Timeouts;
    useragent?: string;
    desiredCapabilities?: Capabilities;
    waitTimeout?: number;
    waitInterval?: number;
    pause?: PauseSettings;
}
