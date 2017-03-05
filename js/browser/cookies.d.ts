import { Base, Cookie } from './base';
export declare abstract class Cookies extends Base {
    setCookie(cookie: Cookie): Promise<void>;
    getCookies(): Promise<Cookie[]>;
    deleteCookie(name: string): Promise<void>;
    deleteAllCookies(): Promise<void>;
}
