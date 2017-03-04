import * as fs from 'fs'
import * as URL from 'url'
import * as http from 'http'
import * as https from 'https'
import commands from './commands'
import { getDateTime } from '../helpers'

export class Webdriver {
  options: WebdriverOptions
  sessionId: string = ''
  logStream: NodeJS.WritableStream

  constructor(options: WebdriverOptions | string) {
    this.options = typeof options === 'string' ? { remote: options } : Object.assign({}, options)
    this.options.remote = this.options.remote.replace(/\/+$/, '')


    if (this.options.log && typeof this.options.log !== 'object') {
      this.logStream = typeof this.options.log === 'boolean' ? process.stdout
        : /^console/.test(this.options.log) ? <any>{ write: console[this.options.log.split('.')[1] || 'log'] }
          : typeof this.options.log === 'string' ? fs.createWriteStream(this.options.log, { flags: 'a' })
            : this.options.log
    } else {
      this.logStream = <NodeJS.WritableStream>this.options.log
    }

    for (const command of Object.keys(commands)) {
      Webdriver.prototype[command] = (data: any) => {
        let path: string = commands[command][1]
        path = path.replace(/:([a-zA-Z_$]+)/g, (m, p) => {
          if (p === 'sessionId') {
            if (data && 'sessionId' in data) {
              return data['sessionId']
            }
            if (!this.sessionId) {
              throw new Error(`No set sessionId`)
            }
            return this.sessionId
          }
          if (!(p in data)) throw new TypeError(`Invalid argument ${p} from ${command}`)
          return data[p]
        })

        let postData: any = {}
        if (commands[command][2]) {
          for (let p of commands[command][2]) {
            if (p in data) postData[p] = data[p]
          }
        }

        return this._requestHandler(command, commands[command][0], path, Object.keys(postData).length ? postData : void 0)
      }
    }
  }

  async initSession(capabilities: { desiredCapabilities: Capabilities }) {
    const options: https.RequestOptions = <any>URL.parse(this.options.remote + '/session')
    options.method = 'POST'
    const result = await this.request(options, JSON.stringify(capabilities))
    this.sessionId = result.sessionId
    return <{ sessionId: string, value: Capabilities }>result
  }

  request(options: https.RequestOptions, postData?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (options.method == 'POST' && postData) {
        if (!options.headers) options.headers = {}
        Object.assign(options.headers, {
          'Content-Type': 'application/json; charset=UTF-8',
          'Content-Length': Buffer.byteLength(postData, 'utf8')
        })
      }

      const _request = options.protocol === 'https:' ? https.request : http.request
      const req = _request(options, res => {
        let data = ''

        res.setEncoding('utf8')

        res.on('data', chunk => { data += chunk })

        res.on('end', () => {
          if (res.statusCode != 200) {
            let err = new Error(`${data}`)
            err['statusCode'] = res.statusCode
            return reject(err)
          }

          const result = JSON.parse(data)

          if (result.status) {
            let err = new Error(`${result.value.message}`)
            err['statusCode'] = result.status
            return reject(err)
          }

          resolve(result)
        })
      })

      req.on('error', reject)

      if (options.method === 'POST' && postData) {
        req.write(postData)
      }

      req.end()
    })
  }

  private async _requestHandler(command: string, method: string, path: string, postData?: any): Promise<any> {
    const url = this.options.remote + path
    const options: https.RequestOptions = <any>URL.parse(url)
    options.method = method
    Object.assign(options, this.options, options)

    const timeStart = Date.now()

    try {
      const data = await this.request(options, postData ? JSON.stringify(postData) : void 0)
      if (this.logStream) {
        const timeEnd = Date.now()
        writeLog(this.logStream, {
          status: 'OK',
          statusCode: 200,
          date: timeStart,
          command,
          method,
          url,
          postData: postData,
          data: data,
          time: (timeEnd - timeStart),
        })
      }
      return data.value
    } catch (err) {
      if (this.logStream) {
        const timeEnd = Date.now()
        writeLog(this.logStream, {
          status: 'ERROR',
          statusCode: err.statusCode,
          date: timeStart,
          command,
          method,
          url,
          postData: postData,
          data: err.message,
          time: (timeEnd - timeStart),
        })
      }
      throw err
    }
  }
}

function writeLog(out: NodeJS.WritableStream, data: WebdriverLog) {
  return out.write(formatLog(data))
}

function formatLog(data: WebdriverLog) {
  const postData = !data.postData ? '' : '\n' + JSON.stringify(data.postData)
  let responseData = data.status !== 'ERROR' ? Object.assign({}, data.data) : data.data
  if (responseData.value && typeof responseData.value === 'string' && responseData.value.length > 128) {
    responseData.value = responseData.value.substr(0, 128) + '...'
  }
  return `[${data.status}] ${getDateTime(new Date(data.date))} ${data.time}ms\n${data.command}:
REQUEST: ${data.method} ${data.url} ${postData}
RESPONSE: ${data.statusCode}
${JSON.stringify(responseData)}\n`
}

export interface WebdriverLog {
  status: 'ERROR' | 'OK'
  command: string
  method: string
  url: string
  postData: any
  statusCode: string | number
  data: any,
  time: number,
  date: number
}

export interface WebdriverOptions extends https.RequestOptions, http.RequestOptions {
  remote: string
  log?: boolean | string | NodeJS.WritableStream
}

export interface Proxy {
  proxyType: 'direct' | 'manual' | 'pac' | 'autodetect' | 'system'
  proxyAutoconfigUrl?: string
  ftpProxy?: string
  httpProxy?: string
  sslProxy?: string
  socksProxy?: string
  socksUsername?: string
  socksPassword?: string
  noProxy?: string
}

export interface Capabilities {
  browserName?: string
  version?: string
  platform?: string
  javascriptEnabled?: boolean
  takesScreenshot?: boolean
  handlesAlerts?: boolean
  databaseEnabled?: boolean
  locationContextEnabled?: boolean
  applicationCacheEnabled?: boolean
  browserConnectionEnabled?: boolean
  cssSelectorsEnabled?: boolean
  webStorageEnabled?: boolean
  rotatable?: boolean
  acceptSslCerts?: boolean
  nativeEvents?: boolean
  proxy?: Proxy
  [key: string]: any
}

export type LocatorStrategy = 'class name' | 'css selector' | 'id' | 'name' | 'link text' | 'partial link text' | 'tag name' | 'xpath'

export interface Cookie {
  name: string
  value: string
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  expiry?: number
}

export interface Timeouts {
  implicit?: number,
  script?: number,
  'page load'?: number
}

export interface Webdriver extends WebdriverCommands { }
export interface WebdriverCommands {
  initSession(capabilities: { desiredCapabilities: Capabilities }): Promise<{ sessionId: string, value: Capabilities }>
  status(): Promise<any>
  getSessions(): Promise<Array<{ id: string, capabilities: Capabilities }>>
  getSession(options?: { sessionId: string }): Promise<Capabilities>
  deleteSession(options?: { sessionId: string }): Promise<void>
  setTimeouts(options: { sessionId?: string, type: keyof Timeouts, ms: number }): Promise<void>
  setAsyncScriptTimeout(options: { sessionId?: string, ms: number }): Promise<void>
  setImplicitWaitTimeout(options: { sessionId?: string, ms: number }): Promise<void>
  getWindowHandle(options?: { sessionId: string }): Promise<string>
  getWindowHandles(options?: { sessionId: string }): Promise<string[]>
  switchToWindow(options: { sessionId?: string, name: string }): Promise<void>
  closeWindow(options?: { sessionId: string }): Promise<void>
  setWindowSize(options: { sessionId?: string, windowHandle: string, width: number, height: number }): Promise<any>
  getWindowSize(options: { sessionId?: string, windowHandle: string }): Promise<{ width: number, height: number }>
  setWindowPosition(options: { sessionId?: string, windowHandle: string, x: number, y: number }): Promise<any>
  getWindowPosition(options: { sessionId?: string, windowHandle: string }): Promise<{ x: number, y: number }>
  maximizeWindow(options: { sessionId?: string, windowHandle: string | 'current' }): Promise<void>
  switchToFrame(options: { sessionId?: string, id: string | number | null | { ELEMENT: string } }): Promise<void>
  switchToParentFrame(options?: { sessionId: string }): Promise<void>
  getCurrentURL(options?: { sessionId: string }): Promise<string>
  go(options: { sessionId?: string, url: string }): Promise<void>
  goForward(options?: { sessionId: string }): Promise<void>
  goBack(options?: { sessionId: string }): Promise<void>
  refresh(options?: { sessionId: string }): Promise<void>
  getSource(options?: { sessionId: string }): Promise<string>
  getTitle(options?: { sessionId: string }): Promise<string>
  getAllCookies(options?: { sessionId: string }): Promise<Cookie[]>
  setCookie(options: { sessionId?: string, cookie: Cookie }): Promise<void>
  deleteAllCookies(options?: { sessionId: string }): Promise<void>
  deleteCookie(options: { sessionId?: string, name: string }): Promise<void>
  setAlertText(options: { sessionId?: string, text: string }): Promise<void>
  getAlertText(options?: { sessionId: string }): Promise<string>
  acceptAlert(options?: { sessionId: string }): Promise<void>
  dismissAlert(options?: { sessionId: string }): Promise<void>
  keys(options: { sessionId?: string, value: string[] }): Promise<void>
  executeScript(options: { sessionId?: string, script: string, args?: any[] }): Promise<any>
  executeAsyncScript(options: { sessionId?: string, script: string, args: any[] }): Promise<any>
  screenshot(options?: { sessionId: string }): Promise<string>
  findElement(options: { sessionId?: string, using: LocatorStrategy, value: string }): Promise<{ ELEMENT: string }>
  findElements(options: { sessionId?: string, using: LocatorStrategy, value: string }): Promise<{ ELEMENT: string }[]>
  getActiveElement(options?: { sessionId: string }): Promise<{ ELEMENT: string }>
  findChildElement(options: { sessionId?: string, id: string, using: LocatorStrategy, value: string }): Promise<{ ELEMENT: string }>
  findChildElements(options: { sessionId?: string, id: string, using: LocatorStrategy, value: string }): Promise<{ ELEMENT: string }[]>
  click(options: { sessionId?: string, id: string }): Promise<void>
  clear(options: { sessionId?: string, id: string }): Promise<void>
  submit(options: { sessionId?: string, id: string }): Promise<void>
  keysElement(options: { sessionId?: string, id: string, value: string[] }): Promise<void>
  getElementText(options: { sessionId?: string, id: string }): Promise<string>
  getElementTagName(options: { sessionId?: string, id: string }): Promise<string>
  getElementAttribute(options: { sessionId?: string, id: string }): Promise<string>
  getElementCssProperty(options: { sessionId?: string, id: string, propertyName: string }): Promise<string>
  getElementSize(options: { sessionId?: string, id: string }): Promise<{ width: number, height: number }>
  getElementLocation(options: { sessionId?: string, id: string }): Promise<{ x: number, y: number }>
  getElementLocationInView(options: { sessionId?: string, id: string }): Promise<{ x: number, y: number }>
  isElementSelected(options: { sessionId?: string, id: string }): Promise<boolean>
  isElementEnabled(options: { sessionId?: string, id: string }): Promise<boolean>
  isElementEqual(options: { sessionId?: string, id: string, other: string }): Promise<boolean>
  isElementDysplayed(options: { sessionId?: string, id: string }): Promise<boolean>
  mouseMoveTo(options: { sessionId?: string, element?: string, xoffset?: number, yoffset?: number }): Promise<void>
  mouseDoubleClick(options?: { sessionId: string }): Promise<void>
  mouseClick(options: { sessionId?: string, button?: 0 | 1 | 2 }): Promise<void>
  mouseDown(options: { sessionId?: string, button?: 0 | 1 | 2 }): Promise<void>
  mouseUp(options: { sessionId?: string, button?: 0 | 1 | 2 }): Promise<void>
  touchClick(options: { sessionId?: string, element: string }): Promise<void>
  touchDown(options: { sessionId?: string, x: number, y: number }): Promise<void>
  touchUp(options: { sessionId?: string, x: number, y: number }): Promise<void>
  touchMove(options: { sessionId?: string, x: number, y: number }): Promise<void>
  touchScroll(options: { sessionId?: string, element?: string, xoffset: number, yoffset: number }): Promise<void>
  touchDoubleClick(options: { sessionId?: string, element: string }): Promise<void>
  touchLongClick(options: { sessionId?: string, element: string }): Promise<void>
  touchFlick(options: { sessionId?: string, element?: string, xoffset?: number, yoffset?: number, speed?: number, xspeed?: number, yspeed?: number }): Promise<void>
  getOrientation(options?: { sessionId: string }): Promise<'LANDSCAPE' | 'PORTRAIT'>
  setOrientation(options: { sessionId?: string, orientation: 'LANDSCAPE' | 'PORTRAIT' }): Promise<void>
  getGeoLocation(options?: { sessionId: string }): Promise<{ latitude: number, longitude: number, altitude: number }>
  setGeoLocation(options: { sessionId?: string, latitude: number, longitude: number, altitude: number }): Promise<void>
  getLocalStorageKeys(options?: { sessionId: string }): Promise<string[]>
  setLocalStorage(options: { sessionId?: string, key: string, value: string }): Promise<void>
  clearLocalStorage(options?: { sessionId: string }): Promise<void>
  getLocalStorageValue(options: { sessionId?: string, key: string }): Promise<string>
  deleteLocalStorageValue(options: { sessionId?: string, key: string }): Promise<void>
  getLocalStorageSize(options?: { sessionId: string }): Promise<number>
  getSessionStorageKeys(options?: { sessionId: string }): Promise<string[]>
  setSessionStorage(options: { sessionId?: string, key: string, value: string }): Promise<void>
  deleteSessionStorage(options?: { sessionId: string }): Promise<void>
  getSessionStorageValue(options: { sessionId?: string, key: string }): Promise<string>
  deleteSessionStorageValue(options: { sessionId?: string, key: string }): Promise<void>
  getSessionStorageSize(options?: { sessionId: string }): Promise<number>
}
