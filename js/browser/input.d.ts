import { UnicodeKeys } from '../helpers';
import { Base, Selector } from './base';
import { Elements } from './elements';
import { Getter } from './getter';
import { Exec } from './exec';
import { Mouse } from './mouse';
import { Utils } from './utils';
export interface Input extends Utils, Elements, Getter, Exec, Mouse {
}
export declare abstract class Input extends Base {
    keys(selector: Selector, ...keys: Array<number | boolean | string | Array<UnicodeKeys>>): Promise<void>;
    type(selector: Selector, ...keys: Array<number | boolean | string | Array<UnicodeKeys>>): Promise<void>;
    sendKeys(...keys: Array<string | Array<UnicodeKeys>>): Promise<void>;
    hotkeys(...keys: Array<string | Array<UnicodeKeys>>): Promise<void>;
    clear(selector: Selector): Promise<void>;
    empty(selector: Selector): Promise<void>;
    submit(selector: Selector, pause?: number): Promise<void>;
    check(checkbox: Selector, pause?: number): Promise<boolean>;
    uncheck(checkbox: Selector, pause?: number): Promise<boolean>;
    uploadFile(input_file: Selector, filePath: string, pause?: number): Promise<void>;
    select(select: Selector, option: object | number | string, submit?: boolean | number, pause?: number | boolean): Promise<void>;
    unselect(select: Selector, option: object | number | string, submit?: boolean | number, pause?: number | boolean): Promise<void>;
    selectUnselect(check: boolean, select: Selector, option: object | number | string, ...submitAndPause: (boolean | number)[]): Promise<void>;
    form(form: Selector, inputs: any, ...submitAndPause: (boolean | number)[]): Promise<void>;
}
