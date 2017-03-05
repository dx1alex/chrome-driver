import { Base, Timeouts } from './base'

export abstract class Timeout extends Base {

  async setTimeouts(timeouts: Timeouts) {
    for (let [type, ms] of <[keyof Timeouts, number][]>Object.entries(timeouts)) {
      await this.webdriver.setTimeouts({ type, ms })
    }
  }

}