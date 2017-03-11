"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chrome_1 = require("../chrome");
let options = {
    remote: 'http://localhost:9500',
    window: [0, 0, 1200, 800],
    //log: 'console.info',
    dataDir: '/tmp/test0',
    onSessionExists: 'restart',
};
class C extends chrome_1.Chrome {
    constructor(options) {
        super(options);
    }
    isMob() {
        return this._.url.startsWith('https://m.vk.com');
    }
}
const bro = new C(options);
main();
async function main() {
    try {
        await bro.start('https://m.vk.com');
        let url = await bro.url.parse();
        url = await bro.url.startsWith('https://vk.com');
        console.log('url', url);
        console.log('is mob', await bro.isMob());
        let title = await bro.title.toUpperCase();
        console.log('title', title);
        console.log(JSON.stringify(bro.lastCommand()));
    }
    catch (err) {
        console.error(bro.lastError(err));
    }
}
