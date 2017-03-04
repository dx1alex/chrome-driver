import { Base } from '../browser/base';
import { ChromeExtension } from './extension';
export interface ChromeTabs extends ChromeExtension {
}
export declare class ChromeTabs extends Base {
    fullscreen(): Promise<any>;
}
