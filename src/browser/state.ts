import { Selector, Base } from './base'
import { Elements } from './elements'
import { Exec } from './exec'
import { Getter } from './getter'

export interface State extends Elements, Exec, Getter {
}

export abstract class State extends Base {

  async isExists(selector: Selector) {
    return (await this.elements(selector)).length > 0
  }

  async notExists(selector: Selector) {
    return !((await this.elements(selector)).length > 0)
  }

  async isSelected(selector: Selector) {
    return this.webdriver.isElementSelected({ id: await this.elementId(selector) })
  }

  async isEnabled(selector: Selector) {
    return this.webdriver.isElementEnabled({ id: await this.elementId(selector) })
  }

  isFocused(selector: Selector): Promise<boolean> {
    return this.script(selector, (el: HTMLElement) => {
      let focused = document.activeElement
      if (!focused || focused === document.body) {
        return false
      }
      return focused === el
    })
  }

  isReadonly(selector: Selector) {
    return this.hasAttribute(selector, 'readonly')
  }

  async isVisible(selector: Selector) {
    return this.webdriver.isElementDysplayed({ id: await this.elementId(selector) })
  }

  //TODO
  //isVisibleInViewport() { }

  hasText(selector: Selector, text: string | RegExp): Promise<boolean>
  hasText(selector: Selector, text: Array<string | RegExp>): Promise<boolean>
  async hasText(selector: Selector, text: string | RegExp | Array<string | RegExp>): Promise<boolean> {
    let regexp: RegExp[]
    if (!Array.isArray(text)) {
      regexp = [toRegExp(text)]
    } else {
      regexp = text.map(toRegExp)
    }
    const textContent = await this.text(selector)
    return regexp.some(re => re.test(textContent))
  }

  async hasClass(selector: Selector, name: string) {
    return (await this.classList(selector)).includes(name)
  }

  hasAttribute(selector: Selector, attr: string): Promise<boolean> {
    return this.script(selector, (el: HTMLElement, attr: string) => {
      return el.hasAttribute(attr)
    }, attr)
  }

}

function toRegExp(text: string | RegExp) {
  return text instanceof RegExp ? text : new RegExp(text)
}