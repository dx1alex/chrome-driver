import { Base, Selector } from './base';
import { UnicodeKeys } from '../helpers/';
import { Elements } from './elements';
export interface $Class extends Elements {
}
export declare class $Class extends Base {
    private static _$List;
    $(selector: Selector): Browser$;
}
export interface Browser$ {
    script(code: string | Function, ...args: any[]): Promise<any>;
    scriptAll(code: string | Function, ...args: any[]): Promise<any>;
    scriptAllAsync(code: string | Function, ...args: any[]): Promise<any>;
    scriptAsync(code: string | Function, ...args: any[]): Promise<any>;
    html(): Promise<string>;
    text(): Promise<string>;
    tagName(): Promise<string>;
    attr(attr: string): Promise<string>;
    prop(prop: string): Promise<string>;
    css(propertyName: string): Promise<string>;
    classList(): Promise<string[]>;
    size(): Promise<{
        width: number;
        height: number;
    }>;
    location(): Promise<{
        x: number;
        y: number;
    }>;
    locationInView(): Promise<{
        x: number;
        y: number;
    }>;
    keys(...keys: Array<number | boolean | string | Array<UnicodeKeys>>): Promise<void>;
    type(...keys: Array<number | boolean | string | Array<UnicodeKeys>>): Promise<void>;
    clear(): Promise<void>;
    empty(): Promise<void>;
    submit(pause?: number): Promise<void>;
    check(pause?: number): Promise<boolean>;
    uncheck(pause?: number): Promise<boolean>;
    uploadFile(input_file: Selector, filePath: string, pause?: number): Promise<void>;
    select(select: Selector, option: object | number | string, submit?: boolean | number, pause?: number | boolean): Promise<void>;
    unselect(select: Selector, option: object | number | string, submit?: boolean | number, pause?: number | boolean): Promise<void>;
    form(form: Selector, inputs: any, ...submitAndPause: (boolean | number)[]): Promise<void>;
    click(pause?: number): Promise<void>;
    mouseMoveTo(xoffset?: number, yoffset?: number, pause?: number): Promise<void>;
    mouseClickTo(xoffset?: number, yoffset?: number): Promise<void>;
    isExists(): Promise<boolean>;
    isSelected(): Promise<boolean>;
    isEnabled(): Promise<boolean>;
    isFocused(): Promise<boolean>;
    isReadonly(): Promise<boolean>;
    isVisible(): Promise<boolean>;
    hasText(text: string | RegExp): Promise<boolean>;
    hasClass(name: string): Promise<boolean>;
    hasAttribute(attr: string): Promise<boolean>;
}
