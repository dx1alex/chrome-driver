"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chrome_1 = require("../chrome");
let options = {
    remote: 'http://localhost:9500',
    window: [0, 0, 1200, 800],
    //log: 'console.info',
    dataDir: '/tmp/test0',
    onSessionExests: 'restart',
};
const bro = new chrome_1.Chrome(options);
main();
async function main() {
    try {
        await bro.start();
        let url = await bro.url.parse();
        url = await bro.url.startsWith('https://vk.com');
        console.log('url', url);
        console.log(JSON.stringify(bro.lastCommand()));
    }
    catch (err) {
        console.error(bro.lastError(err));
    }
}
