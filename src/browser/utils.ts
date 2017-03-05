import { Base, Selector, PauseSettings } from './base'
import { State } from './state'
import { Elements } from './elements'

export interface Utils extends Elements {
}

export abstract class Utils extends Base {

  pause(action: keyof PauseSettings, value: number): PauseSettings
  pause(options: PauseSettings): PauseSettings
  pause(options: PauseSettings | keyof PauseSettings, value?: number) {
    const old = { ...this.options.pause }
    if (typeof options === 'string') {
      this.options.pause[options] = value
      return
    }
    Object.assign(this.options.pause, options)
    return old
  }

  sleep(ms: number, ms2 = 0): Promise<void> {
    if (ms2) {
      ms = (Math.random() * Math.abs(ms2 - ms) | 0) + Math.min(ms, ms2) + 1
    }
    if (ms) return new Promise<void>(resolve => setTimeout(resolve, ms))
    return Promise.resolve()
  }

  sleeps(sec: number, sec2 = 0) {
    return this.sleep(sec * 1000, sec2 * 1000)
  }

  waitUntil(fn: Function, settings: { timeout?: number, interval?: number, message?: string, nothrow?: boolean }): Promise<boolean | void>
  waitUntil(fn: Function, timeout?: number, interval?: number): Promise<void>
  waitUntil(fn: Function, timeoutOrSettings?: number | { timeout?: number, interval?: number, message?: string, nothrow?: boolean }, interval?: number): Promise<any> {
    let message = `waitUntil (${fn.name}) exit by timeout`,
      timeout = 0,
      nothrow = false

    if (timeoutOrSettings && typeof timeoutOrSettings !== 'number') {
      timeout = timeoutOrSettings.timeout
      interval = timeoutOrSettings.interval
      message = timeoutOrSettings.message
      nothrow = timeoutOrSettings.nothrow
    } else {
      timeout = <number>timeoutOrSettings
    }

    if (!timeout) timeout = this.options.waitTimeout
    if (!interval) interval = this.options.waitInterval

    const now = Date.now()

    return new Promise((resolve, reject) => {
      check()
      async function check() {
        try {
          if (await fn()) return resolve(nothrow ? true : void 0)
          let time = Date.now() - now
          if (time >= timeout) return nothrow ? resolve(false) : reject(new Error(message))
          setTimeout(check, timeout - time > interval ? interval : timeout - time)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  waitFor(settings: { timeout?: number, interval?: number, message?: string, nothrow?: boolean }): WaitFor
  waitFor(timeout?: number, interval?: number): WaitFor
  waitFor(timeoutOrSettings?: number | { timeout?: number, interval?: number, message?: string, nothrow?: boolean }, interval?: number): WaitFor {
    return new Proxy(<any>this, {
      get: (browser, state, r) => {
        if (typeof browser[state] !== 'function'
          || !Object.getOwnPropertyNames(State.prototype).includes(<string>state)) return void 0

        return async (...args: any[]) => {
          const el = await this.element(args[0])
          const name = state.toString() + ' ' + (typeof args[0] === 'string' ? args[0] : args[0].value)
          const obj = {
            [name]: () => browser[state](el, ...(args.slice(1)))
          }
          return this.waitUntil(obj[name], <any>timeoutOrSettings, interval)
        }
      }
    })
  }
}

export interface WaitFor {
  isExists(selector: Selector): Promise<boolean>;
  isSelected(selector: Selector): Promise<boolean>;
  isEnabled(selector: Selector): Promise<boolean>;
  isFocused(selector: Selector): Promise<boolean>;
  isReadonly(selector: Selector): Promise<boolean>;
  isVisible(selector: Selector): Promise<boolean>;
  //isVisibleInViewport(): void;
  hasText(selector: Selector, text: string | RegExp): Promise<boolean>;
  hasClass(selector: Selector, name: string): Promise<boolean>;
  hasAttribute(selector: Selector, attr: string): Promise<boolean>;
}
