import { Base, Selector } from './base'
import { Elements } from './elements'

export interface Frames extends Elements {
}

export abstract class Frames extends Base {

  async switchFrame(frame: Selector | number | null) {
    const id = typeof frame === 'number' || frame === null ? frame : await this.elementId(frame)
    await this.webdriver.switchToFrame({ id })
  }

  switchParentFrame() {
    return this.webdriver.switchToParentFrame()
  }

}