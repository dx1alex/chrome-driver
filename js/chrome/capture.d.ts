import { Base } from '../browser/base';
import { ChromeExtension } from './extension';
export interface ChromeCapture extends ChromeExtension {
}
export declare class ChromeCapture extends Base {
    captureTab(): Promise<string>;
}
