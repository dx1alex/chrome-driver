import { Base, Timeouts } from './base';
export declare abstract class Timeout extends Base {
    setTimeouts(timeouts: Timeouts): Promise<void>;
}
