import { Base } from "./base";
import { Utils } from './utils';
export interface Navigate extends Utils {
}
export declare class Navigate extends Base {
    url(url: string, pause?: number): Promise<string>;
    go(url: string, pause?: number): Promise<void>;
    refresh(pause?: number): Promise<void>;
    back(pause?: number): Promise<void>;
    forward(pause?: number): Promise<void>;
}
