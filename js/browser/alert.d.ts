import { Base } from "./base";
export declare class Alert extends Base {
    setAlert(text: string): Promise<void>;
    getAlert(): Promise<string>;
    okAlert(): Promise<void>;
    cancelAlert(): Promise<void>;
    alert(accept: boolean, text?: string): Promise<void>;
}
