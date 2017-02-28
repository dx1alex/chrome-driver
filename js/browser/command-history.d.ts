import { Base } from './base';
export declare class CommandHistory extends Base {
    protected _lastError: CommandHistoryObject;
    protected _lastCommand: CommandHistoryObject;
    commandHistory: CommandHistoryObject[];
    getCommandHistory(endItems?: number): CommandHistoryObject[];
    getCommandHistoryErrors(endItems?: number): CommandHistoryObject[];
    lastError(err?: any): any;
    lastCommand(): CommandHistoryObject;
}
export interface CommandHistoryObject {
    command: string;
    args: any[];
    date: Date;
    stack: string;
    error?: any;
    result?: any;
    time?: number;
}
