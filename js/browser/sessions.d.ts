import { Base, Capabilities } from './base';
export declare class Sessions extends Base {
    getSession(sessionId?: string): Promise<Capabilities>;
    deleteSession(sessionId: string): Promise<void>;
    getSessions(): Promise<{
        id: string;
        capabilities: Capabilities;
    }[]>;
}
