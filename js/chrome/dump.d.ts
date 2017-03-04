import { Base } from '../browser/base';
import { ChromeExtension } from './extension';
import { CommandHistory } from '../browser/command-history';
import { Getter } from '../browser/getter';
import { Screenshot } from '../browser/screenshot';
export interface ChromeDump extends ChromeExtension, CommandHistory, Getter, Screenshot {
}
export declare class ChromeDump extends Base {
    saveAsMHTML(filePath: string): Promise<{}>;
    dump(dir?: string): Promise<{}[]>;
}
