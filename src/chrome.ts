import { Browser, Browser$, WebdriverOptions } from './browser'
import * as fs from 'fs'

class Chrome extends Browser {

  constructor(wd_options: WebdriverOptions, options: any) {
    super(wd_options, options)
  }

}

//////////////////////////////////////////////////////////////////////////////

let options = {
  proxy: '',
  windowSize: [1200, 800],
  windowPosition: [0, 0],
  timeouts: { implicit: 1000, script: 30000, 'page load': 30000 },
  desiredCapabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        'new-window',
        'disable-background-networking',
        'disable-client-side-phishing-detection',
        'disable-component-update',
        'disable-hang-monitor',
        'disable-prompt-on-repost',
        'disable-default-apps',
        'disable-translate',
        'disable-sync',
        'disable-web-resources',
        'disable-translate-new-ux',
        'disable-session-crashed-bubble',
        'disable-password-manager-reauthentication',
        'disable-save-password-bubble',
        'disable-plugins-discovery',
        'disable-plugins',
        'disable-gpu',
        'no-sandbox',
        'safe-plugins',
        'allow-running-insecure-content',
        'ignore-urlfetcher-cert-requests',
        'safebrowsing-disable-auto-update',
        'safebrowsing-disable-download-protection',
        'ignore-certificate-errors',
        'metrics-recording-only',
        'no-default-browser-check',
        'no-first-run',
        'no-managed-user-acknowledgment-check',
        'no-network-profile-warning',
        'no-pings',
        'noerrdialogs',
        'password-store=basic',
        'user-data-dir=/tmp/test'
        // 'load-extension=/home/dx1/work/www/app/bro/vk/ext/contentSettings', 
        // ,/home/dx1/work/www/app/bro/vk/ext/prx
      ]
    }
  }
}


const chrome = new Chrome({ url: 'http://localhost:9500', debug: false }, options)
main()
async function main() {
  try {
    //console.log(await chrome.getStatus())

    await chrome.start()
    //await chrome.go('http://ya.ru')

    //await chrome.keys('#text', 'sex', 1000, true, 3000)
    await chrome.quit()

    chrome.getCommandHistory().forEach(console.log)

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

    // console.timeEnd('time')
    // console.log(ok)


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

  } catch (err) {
    console.error(chrome.lastError(err))
  }

}