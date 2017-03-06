export * from '../webdriver'

import {
  Webdriver,
  Capabilities,
  Timeouts,
  LocatorStrategy
} from '../webdriver'

import { UNICODE_KEYS } from '../helpers'
import { CommandHistoryObject } from './command-history'

export abstract class Base {
  options: BrowserOptions
  webdriver: Webdriver
  capabilities: Capabilities
  sessionId = ''
  started = false

  protected _ = this

  protected static _no_command_history_list: string[] = []
  protected static _no_proxy_list: string[] = []

  protected static DEFAULT_WAIT_TIMEOUT = 30000
  protected static DEFAULT_WAIT_INTERVAL = 1000
  protected static MAX_COMMAND_HISTORY_ITEMS = 100

  static readonly KEY = UNICODE_KEYS

  protected _numCommand = 0

  commandHistory: CommandHistoryObject[] = []
  logStream: NodeJS.WritableStream
}

export interface PauseSettings {
  click?: number // click, check, uncheck, select, unselect
  navigate?: number // go, url, back, forward, refresh
  mouse?: number // mouse...
  keys?: number // keys, type
  submit?: number // submit
  upload?: number // uploadFile
}

export interface WebElement {
  ELEMENT: string
  using?: LocatorStrategy | [LocatorStrategy, LocatorStrategy]
  value?: string | [string, string]
  index?: number
}

export type Selector = string | WebElement

export interface BrowserOptions extends BrowserStartOptions {
  remote: string
  log?: string | boolean
  waitTimeout?: number
  waitInterval?: number
  pause?: PauseSettings
  noCommandHistory?: boolean
}

export interface BrowserStartOptions {
  proxy?: string
  url?: string
  maximaze?: boolean
  windowSize?: number[]
  windowPosition?: number[]
  window?: number[]
  timeouts?: Timeouts
  desiredCapabilities?: Capabilities
}
