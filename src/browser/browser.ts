export * from './base'

import {
  UnicodeKeys,
  UNICODE_KEYS,
  getDateTime,
  applyMixins
} from '../helpers'

import {
  Base,
  BrowserOptions,
  BrowserStartOptions,
  Selector,
  Timeouts,
  Webdriver,
  WebdriverOptions,
  PauseSettings
} from './base'

import { Exec } from './exec'
import { Elements } from './elements'
import { State } from './state'
import { Navigate } from './navigate'
import { Alert } from './alert'
import { Tabs } from './tabs'
import { Cookies } from './cookies'
import { Frames } from './frames'
import { Getter } from './getter'
import { Input } from './input'
import { Mouse } from './mouse'
import { Storage } from './storage'
import { Utils } from './utils'
import { Sessions } from './sessions'
import { Screenshot } from './screenshot'
import { Scroll } from './scroll'
import { Timeout } from './timeout'
import { CommandHistory, CommandHistoryObject } from './command-history'
import { $Class } from './$class'

import * as fs from 'fs'
import * as URL from 'url'

export class Browser extends Base {
  protected static _no_command_history_list: string[] = ['waitFor']
  protected static _no_proxy_list: string[] = [$Class, CommandHistory]
    .map(n => Object.getOwnPropertyNames(n.prototype).filter(v => v !== 'constructor'))
    .reduce((a, b) => a.concat(b))
    .concat(Object.getOwnPropertyNames(Object.prototype))
    .concat(['elementId'])

  constructor(options: BrowserOptions) {
    super()

    this.options = JSON.parse(JSON.stringify(options))

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

    if (this.options.log) {
      this.logStream = typeof this.options.log === 'boolean'
        ? process.stdout
        : /^console/.test(this.options.log)
          ? <any>{ write: console[this.options.log.split('.')[1] || 'log'] }
          : fs.createWriteStream(this.options.log, { flags: 'a' })
    }

    this.webdriver = new Webdriver({
      remote: this.options.remote,
      log: this.logStream
    })

    return this._this_proxy = new Proxy(this, {
      get: (browser, command: string, r) => {
        if (typeof this[command] !== 'function' || new.target._no_proxy_list.includes(command)) {
          return Reflect.get(browser, command, r)
        }

        const fn = (...args: any[]) => {
          const date = new Date(),
            err = new Error,
            stack = err.stack.split('\n').slice(1).join('\n'),
            strArgs = JSON.stringify(args.map(arg => typeof arg === 'function' ? arg.name : arg))

          const lastCommand: CommandHistoryObject = { command, args, date, stack }

          if (!this.options.noCommandHistory && !new.target._no_command_history_list.includes(command)) {
            this.commandHistory.push(lastCommand)

            if (this.commandHistory.length > new.target.MAX_COMMAND_HISTORY_ITEMS) {
              this.commandHistory = this.commandHistory
                .slice(this.commandHistory.length - new.target.MAX_COMMAND_HISTORY_ITEMS)
            }
          }

          if (this.logStream) {
            this.logStream.write(`[${++this._numCommand}] ${getDateTime(date)} \n${command} ${strArgs} \n${stack}\n`)
          }

          const timeStart = Date.now()
          const res = browser[command](...args)

          if (res instanceof Promise) {
            res.then(
              (res: any) => {
                const timeEnd = Date.now()
                lastCommand.time = timeEnd - timeStart
                lastCommand.result = res === this ? 'this' : res
                this._lastCommand = lastCommand
                return res
              },
              (err: any) => {
                const timeEnd = Date.now()
                lastCommand.time = timeEnd - timeStart
                lastCommand.error = err
                this._lastError = lastCommand
                return err
              })
          } else {
            const timeEnd = Date.now()
            lastCommand.time = timeEnd - timeStart
            lastCommand.result = res === this ? 'this' : res
            this._lastCommand = lastCommand
          }

          return res
        }

        if (command === 'url') {
          return new Proxy(fn, {
            get: (target, key, thisArg) => {
              return async (...args: any[]) => {
                const url = await this.webdriver.getCurrentURL()
                if (key === 'parse') return URL.parse(url, true)
                if (typeof String.prototype[key] !== 'function')
                  throw TypeError(`String.prototype.${key} is not a function`)

                return url[key](...args)
              }
            }
          })
        }

        return fn
      }
    })
  }

  getStatus() {
    return this.webdriver.status()
  }

  async quit() {
    await this.webdriver.deleteSession()
    this.started = false
  }

  async start(options: BrowserStartOptions = {}) {
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
      await this.maximize()
    } else {
      if (init.window) {
        init.windowPosition = [init.window[0], init.window[1]]
        init.windowSize = [init.window[2], init.window[3]]
      }
      if (init.windowPosition) {
        await this.setPosition(init.windowPosition[0], init.windowPosition[1])
      }
      if (init.windowSize) {
        await this.setSize(init.windowSize[0], init.windowSize[1])
      }
    }

    if (init.url) {
      await this.go(init.url)
    }

    return this
  }

}

applyMixins(Browser, [
  Scroll, Screenshot, Sessions, Utils, Storage, Mouse, Input, Getter, CommandHistory,
  Frames, Cookies, Tabs, Alert, Navigate, Exec, Elements, State, Timeout, $Class
])

export interface Browser extends
  Scroll, Screenshot, Sessions, Utils, Storage, Mouse, Input, Getter, CommandHistory,
  Frames, Cookies, Tabs, Alert, Navigate, Exec, Elements, State, Timeout, $Class {
}