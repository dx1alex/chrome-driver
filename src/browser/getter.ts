import * as fs from 'fs'
import { Base, Selector } from './base'
import { Elements } from './elements'
import { Exec } from './exec'
import { Tabs } from './tabs'
import { Navigate } from './navigate'

import { PromisefyString } from './promisefy-string'

export interface Getter extends Elements, Exec, Tabs, Navigate {
}

export abstract class Getter extends Base {

  async tagName(selector: Selector) {
    return this.webdriver.getElementTagName({ id: await this.elementId(selector) })
  }

  attr(selector: Selector, attr: string) {
    return this.script<string>(selector, (el: HTMLElement, attr: string) => el.getAttribute(attr), attr)
  }

  prop<T>(selector: Selector, prop: string) {
    return this.script<T>(selector, (el: HTMLElement, prop: string) => el[prop], prop)
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

Getter.prototype.html = function html(selector?: Selector): Promise<string> {
  if (!selector) return this.webdriver.getSource()
  return this.script(selector, (el: HTMLElement) => el.innerHTML)
} as GetterHtml

Getter.prototype.text = async function text(selector?: Selector): Promise<string> {
  if (!selector) return this.webdriver.getElementText({ id: await this.elementId('body') })
  return this.webdriver.getElementText({ id: await this.elementId(selector) })
} as GetterText

Getter.prototype.title = function title() {
  return this.webdriver.getTitle()
} as GetterTitle


export interface Getter {
  html: GetterHtml
  text: GetterText
  title: GetterTitle
}

export interface GetterHtml extends PromisefyString {
  (selector?: Selector): Promise<string>
}

export interface GetterText extends PromisefyString {
  (selector?: Selector): Promise<string>
}

export interface GetterTitle extends PromisefyString {
  (): Promise<string>
}