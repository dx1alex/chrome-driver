import * as fs from 'fs'
import { Base, Selector } from './base'
import { Elements } from './elements'
import { Exec } from './exec'
import { Tabs } from './tabs'
import { Navigate } from './navigate'

export interface Getter extends Elements, Exec, Tabs, Navigate {
}

export class Getter extends Base {

  title() {
    return this.webdriver.getTitle()
  }

  html(selector?: Selector) {
    if (!selector) return this.webdriver.getSource()
    return this.script(selector, (el: HTMLElement) => el.innerHTML)
  }

  async text(selector?: Selector) {
    if (selector) return this.webdriver.getElementText({ id: await this.elementId(selector) })
    return this.webdriver.getElementText({ id: await this.elementId('body') })
  }

  async tagName(selector: Selector) {
    return this.webdriver.getElementTagName({ id: await this.elementId(selector) })
  }

  attr(selector: Selector, attr: string) {
    return this.script<string>(selector, (el: HTMLElement, attr: string) => el.getAttribute(attr), attr)
  }

  prop(selector: Selector, prop: string) {
    return this.script<any>(selector, (el: HTMLElement, prop: string) => el[prop], prop)
  }

  async css(selector: Selector, propertyName: string) {
    return this.webdriver.getElementCssProperty({ id: await this.elementId(selector), propertyName })
  }

  classList(selector: Selector): Promise<string[]> {
    return this.script(selector, (el: HTMLElement) => el.classList)
  }

  async size(selector: Selector) {
    return this.webdriver.getElementSize({ id: await this.elementId(selector) })
  }

  async location(selector: Selector) {
    return this.webdriver.getElementLocation({ id: await this.elementId(selector) })
  }

  async locationInView(selector: Selector) {
    return this.webdriver.getElementLocationInView({ id: await this.elementId(selector) })
  }

}