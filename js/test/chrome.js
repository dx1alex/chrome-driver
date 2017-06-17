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
const bro = new chrome_1.Chrome(options);
main();
async function main() {
    try {
        await bro.start('http://m.vk.com');
        await bro.capture('#mhead > a > div', './1.png');
    }
    catch (err) {
        console.error(bro.lastError(err));
    }
}
