import { Selector, Base, WebElement } from './base'
import { Elements } from './elements'

export interface Exec extends Elements {
}

export class Exec extends Base {

  execute(code: string | Function, ...args: any[]) {
    let script = '' + code
    let async = script.startsWith('async')
    if (typeof code === 'function') script = `return (${script.replace('async', '')}).apply(null, arguments)`
    if (async) {
      return this.webdriver.executeAsyncScript({ script, args })
    }
    return this.webdriver.executeScript({ script, args })
  }

  executeAsync(code: string | Function, ...args: any[]) {
    const script = typeof code === 'function' ? `return (${code}).apply(null, arguments)` : code
    return this.webdriver.executeAsyncScript({ script, args })
  }

  async script(selector: Selector | Selector[], code: string | Function, ...args: any[]) {
    let sel
    if (Array.isArray(selector)) {
      sel = []
      for (let s of selector) {
        sel.push(typeof s === 'string' ? await this._.element(s) : s)
      }
    } else {
      sel = typeof selector === 'string' ? await this._.element(selector) : selector
    }
    return this._.execute(code, sel, ...args)
  }

  async scriptAll(selector: Selector | Selector[], code: string | Function, ...args: any[]) {
    let sel: any[]
    if (Array.isArray(selector)) {
      sel = []
      for (let s of selector) {
        sel.concat(typeof s === 'string' ? await this._.element(s) : (Array.isArray(s) ? s : [s]))
      }
    } else {
      sel = typeof selector === 'string' ? await this._.elements(selector) : [selector]
    }
    return this._.execute(code, sel, ...args)
  }

  async scriptAllAsync(selector: Selector | Selector[], code: string | Function, ...args: any[]) {
    let sel: any[]
    if (Array.isArray(selector)) {
      sel = []
      for (let s of selector) {
        sel.concat(typeof s === 'string' ? await this._.element(s) : (Array.isArray(s) ? s : [s]))
      }
    } else {
      sel = typeof selector === 'string' ? await this._.elements(selector) : [selector]
    }
    return this._.executeAsync(code, sel, ...args)
  }

  async scriptAsync(selector: Selector | Selector[], code: string | Function, ...args: any[]) {
    let sel
    if (Array.isArray(selector)) {
      sel = []
      for (let s of selector) {
        sel.push(typeof s === 'string' ? await this._.element(s) : s)
      }
    } else {
      sel = typeof selector === 'string' ? await this._.element(selector) : selector
    }
    return this._.executeAsync(code, sel, ...args)
  }

}

// function getScript(code: string | Function) {
//   return `return ((sel) => {
//       arguments[0] = Array.isArray(sel) 
//       ? sel.map(s => (s.index != null ? document.querySelectorAll(s.value).item(s.index) : document.querySelector(s.value))) 
//       : (sel.index != null ? document.querySelectorAll(sel.value).item(sel.index) : document.querySelector(sel.value));
//       return (${code}).apply(null, arguments)
//     }).apply(null, arguments)`
// }

