import { Base } from '../browser/base'
import { ChromeExtension } from './extension'
import * as URL from 'url'

export interface ChromeProxy extends ChromeExtension {
}

export abstract class ChromeProxy extends Base {

  clearProxy() {
    return this.extension(() => {
      chrome.proxy.settings.clear({})
      proxy_auth = null
    })
  }

  setProxy(proxy?: string) {
    if (!proxy)
      return this.clearProxy()

    if (!(/^https?:\/\//.test(proxy) || /^socks[4|5]:\/\//.test(proxy))) proxy = 'http://' + proxy

    const { protocol, hostname, port, auth } = URL.parse(proxy),
      scheme = protocol.slice(0, -1)

    let pauth
    if (auth) {
      const p = auth.split(':')
      pauth = {
        login: p[0],
        password: p[1]
      }
    }

    return this.extension((scheme: string, host: string, port: number, auth?: { login: string, password: string }) => {
      return setProxy(scheme, host, port, auth)
    }, scheme, hostname, +port, pauth)
  }

}

declare function setProxy(scheme: string, host: string, port: number, auth?: { login: string, password: string }): Promise<void>
declare var proxy_auth: { login: string, password: string }
