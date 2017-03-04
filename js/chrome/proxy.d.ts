import { Base } from '../browser/base';
import { ChromeExtension } from './extension';
export interface ChromeProxy extends ChromeExtension {
}
export declare class ChromeProxy extends Base {
    clearProxy(): Promise<any>;
    setProxy(proxy?: string): Promise<any>;
}
