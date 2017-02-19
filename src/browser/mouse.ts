import { Base, Selector } from "./base";
import { Elements } from './elements';
import { Utils } from './utils';

export interface Mouse extends Utils, Elements {
}

export class Mouse extends Base {

  async click(selector: Selector | Array<Selector>, pause?: number) {
    if (!Array.isArray(selector)) {
      selector = [selector]
    }
    for (let s of selector) {
      await this.webdriver.click({ id: await this._.elementId(s) })
      await this._.sleep(pause || this.options.pause.click)
    }
  }

  async mouseDoubleClick(pause?: number) {
    await this.webdriver.mouseDoubleClick()
    await this._.sleep(pause || this.options.pause.mouse)
  }

  async mouseButtonClick(button: 0 | 1 | 2 = 0, pause?: number) {
    await this.webdriver.mouseClick({ button })
    await this._.sleep(pause || this.options.pause.mouse)
  }

  async mouseButtonUp(button: 0 | 1 | 2 = 0, pause?: number) {
    await this.webdriver.mouseUp({ button })
    await this._.sleep(pause || this.options.pause.mouse)
  }

  async mouseButtonDown(button: 0 | 1 | 2 = 0, pause?: number) {
    await this.webdriver.mouseDown({ button })
    await this._.sleep(pause || this.options.pause.mouse)
  }

  async mouseMoveTo(selector: Selector, xoffset?: number, yoffset?: number, pause?: number) {
    let element = await this.elementId(selector)
    await this.webdriver.mouseMoveTo({ element, xoffset, yoffset })
    await this._.sleep(pause || this.options.pause.mouse)
  }

  async mouseMoveBy(xoffset: number, yoffset: number, pause?: number) {
    await this.webdriver.mouseMoveTo({ xoffset, yoffset })
    await this._.sleep(pause || this.options.pause.mouse)
  }

  async mouseClickTo(selector: Selector, xoffset?: number, yoffset?: number) {
    await this._.mouseMoveTo(selector, xoffset, yoffset)
    return this._.mouseButtonClick()
  }

  async mouseClickBy(xoffset: number, yoffset: number) {
    await this._.mouseMoveBy(xoffset, yoffset)
    return this._.mouseButtonClick()
  }

  //TODO
  async dragAndDrop(pause?: number) {
    await this._.sleep(pause || this.options.pause.mouse)
  }
}