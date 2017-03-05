import { Base, Selector } from './base';
import { Elements } from './elements';
import { Exec } from './exec';
import { Tabs } from './tabs';
import { Navigate } from './navigate';
export interface Getter extends Elements, Exec, Tabs, Navigate {
}
export declare abstract class Getter extends Base {
    title(): Promise<string>;
    html(selector?: Selector): Promise<string>;
    text(selector?: Selector): Promise<string>;
    tagName(selector: Selector): Promise<string>;
    attr(selector: Selector, attr: string): Promise<string>;
    prop(selector: Selector, prop: string): Promise<any>;
    css(selector: Selector, propertyName: string): Promise<string>;
    classList(selector: Selector): Promise<string[]>;
    size(selector: Selector): Promise<{
        width: number;
        height: number;
    }>;
    location(selector: Selector): Promise<{
        x: number;
        y: number;
    }>;
    locationInView(selector: Selector): Promise<{
        x: number;
        y: number;
    }>;
}
