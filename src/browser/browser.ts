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

export class Browser extends Base {
  protected static _no_command_history_list: string[] = ['waitFor']
  protected static _no_proxy_list: string[] = [$Class, CommandHistory]
    .map(n => Object.getOwnPropertyNames(n.prototype).filter(v => v !== 'constructor'))
    .reduce((a, b) => a.concat(b))
    .concat(['elementId'])

  protected static DEFAULT_WAIT_TIMEOUT = 30000
  protected static DEFAULT_WAIT_INTERVAL = 1000
  protected static MAX_COMMAND_HISTORY_ITEMS = 100

  static KEY = UNICODE_KEYS

  private _numCommand = 0

  commandHistory: CommandHistoryObject[] = []
  logStream: NodeJS.WritableStream

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

        return (...args: any[]) => {
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
            this.logStream.write(`[${++this._numCommand}] ${getDateTime(date)} \n${command} ${strArgs} \n${stack}\n\n`)
          }

          const timeStart = Date.now()
          const res = browser[command](...args)

          if (res instanceof Promise) {
            res.then(
              (res: any) => {
                const timeEnd = Date.now()
                lastCommand.time = timeEnd - timeStart
                lastCommand.result = res
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
            lastCommand.result = res
            this._lastCommand = lastCommand
          }

          return res
        }
      }
    })
  }

  protected get _(): this {
    return this.options.verbose ? this._this_proxy : this
  }

  getStatus() {
    return this.webdriver.status()
  }

  async quit() {
    await this.webdriver.deleteSession({ sessionId: this.sessionId })
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
      await this._.setTimeouts(init.timeouts)
    }

    if (init.maximaze) {
      await this._.maximize()
    } else {
      if (init.window) {
        init.windowPosition = [init.window[0], init.window[1]]
        init.windowSize = [init.window[2], init.window[3]]
      }
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

}

applyMixins(Browser, [
  Scroll, Screenshot, Sessions, Utils, Storage, Mouse, Input, Getter, CommandHistory,
  Frames, Cookies, Tabs, Alert, Navigate, Exec, Elements, State, Timeout, $Class
])

export interface Browser extends
  Scroll, Screenshot, Sessions, Utils, Storage, Mouse, Input, Getter, CommandHistory,
  Frames, Cookies, Tabs, Alert, Navigate, Exec, Elements, State, Timeout, $Class {
}