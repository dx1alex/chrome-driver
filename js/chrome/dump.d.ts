import { Base } from '../browser/base';
import { ChromeExtension } from './extension';
import { CommandHistory } from '../browser/command-history';
import { Getter } from '../browser/getter';
import { Screenshot } from '../browser/screenshot';
export interface ChromeDump extends ChromeExtension, CommandHistory, Getter, Screenshot {
}
export declare abstract class ChromeDump extends Base {
    saveAsMHTML(filePath: string): Promise<string>;
    dump(dir?: string): Promise<[void, void, string, string, string]>;
}
