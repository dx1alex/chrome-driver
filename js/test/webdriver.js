"use strict";
const webdriver_1 = require("../webdriver");
const wd = new webdriver_1.Webdriver({
    url: 'http://127.0.0.1:9515',
});
main();
async function main() {
    try {
        let status = await wd.status();
        console.log(status);
        let init = await wd.initSession({ desiredCapabilities: { browserName: 'chrome' } });
        console.log(init);
        // console.log(await wdp.getSession({ sessionId }))
        // console.log(await wdp.getSessions())
        // console.log(await wdp.setTimeouts({ sessionId, type: 'script', ms: 1000 }))
        // console.log(await wdp.setTimeouts({ sessionId, type: 'implicit', ms: 1000 }))
        // console.log(await wdp.setTimeouts({ sessionId, type: 'page load', ms: 1000 }))
        // console.log(await wdp.setAsyncScriptTimeout({ sessionId, ms: 1000 }))
        // console.log(await wdp.setImplicitWaitTimeout({ sessionId, ms: 1000 }))
        // let window = await wdp.getWindowHandle({ sessionId })
        // console.log(window)
        // let windowHandle = window.value
        // console.log(await wdp.getWindowHandles({ sessionId }))
        // console.log(await wdp.switchToWindow({ sessionId, name: windowHandle }))
        // console.log(await wdp.setWindowSize({ sessionId, windowHandle, width: 200, height: 300 }))
        // console.log(await wdp.getWindowSize({ sessionId, windowHandle }))
        // console.log(await wdp.setWindowPosition({ sessionId, windowHandle, x: 10, y: 30 }))
        // console.log(await wdp.getWindowPosition({ sessionId, windowHandle }))
        // console.log(await wdp.maximizeWindow({ sessionId, windowHandle }))
        // console.log(await wdp.closeWindow({ sessionId }))
        await wd.go({ url: 'http://ya.ru' });
        await wd.findElement({ using: 'css selector', value: '#khkh' });
        // console.log(await wdp.getCurrentURL({ sessionId }))
        // console.log(await wdp.getTitle({ sessionId }))
        // console.log(await wdp.getSource({ sessionId }))
        console.log(await wd.getAllCookies());
        await sleep(5000);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        console.log(await wd.deleteSession({ sessionId: wd.sessionId }));
    }
}
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}
