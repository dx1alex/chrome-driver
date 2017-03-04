import { Base, Selector, WebElement, LocatorStrategy } from './base'

export class Elements extends Base {

  getElement(): Promise<WebElement | null>
  getElement(selector: Selector, parent?: Selector): Promise<WebElement | null>
  async getElement(selector?: Selector, parent?: Selector): Promise<WebElement | null> {
    try {
      return this.element(selector, parent)
    } catch (err) {
      if (err.state && err.state == 7) return Promise.resolve(null)
      throw err
    }
  }

  element(): Promise<WebElement>
  element(selector: Selector, parent?: Selector): Promise<WebElement>
  async element(selector?: Selector, parent?: Selector) {
    const using: LocatorStrategy = 'css selector'

    let el: WebElement

    if (parent && typeof selector === 'string') {
      let parentElement = typeof parent === 'string' ? await this.webdriver.findElement({ using, value: parent }) : parent
      el = await this.webdriver.findChildElement({ using, value: selector, id: parentElement.ELEMENT })
      el.using = [using, typeof parent === 'string' ? using : <LocatorStrategy>parent.using]
      el.value = [selector, typeof parent === 'string' ? parent : <string>parent.value]
    } else if (typeof selector === 'string') {
      el = await this.webdriver.findElement({ using, value: selector })
      el.using = using
      el.value = selector
    } else if (!selector) {
      return this.webdriver.getActiveElement()
    }

    return el || <WebElement>selector
  }

  async elements(selector: Selector, parent?: Selector) {
    const using: LocatorStrategy = 'css selector'

    let els: WebElement[]

    if (parent && typeof selector === 'string') {
      let parentElement = typeof parent === 'string' ? await this.webdriver.findElement({ using, value: parent }) : parent
      els = await this.webdriver.findChildElements({ using, value: selector, id: parentElement.ELEMENT })
      els.forEach((el, i) => {
        el.index = i
        el.using = [using, typeof parent === 'string' ? using : <LocatorStrategy>parent.using]
        el.value = [selector, typeof parent === 'string' ? parent : <string>parent.value]
      })
    } else if (typeof selector === 'string') {
      els = await this.webdriver.findElements({ using, value: selector })
      els.forEach((el, i) => {
        el.index = i
        el.using = using
        el.value = selector
      })
    }

    return els || <WebElement[]>(Array.isArray(selector) ? selector : [selector])
  }

  async elementId(selector: Selector, parent?: Selector) {
    if (typeof selector !== 'string') return selector.ELEMENT
    return (await this.element(selector, parent)).ELEMENT
  }
}