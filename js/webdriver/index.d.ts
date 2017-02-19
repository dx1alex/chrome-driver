/// <reference types="node" />
import * as http from 'http';
import * as https from 'https';
export declare class Webdriver {
    debug: WebdriverDebug;
    options: WebdriverOptions;
    sessionId: string;
    constructor(options: WebdriverOptions | string);
    initSession(capabilities: {
        desiredCapabilities: Capabilities;
    }): Promise<{
        sessionId: string;
        value: Capabilities;
    }>;
    request(options: https.RequestOptions, postData?: string): Promise<any>;
    protected writeLog(data: any): void;
    protected formatLog(data: any): string;
    private _requestHandler(command, method, path, postData?);
}
export interface WebdriverLog {
    status: 'ERROR' | 'INFO';
    command: keyof WebdriverCommands;
    method: string;
    url: string;
    postData: string;
    statusCode: string | number;
    data: string;
}
export interface WebdriverOptions extends https.RequestOptions, http.RequestOptions {
    url: string;
    debug?: WebdriverDebug | boolean;
}
export interface WebdriverDebug {
    disableLog?: boolean;
    logId?: string;
    stdout?: typeof process.stdout | string | boolean;
    stderr?: typeof process.stderr | string | boolean;
    format?: (logId: string, data: any) => string;
}
export interface Proxy {
    proxyType: 'direct' | 'manual' | 'pac' | 'autodetect' | 'system';
    proxyAutoconfigUrl?: string;
    ftpProxy?: string;
    httpProxy?: string;
    sslProxy?: string;
    socksProxy?: string;
    socksUsername?: string;
    socksPassword?: string;
    noProxy?: string;
}
export interface Capabilities {
    browserName: string;
    version?: string;
    platform?: string;
    javascriptEnabled?: boolean;
    takesScreenshot?: boolean;
    handlesAlerts?: boolean;
    databaseEnabled?: boolean;
    locationContextEnabled?: boolean;
    applicationCacheEnabled?: boolean;
    browserConnectionEnabled?: boolean;
    cssSelectorsEnabled?: boolean;
    webStorageEnabled?: boolean;
    rotatable?: boolean;
    acceptSslCerts?: boolean;
    nativeEvents?: boolean;
    proxy?: Proxy;
    [key: string]: any;
}
export declare type LocatorStrategy = 'class name' | 'css selector' | 'id' | 'name' | 'link text' | 'partial link text' | 'tag name' | 'xpath';
export interface Cookie {
    name: string;
    value: string;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    expiry?: number;
}
export interface Timeouts {
    implicit?: number;
    script?: number;
    'page load'?: number;
}
export interface Webdriver extends WebdriverCommands {
}
export interface WebdriverCommands {
    initSession(capabilities: {
        desiredCapabilities: Capabilities;
    }): Promise<{
        sessionId: string;
        value: Capabilities;
    }>;
    status(): Promise<any>;
    getSession(options: {
        sessionId: string;
    }): Promise<Capabilities>;
    getSessions(options: {
        sessionId: string;
    }): Promise<Array<{
        id: string;
        capabilities: Capabilities;
    }>>;
    deleteSession(options: {
        sessionId: string;
    }): Promise<void>;
    setTimeouts(options: {
        type: keyof Timeouts;
        ms: number;
    }): Promise<void>;
    setAsyncScriptTimeout(options: {
        ms: number;
    }): Promise<void>;
    setImplicitWaitTimeout(options: {
        ms: number;
    }): Promise<void>;
    getWindowHandle(): Promise<string>;
    getWindowHandles(): Promise<string[]>;
    switchToWindow(options: {
        name: string;
    }): Promise<void>;
    closeWindow(): Promise<void>;
    setWindowSize(options: {
        windowHandle: string;
        width: number;
        height: number;
    }): Promise<any>;
    getWindowSize(options: {
        windowHandle: string;
    }): Promise<{
        width: number;
        height: number;
    }>;
    setWindowPosition(options: {
        windowHandle: string;
        x: number;
        y: number;
    }): Promise<any>;
    getWindowPosition(options: {
        windowHandle: string;
    }): Promise<{
        x: number;
        y: number;
    }>;
    maximizeWindow(options: {
        windowHandle: string | 'current';
    }): Promise<void>;
    switchToFrame(options: {
        id: string | number | null | {
            ELEMENT: string;
        };
    }): Promise<void>;
    switchToParentFrame(): Promise<void>;
    getCurrentURL(): Promise<string>;
    go(options: {
        url: string;
    }): Promise<void>;
    goForward(): Promise<void>;
    goBack(): Promise<void>;
    refresh(): Promise<void>;
    getSource(): Promise<string>;
    getTitle(): Promise<string>;
    getAllCookies(): Promise<Cookie[]>;
    setCookie(options: {
        cookie: Cookie;
    }): Promise<void>;
    deleteAllCookies(): Promise<void>;
    deleteCookie(options: {
        name: string;
    }): Promise<void>;
    setAlertText(options: {
        text: string;
    }): Promise<void>;
    getAlertText(): Promise<string>;
    acceptAlert(): Promise<void>;
    dismissAlert(): Promise<void>;
    keys(options: {
        value: string[];
    }): Promise<void>;
    executeScript(options: {
        script: string;
        args?: any[];
    }): Promise<any>;
    executeAsyncScript(options: {
        script: string;
        args: any[];
    }): Promise<any>;
    screenshot(): Promise<string>;
    findElement(options: {
        using: LocatorStrategy;
        value: string;
    }): Promise<{
        ELEMENT: string;
    }>;
    findElements(options: {
        using: LocatorStrategy;
        value: string;
    }): Promise<{
        ELEMENT: string;
    }[]>;
    getActiveElement(): Promise<{
        ELEMENT: string;
    }>;
    findChildElement(options: {
        id: string;
        using: LocatorStrategy;
        value: string;
    }): Promise<{
        ELEMENT: string;
    }>;
    findChildElements(options: {
        id: string;
        using: LocatorStrategy;
        value: string;
    }): Promise<{
        ELEMENT: string;
    }[]>;
    click(options: {
        id: string;
    }): Promise<void>;
    clear(options: {
        id: string;
    }): Promise<void>;
    submit(options: {
        id: string;
    }): Promise<void>;
    keysElement(options: {
        id: string;
        value: string[];
    }): Promise<void>;
    getElementText(options: {
        id: string;
    }): Promise<string>;
    getElementTagName(options: {
        id: string;
    }): Promise<string>;
    getElementAttribute(options: {
        id: string;
    }): Promise<string>;
    getElementCssProperty(options: {
        id: string;
        propertyName: string;
    }): Promise<string>;
    getElementSize(options: {
        id: string;
    }): Promise<{
        width: number;
        height: number;
    }>;
    getElementLocation(options: {
        id: string;
    }): Promise<{
        x: number;
        y: number;
    }>;
    getElementLocationInView(options: {
        id: string;
    }): Promise<{
        x: number;
        y: number;
    }>;
    isElementSelected(options: {
        id: string;
    }): Promise<boolean>;
    isElementEnabled(options: {
        id: string;
    }): Promise<boolean>;
    isElementEqual(options: {
        id: string;
        other: string;
    }): Promise<boolean>;
    isElementDysplayed(options: {
        id: string;
    }): Promise<boolean>;
    mouseMoveTo(options: {
        element?: string;
        xoffset?: number;
        yoffset?: number;
    }): Promise<void>;
    mouseDoubleClick(): Promise<void>;
    mouseClick(options: {
        button?: 0 | 1 | 2;
    }): Promise<void>;
    mouseDown(options: {
        button?: 0 | 1 | 2;
    }): Promise<void>;
    mouseUp(options: {
        button?: 0 | 1 | 2;
    }): Promise<void>;
    touchClick(options: {
        element: string;
    }): Promise<void>;
    touchDown(options: {
        x: number;
        y: number;
    }): Promise<void>;
    touchUp(options: {
        x: number;
        y: number;
    }): Promise<void>;
    touchMove(options: {
        x: number;
        y: number;
    }): Promise<void>;
    touchScroll(options: {
        element?: string;
        xoffset: number;
        yoffset: number;
    }): Promise<void>;
    touchDoubleClick(options: {
        element: string;
    }): Promise<void>;
    touchLongClick(options: {
        element: string;
    }): Promise<void>;
    touchFlick(options: {
        element?: string;
        xoffset?: number;
        yoffset?: number;
        speed?: number;
        xspeed?: number;
        yspeed?: number;
    }): Promise<void>;
    getOrientation(): Promise<'LANDSCAPE' | 'PORTRAIT'>;
    setOrientation(options: {
        orientation: 'LANDSCAPE' | 'PORTRAIT';
    }): Promise<void>;
    getGeoLocation(): Promise<{
        latitude: number;
        longitude: number;
        altitude: number;
    }>;
    setGeoLocation(options: {
        latitude: number;
        longitude: number;
        altitude: number;
    }): Promise<void>;
    getLocalStorageKeys(): Promise<string[]>;
    setLocalStorage(options: {
        key: string;
        value: string;
    }): Promise<void>;
    clearLocalStorage(): Promise<void>;
    getLocalStorageValue(options: {
        key: string;
    }): Promise<string>;
    deleteLocalStorageValue(options: {
        key: string;
    }): Promise<void>;
    getLocalStorageSize(): Promise<number>;
    getSessionStorageKeys(): Promise<string[]>;
    setSessionStorage(options: {
        key: string;
        value: string;
    }): Promise<void>;
    deleteSessionStorage(): Promise<void>;
    getSessionStorageValue(options: {
        key: string;
    }): Promise<string>;
    deleteSessionStorageValue(options: {
        key: string;
    }): Promise<void>;
    getSessionStorageSize(): Promise<number>;
}
