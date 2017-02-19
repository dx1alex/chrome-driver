import { Selector, Base } from './base';
import { Elements } from './elements';
export interface Exec extends Elements {
}
export declare class Exec extends Base {
    execute(code: string | Function, ...args: any[]): Promise<any>;
    executeAsync(code: string | Function, ...args: any[]): Promise<any>;
    script(selector: Selector | Selector[], code: string | Function, ...args: any[]): Promise<any>;
    scriptAll(selector: Selector | Selector[], code: string | Function, ...args: any[]): Promise<any>;
    scriptAllAsync(selector: Selector | Selector[], code: string | Function, ...args: any[]): Promise<any>;
    scriptAsync(selector: Selector | Selector[], code: string | Function, ...args: any[]): Promise<any>;
}
