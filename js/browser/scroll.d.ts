import { Base, Selector } from './base';
import { Exec } from './exec';
import { Tabs } from './tabs';
export interface Scroll extends Exec, Tabs {
}
export declare abstract class Scroll extends Base {
    scroll(selector: Selector, alignToTop?: boolean | 'top' | 'bottom' | 'center', offsetTop?: number): Promise<void>;
    scrollToElement(selector: Selector, parent: Selector, alignToTop?: boolean | 'top' | 'bottom' | 'center', offsetTop?: number): void;
    scrollBy(top: number, left?: number): Promise<void>;
    scrollBy(selector: Selector, top: number, left?: number): Promise<void>;
    scrollTo(top?: number, left?: number): Promise<void>;
    scrollTo(selector: Selector, top: number, left?: number): Promise<void>;
    scrollTop(selector: Selector, px: number): Promise<number>;
    scrollLeft(selector: Selector, px: number): Promise<number>;
}
