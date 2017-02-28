import { Base, Selector, PauseSettings } from './base';
import { Elements } from './elements';
export interface Utils extends Elements {
}
export declare class Utils extends Base {
    pause(action: keyof PauseSettings, value: number): void;
    pause(options: PauseSettings): void;
    sleep(ms: number, ms2?: number): Promise<void>;
    sleeps(sec: number, sec2?: number): Promise<void>;
    waitUntil(fn: Function, settings: {
        timeout?: number;
        interval?: number;
        message?: string;
        nothrow?: boolean;
    }): Promise<boolean | void>;
    waitUntil(fn: Function, timeout?: number, interval?: number): Promise<void>;
    waitFor(settings: {
        timeout?: number;
        interval?: number;
        message?: string;
        nothrow?: boolean;
    }): WaitFor;
    waitFor(timeout?: number, interval?: number): WaitFor;
}
export interface WaitFor {
    isExists(selector: Selector): Promise<boolean>;
    isSelected(selector: Selector): Promise<boolean>;
    isEnabled(selector: Selector): Promise<boolean>;
    isFocused(selector: Selector): Promise<boolean>;
    isReadonly(selector: Selector): Promise<boolean>;
    isVisible(selector: Selector): Promise<boolean>;
    hasText(selector: Selector, text: string | RegExp): Promise<boolean>;
    hasClass(selector: Selector, name: string): Promise<boolean>;
    hasAttribute(selector: Selector, attr: string): Promise<boolean>;
}
