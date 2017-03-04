import { Selector, Base } from './base'
import { Elements } from './elements'
import { Exec } from './exec'
import { Getter } from './getter'

export interface State extends Elements, Exec, Getter {
}

export class State extends Base {

  async isExists(selector: Selector) {
    return (await this.elements(selector)).length > 0
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

  async hasText(selector: Selector, text: string | RegExp) {
    const re = text instanceof RegExp ? text : new RegExp(text)
    return re.test(await this.webdriver.getElementText({ id: await this.elementId(selector) }))
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

