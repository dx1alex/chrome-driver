import { Base, Selector } from './base';
import { Elements } from './elements';
import { Exec } from './exec';
import { Getter } from './getter';
import { Scroll } from './scroll';
export interface Screenshot extends Scroll, Getter, Elements, Exec {
}
export declare abstract class Screenshot extends Base {
    getImage(image: Selector, filePath?: string): Promise<string>;
    screenshot(filePath?: string | boolean, fullPage?: boolean): Promise<string>;
    capture(selector: Selector, filePath?: string | {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
    }, offset?: {
        x?: number;
        y?: number;
        w?: number;
        h?: number;
    }): Promise<string>;
    captureTab(): Promise<string>;
    getScreenshot(): Promise<string>;
}
