"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("../");
let options = {
    remote: 'http://localhost:9500',
    window: [0, 0, 1200, 800],
    log: true,
    //verbose: true,
    timeouts: { script: 10000 },
    dataDir: '/tmp/test',
    ifActiveSession: 'restart'
};
// let websocket: WebSocket
// const wss = new WebSocket.Server({
//   port: 8080
// })
// wss.on('connection', ws => {
//   websocket = ws
//   ws.on('message', message => {
//     console.log(message)
//     if (message === 'ping') return ws.send('pong')
//   })
// })
const bro = new _1.Chrome(options);
bro.setArgs('load-extension', '/home/dx1/work/ext/test');
main();
async function main() {
    try {
        //console.log(await chrome.getStatus())
        await bro.start();
        console.log(bro.sessionId);
        console.time('async');
        // await bro.execute(async () => {
        //   return fetch('http://adifgidpakahghppcfdelejcfgnpdenj')
        //     .then(r => r.url)
        //     .then(message => {
        //       console.log(message)
        //     })
        //   // let iframe = document.createElement('iframe')
        //   // iframe.setAttribute('name', 'xxx')
        //   // let form = document.createElement('form')
        //   // form.setAttribute('action', 'http://adifgidpakahghppcfdelejcfgnpdenj/jjjj')
        //   // form.setAttribute('target', 'xxx')
        //   // document.body.appendChild(form)
        //   // document.body.appendChild(iframe)
        //   // form.submit()
        //   // setTimeout(() => {
        //   //   console.log(iframe.contentWindow.document.body.textContent)
        //   // }, 1000)
        //   //fetch('chrome://version') ->text() ->>done
        // })
        // await bro.switchFrame('iframe')
        // let t = await bro.text()
        // console.log(t)
        console.timeEnd('async');
        //websocket.send('ping')
        // await bro.go('http://ya.ru')
        // //await chrome.keys('#text', 'sex', 1000, true, 3000)
        // const $text = bro.$('#text')
        // await $text.location()
        // await $text.tagName()
        // await $text.submit(1000)
        console.log(bro.lastCommand());
        //await chrome.quit()
        //console.log(chrome.getCommandHistory())
        //await chrome.go('http://dating.ru/reg.php')
        //await chrome.$('body').classList()
        // await chrome.form('form[name="reg"]', {
        //   email: 'xxx@xxx.ru',
        //   password1: 'xxxxx',
        //   password2: 'xxxxx',
        //   flogin: 'xxx555',
        //   fname: 'John',
        //   birthday: 10,
        //   birthmonth: "12",
        //   birthyear: "1982",
        //   gender: "M",
        //   city: '101_6695_2990240',
        //   sF: true,
        //   sFF: true,
        //   get_notify: false,
        //   get_maillist: true,
        //   submit: true
        // }, 1000)
        //console.log(chrome.getCommandHistory())
        // console.log('ok')
        //await chrome.go('http://htmlbook.ru/html/select')
        //await chrome.click('.example-view img')
        //await chrome.click(['#metro_name', 'option[value="11461"]', '#metro_name'], 1000)
        // let ok = await chrome.waitFor({ timeout: 3000, nothrow: true }).isSelected('#text')
        // console.log('ok', ok)
        // let els = await chrome.elements('#metro_name option')
        // console.log(els[10])
        //await chrome.select(null, { label: "Январь", value: "1" })
        //await chrome.select(null, { label: "Январь", value: "1" }, true)
        // let s = await chrome.check('option[value="Крокодил Гена"]')
        // console.time('time')
        // let ok = await chrome.waitUntil(() => chrome.isSelected('select[name="select2"] option:nth-child(3)'), {
        //   timeout: 16000,
        //   interval: 7000,
        //   message: 'oops',
        //   nothrow: false
        // })
        // await chrome.select('select[name="select"]', [1, 3], 2000)
        // await chrome.select('select[name="select2"]', [1, 3], 2000, true, 5000)
        // console.log('ok')
        // await chrome.back(3000)
        // await chrome.quit()
        // console.log(s)
        //await chrome.scriptAll('#metro_name option', (el: HTMLElement) => el[10].setAttribute('selected', 'true'))
        //await chrome.click(els[10])
        //await chrome.locationInView('option[value="Крыса Лариса"]')
        //await chrome.click('option[value="11461"]')
    }
    catch (err) {
        console.error(bro.lastError(err));
    }
}
