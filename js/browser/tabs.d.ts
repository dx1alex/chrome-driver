import { Base } from './base';
import { Exec } from './exec';
export interface Tabs extends Exec {
}
export declare class Tabs extends Base {
    maximize(windowHandle?: string): Promise<void>;
    setPosition(x: number, y: number, windowHandle?: string): Promise<any>;
    getPosition(windowHandle?: string): Promise<{
        x: number;
        y: number;
    }>;
    setSize(width: number, height: number, windowHandle?: string): Promise<any>;
    getSize(windowHandle?: string): Promise<{
        width: number;
        height: number;
    }>;
    getViewSize(): Promise<{
        width: number;
        height: number;
    }>;
    getTab(): Promise<string>;
    getTabs(): Promise<string[]>;
    switchTab(name: string): Promise<void>;
    closeTab(name?: string): Promise<void>;
    newTab(switchTo?: boolean): Promise<string>;
    newTab(url: string, switchTo?: boolean): Promise<string>;
}
