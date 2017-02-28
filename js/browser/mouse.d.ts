import { Base, Selector } from './base';
import { Elements } from './elements';
import { Utils } from './utils';
export interface Mouse extends Utils, Elements {
}
export declare class Mouse extends Base {
    click(selector: Selector | Array<Selector>, pause?: number): Promise<void>;
    mouseDoubleClick(pause?: number): Promise<void>;
    mouseButtonClick(button?: 0 | 1 | 2, pause?: number): Promise<void>;
    mouseButtonUp(button?: 0 | 1 | 2, pause?: number): Promise<void>;
    mouseButtonDown(button?: 0 | 1 | 2, pause?: number): Promise<void>;
    mouseMoveTo(selector: Selector, xoffset?: number, yoffset?: number, pause?: number): Promise<void>;
    mouseMoveBy(xoffset: number, yoffset: number, pause?: number): Promise<void>;
    mouseClickTo(selector: Selector, xoffset?: number, yoffset?: number): Promise<void>;
    mouseClickBy(xoffset: number, yoffset: number): Promise<void>;
    dragAndDrop(pause?: number): Promise<void>;
}
