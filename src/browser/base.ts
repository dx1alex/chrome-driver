export * from '../webdriver'

import {
  Webdriver,
  Capabilities,
  Timeouts,
  LocatorStrategy,
} from '../webdriver'


export class Base {
  options: BrowserOptions
  webdriver: Webdriver
  capabilities: Capabilities
  sessionId = ''
  started = false

  protected _thisProxy: this
  protected get _() {
    return this
  }
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

export interface BrowserOptions {
  proxy?: string
  url?: string
  maximaze?: boolean
  windowSize?: [number, number]
  windowPosition?: [number, number]
  timeouts?: Timeouts
  useragent?: string
  desiredCapabilities?: Capabilities

  waitTimeout?: number
  waitInterval?: number
  pause?: PauseSettings
}