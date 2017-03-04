import { Selector, Base, WebElement } from './base'
import { Elements } from './elements'

export interface Exec extends Elements {
}

export class Exec extends Base {

  execute(code: string | Function, ...args: any[]) {
    let script = '' + code
    if (typeof code === 'function') {
      if (script.startsWith('async')) {
        return this.executeAsync(code, ...args)
      }
      script = `return (${script}).apply(null, arguments)`
    }
    return this.webdriver.executeScript({ script, args })
  }

  async executeAsync(code: string | Function, ...args: any[]) {
    const script = typeof code === 'function'
      ? `let done = arguments[arguments.length -1];      
      let result = (${code}).apply(null, arguments);
      if(result instanceof Promise) { 
        result.then(done, err => done({__error: {message: err.message, stack: err.stack}}))
      }`
      : code
    const res = await this.webdriver.executeAsyncScript({ script, args })
    if (res && res.__error) {
      const error = new Error(res.__error.message)
      error.stack += `\n(browser context stack)\n${res.__error.stack}`
      throw error
    }
    return res
  }

  async script(selector: Selector | Selector[], code: string | Function, ...args: any[]) {
    let sel
    if (Array.isArray(selector)) {
      sel = []
      for (let s of selector) {
        sel.push(typeof s === 'string' ? await this.element(s) : s)
      }
    } else {
      sel = typeof selector === 'string' ? await this.element(selector) : selector
    }
    return this.execute(code, sel, ...args)
  }

  async scriptAll(selector: Selector | Selector[], code: string | Function, ...args: any[]) {
    let sel: any[]
    if (Array.isArray(selector)) {
      sel = []
      for (let s of selector) {
        sel.concat(typeof s === 'string' ? await this.element(s) : (Array.isArray(s) ? s : [s]))
      }
    } else {
      sel = typeof selector === 'string' ? await this.elements(selector) : [selector]
    }
    return this.execute(code, sel, ...args)
  }

  async scriptAllAsync(selector: Selector | Selector[], code: string | Function, ...args: any[]) {
    let sel: any[]
    if (Array.isArray(selector)) {
      sel = []
      for (let s of selector) {
        sel.concat(typeof s === 'string' ? await this.element(s) : (Array.isArray(s) ? s : [s]))
      }
    } else {
      sel = typeof selector === 'string' ? await this.elements(selector) : [selector]
    }
    return this.executeAsync(code, sel, ...args)
  }

  async scriptAsync(selector: Selector | Selector[], code: string | Function, ...args: any[]) {
    let sel
    if (Array.isArray(selector)) {
      sel = []
      for (let s of selector) {
        sel.push(typeof s === 'string' ? await this.element(s) : s)
      }
    } else {
      sel = typeof selector === 'string' ? await this.element(selector) : selector
    }
    return this.executeAsync(code, sel, ...args)
  }

  //TODO fn
  // let sleepOnBrowser = bro.fn.execute(async (ms: number) => new Promise(resolve => setTimeout(resolve, ms)))
  // await sleepOnBrowser(3000)
}