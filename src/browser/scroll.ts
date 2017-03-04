import { Base, Selector } from './base'
import { Exec } from './exec'
import { Tabs } from './tabs'

export interface Scroll extends Exec, Tabs {
}

export class Scroll extends Base {
  //TODO оптимизировать чтобы offsetTop при alignToTop == 'center' вычислялся на стороне браузера
  async scroll(selector: Selector, alignToTop: boolean | 'top' | 'bottom' | 'center' = true, offsetTop = 0) {
    if (alignToTop === 'top') alignToTop = true
    if (alignToTop === 'bottom') alignToTop = false
    if (alignToTop === 'center') {
      alignToTop = true
      const size = await this.webdriver.getElementSize({ id: await this.elementId(selector) })
      const winSize = await this.getViewSize()
      offsetTop = offsetTop - (winSize.height / 2 + size.height / 2)
    }
    await this.script(selector, (el: HTMLElement, align: boolean, offsetTop?: number) => {
      el.scrollIntoView(align);
      if (offsetTop) scrollBy(0, offsetTop)
    }, alignToTop, offsetTop)
  }
  //TODO
  scrollToElement(selector: Selector, parent: Selector, alignToTop: boolean | 'top' | 'bottom' | 'center' = true, offsetTop?: number) {

  }

  scrollBy(top: number, left?: number): Promise<void>
  scrollBy(selector: Selector, top: number, left?: number): Promise<void>
  async scrollBy(selector?: Selector | number, top?: number, left?: number) {
    if (typeof selector !== 'number') {
      return this.script(selector, (el: HTMLElement, top?: number, left?: number) => {
        if (top != null) el.scrollTop += top
        if (left != null) el.scrollLeft += left
      }, top, left)
    }
    left = top
    top = selector
    return this.execute((top = 0, left = 0) => scrollBy(left, top), top, left)
  }

  scrollTo(top?: number, left?: number): Promise<void>
  scrollTo(selector: Selector, top: number, left?: number): Promise<void>
  async scrollTo(selector?: Selector | number, top?: number, left?: number) {
    if (typeof selector !== 'number') {
      if (top < 0) top = Number.MAX_SAFE_INTEGER
      if (left < 0) left = Number.MAX_SAFE_INTEGER
      return this.script(selector, (el: HTMLElement, top?: number, left?: number) => {
        if (top != null) el.scrollTop = top
        if (left != null) el.scrollLeft = left
      }, top, left)
    }
    left = top
    top = selector
    if (top < 0) top = Number.MAX_SAFE_INTEGER
    if (left < 0) left = Number.MAX_SAFE_INTEGER
    return this.execute((top = 0, left = 0) => scrollTo(left, top), top, left)
  }

  scrollTop(selector: Selector, px: number): Promise<number> {
    if (px < 0) px = Number.MAX_SAFE_INTEGER
    return this.script(selector, (el: HTMLElement, px: number) => el.scrollTop = px, px)
  }

  scrollLeft(selector: Selector, px: number): Promise<number> {
    if (px < 0) px = Number.MAX_SAFE_INTEGER
    return this.script(selector, (el: HTMLElement, px: number) => el.scrollLeft = px, px)
  }

}

