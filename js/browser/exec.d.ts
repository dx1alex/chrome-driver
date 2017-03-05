import { Selector, Base } from './base';
import { Elements } from './elements';
export interface Exec extends Elements {
}
export declare abstract class Exec extends Base {
    execute<T>(code: string | Function, ...args: any[]): Promise<T>;
    executeAsync<T>(code: string | Function, ...args: any[]): Promise<T>;
    script<T>(selector: Selector | Selector[], code: string | Function, ...args: any[]): Promise<T>;
    scriptAll<T>(selector: Selector | Selector[], code: string | Function, ...args: any[]): Promise<T>;
    scriptAllAsync<T>(selector: Selector | Selector[], code: string | Function, ...args: any[]): Promise<T>;
    scriptAsync<T>(selector: Selector | Selector[], code: string | Function, ...args: any[]): Promise<T>;
}
