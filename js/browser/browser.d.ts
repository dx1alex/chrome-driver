export * from './base';
import { Base, BrowserOptions, BrowserStartOptions } from './base';
import { Exec } from './exec';
import { Elements } from './elements';
import { State } from './state';
import { Navigate } from './navigate';
import { Alert } from './alert';
import { Tabs } from './tabs';
import { Cookies } from './cookies';
import { Frames } from './frames';
import { Getter } from './getter';
import { Input } from './input';
import { Mouse } from './mouse';
import { Storage } from './storage';
import { Utils } from './utils';
import { Sessions } from './sessions';
import { Screenshot } from './screenshot';
import { Scroll } from './scroll';
import { Timeout } from './timeout';
import { CommandHistory } from './command-history';
import { $Class } from './$class';
export declare class Browser extends Base {
    protected static _no_command_history_list: string[];
    protected static _no_proxy_list: string[];
    constructor(options: BrowserOptions);
    getStatus(): Promise<any>;
    quit(): Promise<void>;
    start(options?: BrowserStartOptions): Promise<this>;
}
export interface Browser extends Scroll, Screenshot, Sessions, Utils, Storage, Mouse, Input, Getter, CommandHistory, Frames, Cookies, Tabs, Alert, Navigate, Exec, Elements, State, Timeout, $Class {
}
