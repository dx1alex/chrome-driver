import { Base, Selector, WebElement } from './base';
export declare class Elements extends Base {
    getElement(): Promise<WebElement | null>;
    getElement(selector: Selector, parent?: Selector): Promise<WebElement | null>;
    element(): Promise<WebElement>;
    element(selector: Selector, parent?: Selector): Promise<WebElement>;
    elements(selector: Selector, parent?: Selector): Promise<WebElement[]>;
    elementId(selector: Selector, parent?: Selector): Promise<string>;
}
