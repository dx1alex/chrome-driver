"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../browser/base");
class ChromeExtension extends base_1.Base {
    extension(code, ...args) {
        let script = '' + code;
        if (typeof code === 'function') {
            script = `return (${script}).apply(null, arguments)`;
        }
        return this.executeAsync(async (code, args) => {
            const extensionId = '9d009613-1f79-4455-b5d2-f5fe09bbe044';
            const res = await sendMessageToExtension(extensionId, { code, args });
            if (res.error)
                throw res.error;
            return res.message;
        }, script, args);
    }
}
exports.ChromeExtension = ChromeExtension;
