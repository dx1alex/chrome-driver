import { Base, Selector, WebElement } from './base';
export declare class Elements extends Base {
    element(): Promise<WebElement>;
    element(selector: Selector, parent?: Selector): Promise<WebElement>;
    elements(selector: Selector, parent?: Selector): Promise<WebElement[]>;
    elementId(selector: Selector): Promise<string>;
}
