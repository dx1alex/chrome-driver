import { Base, Selector } from './base'
import { Utils } from './utils'
import * as URL from 'url'

import { PromisefyString } from './promisefy-string'

export interface Navigate extends Utils {
}

export abstract class Navigate extends Base {

  async go(url: string, pause = 0) {
    await this.webdriver.go({ url })
    await this.sleep(pause || this.options.pause.navigate)
  }

  async refresh(pause = 0) {
    await this.webdriver.refresh()
    await this.sleep(pause || this.options.pause.navigate)
  }

  async back(pause = 0) {
    await this.webdriver.goBack()
    await this.sleep(pause || this.options.pause.navigate)
  }

  async forward(pause = 0) {
    await this.webdriver.goForward()
    await this.sleep(pause || this.options.pause.navigate)
  }

}

Navigate.prototype.url = async function url(url?: string, pause = 0): Promise<string> {
  if (url) await this.go(url, pause)
  return this.webdriver.getCurrentURL()
} as NavigateUrl

export interface Navigate {
  url: NavigateUrl
}

export interface NavigateUrl extends PromisefyString {
  (url?: string, pause?: number): Promise<string>
  parse(): Promise<URL.Url>
}
