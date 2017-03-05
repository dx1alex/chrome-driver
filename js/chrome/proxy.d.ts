import { Base } from '../browser/base';
import { ChromeExtension } from './extension';
export interface ChromeProxy extends ChromeExtension {
}
export declare abstract class ChromeProxy extends Base {
    clearProxy(): Promise<{}>;
    setProxy(proxy?: string): Promise<{}>;
}
