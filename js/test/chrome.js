"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("../");
let options = {
    remote: 'http://localhost:9500',
    window: [0, 0, 1200, 800],
    log: true,
    //verbose: true,
    dataDir: '/tmp/test0',
    ifActiveSession: 'restart'
};
const bro = new _1.Chrome(options);
main();
async function main() {
    try {
        console.log(await bro.getStatus());
        await bro.start();
        console.log(bro.capabilities);
        await bro.go('http://ya.ru');
        console.log(bro.lastCommand());
    }
    catch (err) {
        console.error(bro.lastError(err));
    }
}
