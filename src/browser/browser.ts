export * from './base'

import { UnicodeKeys, UNICODE_KEYS } from "../helpers"

import {
  Base,
  BrowserOptions,
  Selector,
  Timeouts,
  WebdriverOptions,
  Webdriver,
  PauseSettings
} from "./base";

import { Exec } from './exec';
import { Elements } from './elements';
import { State } from "./state";
import { Navigate } from './navigate';
import { Alert } from "./alert";
import { Tabs } from './tabs';
import { Cookies } from './cookies';
import { Frames } from './frames';
import { Getter } from './getter';
import { Input } from './input';
import { Mouse } from './mouse';
import { Storage } from './storage';
import { Utils } from './utils';
import { Sessions } from './sessions';
import { Screenshot } from './screenshot';
import { Scroll } from './scroll';


export class Browser extends Base {
  protected static _$List: string[] = [
    'script', 'scriptAll', 'scriptAllAsync', 'scriptAsync', 'html', 'text', 'tagName', 'attr', 'prop', 'css',
    'classList', 'size', 'location', 'locationInView', 'keys', 'type', 'clear', 'empty', 'submit', 'check',
    'uncheck', 'uploadFile', 'select', 'unselect', 'form', 'click', 'mouseMoveTo', 'mouseClickTo', 'isExists',
    'isSelected', 'isEnabled', 'isFocused', 'isReadonly', 'isVisible', 'hasText', 'hasClass', 'hasAttribute'
  ]
  protected static _noProxyList: string[] = ['constructor', '$', 'getCommandHistory', 'getCommandHistoryErrors', 'lastError']
  protected static _noCommandHistoryList: string[] = ['waitFor']
  protected static DEFAULT_WAIT_TIMEOUT = 30000
  protected static DEFAULT_WAIT_INTERVAL = 1000
  protected static MAX_COMMAND_HISTORY_ITEMS = 1000

  static KEY = UNICODE_KEYS

  private _lastError: any
  commandHistory: any[] = []

  constructor(wd_options: WebdriverOptions, options?: BrowserOptions) {
    super()

    this.options = options ? JSON.parse(JSON.stringify(options)) : {}

    this.webdriver = new Webdriver(wd_options)

    if (!this.options.waitTimeout) this.options.waitTimeout = new.target.DEFAULT_WAIT_TIMEOUT
    if (!this.options.waitInterval) this.options.waitInterval = new.target.DEFAULT_WAIT_INTERVAL

    this.options.pause = Object.assign({
      click: 0,
      navigate: 0,
      mouse: 0,
      keys: 0,
      submit: 0,
      upload: 0,
    }, this.options.pause || {})

    applyMixins(Browser, [
      Scroll, Screenshot, Sessions, Utils, Storage, Mouse, Input, Getter,
      Frames, Cookies, Tabs, Alert, Navigate, Exec, Elements, State
    ])

    return this._thisProxy = new Proxy(this, {
      get: (browser, command, r) => {

        if (typeof browser[command] !== 'function' || new.target._noProxyList.includes(<string>command)) {
          return Reflect.get(browser, command, r)
        }

        return (...args: any[]) => {
          let lastCommand: any,
            date = new Date()

          if (!new.target._noCommandHistoryList.includes(<string>command)) {
            const err = new Error,
              stack = err.stack.split('\n').slice(2).join('\n')

            if (this.commandHistory.length > new.target.MAX_COMMAND_HISTORY_ITEMS) {
              this.commandHistory = this.commandHistory.slice(this.commandHistory.length - new.target.MAX_COMMAND_HISTORY_ITEMS)
            }

            this.commandHistory.push({
              command,
              args,
              date,
              stack
            })
            lastCommand = this.commandHistory[this.commandHistory.length - 1]

            // log
            const strArgs = JSON.stringify(args.map(arg => typeof arg === 'function' ? arg.name : arg))
            console.log(`${command} ${strArgs} ${getDateTime(date)}\n` + stack)
          }

          const res = browser[command](...args)

          if (res instanceof Promise) {
            res.then((res: any) => lastCommand ? lastCommand.result = res : res,
              (err: any) => {
                if (lastCommand) {
                  lastCommand.error = err
                  browser._lastError = lastCommand
                } else {
                  browser._lastError = err
                }
                return err
              })
          }
          return res
        }
      }
    })
  }

  protected get _() {
    return this//._thisProxy
  }

  getStatus() {
    return this.webdriver.status()
  }

  async setTimeouts(timeouts: Timeouts) {
    for (let [type, ms] of <[any, any][]>Object.entries(timeouts)) {
      await this.webdriver.setTimeouts({ type, ms })
    }
  }

  async quit() {
    await this.webdriver.deleteSession({ sessionId: this.sessionId })
    this.started = false
  }

  async start(options: BrowserOptions = {}) {
    let init: BrowserOptions = Object.assign({}, this.options, options)
    init = JSON.parse(JSON.stringify(init))

    if (init.proxy) {
      init.desiredCapabilities.proxy = {
        proxyType: 'manual',
        httpProxy: init.proxy,
        sslProxy: init.proxy,
      }
    }

    let res = await this.webdriver.initSession({ desiredCapabilities: init.desiredCapabilities })
    this.sessionId = res.sessionId
    this.capabilities = res.value
    this.started = true

    if (init.timeouts) {
      await this.setTimeouts(init.timeouts)
    }

    if (init.maximaze) {
      await this._.maximize()
    } else {
      if (init.windowPosition) {
        await this._.setPosition(init.windowPosition[0], init.windowPosition[1])
      }
      if (init.windowSize) {
        await this._.setSize(init.windowSize[0], init.windowSize[1])
      }
    }

    if (init.url) {
      await this._.url(init.url)
    }
  }

  $(selector: Selector): Browser$ {
    return new Proxy(<any>this, {
      get: (browser, command, r) => {
        if (typeof browser[command] !== 'function' || !(this.constructor as typeof Browser)._$List.includes(<string>command)) {
          return void 0
        }

        return async (...args: any[]) => {
          if (typeof selector === 'string') selector = await this._.element(selector)
          return browser[command](selector, ...args)
        }
      }
    })
  }

  getCommandHistory(endItems = 0) {
    return this.commandHistory.slice(-endItems)
  }

  getCommandHistoryErrors(endItems = 0) {
    return this.commandHistory.filter(v => v.error).slice(-endItems)
  }

  lastError(err?: any) {
    return this._lastError && this._lastError == err ? this._lastError : err
  }

  pause(action: keyof PauseSettings, value: number): void
  pause(options: PauseSettings): void
  pause(options: PauseSettings | keyof PauseSettings, value?: number) {
    if (typeof options === 'string') {
      this.options.pause[options] = value
      return
    }
    Object.assign(this.options.pause, options)
  }


  dump() {

  }

  proxy() {

  }

}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name]
    })
  })
}

function getDateTime(d = new Date()) {
  return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)} `
    + `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}:${('0' + d.getSeconds()).slice(-2)}.${(d.getMilliseconds())}`
}

export interface Browser
  extends Scroll, Screenshot, Sessions, Utils, Storage, Mouse, Input,
  Getter, Frames, Cookies, Tabs, Alert, Navigate, Exec, Elements, State {
}

export interface Browser$ {
  //type Keys$ = keyof Browser$ // ctrl+c ;)

  script(code: string | Function, ...args: any[]): Promise<any>;
  scriptAll(code: string | Function, ...args: any[]): Promise<any>;
  scriptAllAsync(code: string | Function, ...args: any[]): Promise<any>;
  scriptAsync(code: string | Function, ...args: any[]): Promise<any>;
  html(): Promise<string>;
  text(): Promise<string>;
  tagName(): Promise<string>;
  attr(attr: string): Promise<string>;
  prop(prop: string): Promise<string>;
  css(propertyName: string): Promise<string>;
  classList(): Promise<string[]>;
  size(): Promise<{ width: number, height: number }>;
  location(): Promise<{ x: number, y: number }>;
  locationInView(): Promise<{ x: number, y: number; }>;
  keys(...keys: Array<number | boolean | string | Array<UnicodeKeys>>): Promise<void>;
  type(...keys: Array<number | boolean | string | Array<UnicodeKeys>>): Promise<void>;
  clear(): Promise<void>;
  empty(): Promise<void>;
  submit(pause?: number): Promise<void>;
  check(pause?: number): Promise<boolean>;
  uncheck(pause?: number): Promise<boolean>;
  uploadFile(input_file: Selector, filePath: string, pause?: number): Promise<void>;
  select(select: Selector, option: object | number | string, submit?: boolean | number, pause?: number | boolean): Promise<void>;
  unselect(select: Selector, option: object | number | string, submit?: boolean | number, pause?: number | boolean): Promise<void>;
  form(form: Selector, inputs: any, ...submitAndPause: (boolean | number)[]): Promise<void>;
  click(pause?: number): Promise<void>;
  mouseMoveTo(xoffset?: number, yoffset?: number, pause?: number): Promise<void>;
  mouseClickTo(xoffset?: number, yoffset?: number): Promise<void>;
  isExists(): Promise<boolean>;
  isSelected(): Promise<boolean>;
  isEnabled(): Promise<boolean>;
  isFocused(): Promise<boolean>;
  isReadonly(): Promise<boolean>;
  isVisible(): Promise<boolean>;
  hasText(text: string | RegExp): Promise<boolean>;
  hasClass(name: string): Promise<boolean>;
  hasAttribute(attr: string): Promise<boolean>;

}