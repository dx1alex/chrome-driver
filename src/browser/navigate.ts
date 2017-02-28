import { Base, Selector } from './base'
import { Utils } from './utils'

export interface Navigate extends Utils {
}

export class Navigate extends Base {
  async url(url: string, pause = 0) {
    if (url) {
      await this.webdriver.go({ url })
      await this._.sleep(pause || this.options.pause.navigate)
    }
    return this.webdriver.getCurrentURL()
  }

  async go(url: string, pause = 0) {
    await this.webdriver.go({ url })
    await this._.sleep(pause || this.options.pause.navigate)
  }

  async refresh(pause = 0) {
    await this.webdriver.refresh()
    await this._.sleep(pause || this.options.pause.navigate)
  }

  async back(pause = 0) {
    await this.webdriver.goBack()
    await this._.sleep(pause || this.options.pause.navigate)
  }

  async forward(pause = 0) {
    await this.webdriver.goForward()
    await this._.sleep(pause || this.options.pause.navigate)
  }

}

