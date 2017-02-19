import { Base, Selector } from './base';
import { Elements } from './elements';
export interface Frames extends Elements {
}
export declare class Frames extends Base {
    switchFrame(frame: Selector | number | null): Promise<void>;
    switchParentFrame(): Promise<void>;
}
