/// <reference types="node" />
import { Base } from './base';
import { Utils } from './utils';
import * as URL from 'url';
export interface Navigate extends Utils {
}
export declare class Navigate extends Base {
    go(url: string, pause?: number): Promise<void>;
    refresh(pause?: number): Promise<void>;
    back(pause?: number): Promise<void>;
    forward(pause?: number): Promise<void>;
}
export interface Navigate {
    url: NavigateUrl;
}
export interface NavigateUrl extends String {
    (url?: string, pause?: number): Promise<string>;
    parse: () => URL.Url;
}
