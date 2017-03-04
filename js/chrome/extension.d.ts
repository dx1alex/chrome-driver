import { Base } from '../browser/base';
import { Exec } from '../browser/exec';
export interface ChromeExtension extends Exec {
}
export declare class ChromeExtension extends Base {
    extension(code: string | Function, ...args: any[]): Promise<any>;
}
