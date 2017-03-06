import { Base, Selector } from './base';
import { Elements } from './elements';
import { Exec } from './exec';
import { Tabs } from './tabs';
import { Navigate } from './navigate';
import { PromisefyString } from './promisefy-string';
export interface Getter extends Elements, Exec, Tabs, Navigate {
}
export declare abstract class Getter extends Base {
    tagName(selector: Selector): Promise<string>;
    attr(selector: Selector, attr: string): Promise<string>;
    prop<T>(selector: Selector, prop: string): Promise<T>;
    css(selector: Selector, propertyName: string): Promise<string>;
    classList(selector: Selector): Promise<string[]>;
    size(selector: Selector): Promise<{
        width: number;
        height: number;
    }>;
    location(selector: Selector): Promise<{
        x: number;
        y: number;
    }>;
    locationInView(selector: Selector): Promise<{
        x: number;
        y: number;
    }>;
}
export interface Getter {
    html: GetterHtml;
    text: GetterText;
    title: GetterTitle;
}
export interface GetterHtml extends PromisefyString {
    (selector?: Selector): Promise<string>;
}
export interface GetterText extends PromisefyString {
    (selector?: Selector): Promise<string>;
}
export interface GetterTitle extends PromisefyString {
    (): Promise<string>;
}
