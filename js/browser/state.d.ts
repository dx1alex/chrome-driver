import { Selector, Base } from './base';
import { Elements } from './elements';
import { Exec } from './exec';
import { Getter } from './getter';
export interface State extends Elements, Exec, Getter {
}
export declare class State extends Base {
    isExists(selector: Selector): Promise<boolean>;
    notExists(selector: Selector): Promise<boolean>;
    isSelected(selector: Selector): Promise<boolean>;
    isEnabled(selector: Selector): Promise<boolean>;
    isFocused(selector: Selector): Promise<boolean>;
    isReadonly(selector: Selector): Promise<boolean>;
    isVisible(selector: Selector): Promise<boolean>;
    hasText(selector: Selector, text: string | RegExp): Promise<boolean>;
    hasClass(selector: Selector, name: string): Promise<boolean>;
    hasAttribute(selector: Selector, attr: string): Promise<boolean>;
}
