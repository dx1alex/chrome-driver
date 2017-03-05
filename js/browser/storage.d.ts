import { Base } from './base';
export declare abstract class Storage extends Base {
    localStorage(): Promise<string[]>;
    localStorage(key: string): Promise<string>;
    localStorage(key: string, value: string): Promise<void>;
    deleteLocalStorage(): Promise<void>;
    deleteLocalStorage(key: string): Promise<void>;
}
