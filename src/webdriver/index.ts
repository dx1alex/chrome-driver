import * as fs from 'fs'
import * as URL from 'url'
import * as http from 'http'
import * as https from 'https'
import commands from './commands'

export class Webdriver {
  debug: WebdriverDebug
  options: WebdriverOptions
  sessionId: string = ''

  constructor(options: WebdriverOptions | string) {
    this.options = typeof options === 'string' ? { url: options } : Object.assign({}, options)
    this.options.url = this.options.url.replace(/\/+$/, '')

    if (this.options.debug === true) {
      this.debug = {
        logId: '' + process.pid,
        stdout: process.stdout,
        stderr: process.stderr
      }
    } else if (this.options.debug) {
      this.debug = Object.assign({}, this.options.debug)
      this.debug.logId = this.debug.logId || '' + process.pid

      if (this.debug.stdout) {
        this.debug.stdout = typeof this.debug.stdout === 'string'
          ? fs.createWriteStream(this.debug.stdout, { flags: 'a' }) : this.debug.stdout
      } else if (this.debug.stdout !== false) {
        this.debug.stdout = process.stdout
      }

      if (this.debug.stderr) {
        this.debug.stderr = typeof this.debug.stderr === 'string'
          ? fs.createWriteStream(this.debug.stderr, { flags: 'a' }) : this.debug.stderr
      } else if (this.debug.stderr !== false) {
        this.debug.stderr = this.debug.stdout || process.stdout
      }
    }

    for (let command of Object.keys(commands)) {
      this[command] = (data: any) => {
        let path: string = commands[command][1]
        path = path.replace(/:([a-zA-Z_$]+)/g, (m, p) => {
          if (p === 'sessionId') {
            if (!this.sessionId) throw new Error(`No set sessionId`)
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

        return this._requestHandler(command, commands[command][0], path, Object.keys(postData).length ? postData : undefined)
      }
    }
  }

  async initSession(capabilities: { desiredCapabilities: Capabilities }) {
    const options: https.RequestOptions = <any>URL.parse(this.options.url + '/session')
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

  protected writeLog(data: any) {
    if (!this.debug || this.debug.disableLog) return
    const out: any = data.status != 'ERROR' ? this.debug.stdout : this.debug.stderr
    if (!out) return
    const log = this.formatLog(data);
    out.write(log)
  }

  protected formatLog(data: any) {
    if (this.debug.format) return this.debug.format(this.debug.logId, data)
    return `[${data.status}] ${getDateTime()} ${this.debug.logId} (${data.command})
REQUEST: ${data.method} ${data.url} ${!data.postData ? '' : '\n' + data.postData}
RESPONSE: ${data.statusCode}
${data.data}\n\n`
  }

  private async _requestHandler(command: string, method: string, path: string, postData?: any): Promise<any> {
    const url = this.options.url + path
    const options: https.RequestOptions = <any>URL.parse(url)
    options.method = method
    Object.assign(options, this.options, options)

    try {
      const data = await this.request(options, postData ? JSON.stringify(postData) : undefined)
      this.writeLog({
        status: 'INFO',
        command,
        method,
        url,
        postData: postData ? JSON.stringify(postData) : undefined,
        statusCode: 200,
        data: JSON.stringify(data)
      })
      return data.value
    } catch (err) {
      if (err.statusCode) {
        this.writeLog({
          status: 'ERROR',
          command,
          method,
          url,
          postData: postData ? JSON.stringify(postData) : undefined,
          statusCode: err.statusCode,
          data: err.message
        })
      }
      throw err
    }
  }
}

function getDateTime() {
  const d = new Date()
  return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)} `
    + `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}:${('0' + d.getSeconds()).slice(-2)}.${(d.getMilliseconds())}`
}

export interface WebdriverLog {
  status: 'ERROR' | 'INFO'
  command: keyof WebdriverCommands
  method: string
  url: string
  postData: string
  statusCode: string | number
  data: string
}

export interface WebdriverOptions extends https.RequestOptions, http.RequestOptions {
  url: string
  debug?: WebdriverDebug | boolean
}

export interface WebdriverDebug {
  disableLog?: boolean
  logId?: string
  stdout?: typeof process.stdout | string | boolean
  stderr?: typeof process.stderr | string | boolean
  format?: (logId: string, data: any) => string
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
  browserName: string
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
  getSession(options: { sessionId: string }): Promise<Capabilities>
  getSessions(options: { sessionId: string }): Promise<Array<{ id: string, capabilities: Capabilities }>>
  deleteSession(options: { sessionId: string }): Promise<void>
  setTimeouts(options: { type: keyof Timeouts, ms: number }): Promise<void>
  setAsyncScriptTimeout(options: { ms: number }): Promise<void>
  setImplicitWaitTimeout(options: { ms: number }): Promise<void>
  getWindowHandle(): Promise<string>
  getWindowHandles(): Promise<string[]>
  switchToWindow(options: { name: string }): Promise<void>
  closeWindow(): Promise<void>
  setWindowSize(options: { windowHandle: string, width: number, height: number }): Promise<any>
  getWindowSize(options: { windowHandle: string }): Promise<{ width: number, height: number }>
  setWindowPosition(options: { windowHandle: string, x: number, y: number }): Promise<any>
  getWindowPosition(options: { windowHandle: string }): Promise<{ x: number, y: number }>
  maximizeWindow(options: { windowHandle: string | 'current' }): Promise<void>
  switchToFrame(options: { id: string | number | null | { ELEMENT: string } }): Promise<void>
  switchToParentFrame(): Promise<void>
  getCurrentURL(): Promise<string>
  go(options: { url: string }): Promise<void>
  goForward(): Promise<void>
  goBack(): Promise<void>
  refresh(): Promise<void>
  getSource(): Promise<string>
  getTitle(): Promise<string>
  getAllCookies(): Promise<Cookie[]>
  setCookie(options: { cookie: Cookie }): Promise<void>
  deleteAllCookies(): Promise<void>
  deleteCookie(options: { name: string }): Promise<void>
  setAlertText(options: { text: string }): Promise<void>
  getAlertText(): Promise<string>
  acceptAlert(): Promise<void>
  dismissAlert(): Promise<void>
  keys(options: { value: string[] }): Promise<void>
  executeScript(options: { script: string, args?: any[] }): Promise<any>
  executeAsyncScript(options: { script: string, args: any[] }): Promise<any>
  screenshot(): Promise<string>
  findElement(options: { using: LocatorStrategy, value: string }): Promise<{ ELEMENT: string }>
  findElements(options: { using: LocatorStrategy, value: string }): Promise<{ ELEMENT: string }[]>
  getActiveElement(): Promise<{ ELEMENT: string }>
  findChildElement(options: { id: string, using: LocatorStrategy, value: string }): Promise<{ ELEMENT: string }>
  findChildElements(options: { id: string, using: LocatorStrategy, value: string }): Promise<{ ELEMENT: string }[]>
  click(options: { id: string }): Promise<void>
  clear(options: { id: string }): Promise<void>
  submit(options: { id: string }): Promise<void>
  keysElement(options: { id: string, value: string[] }): Promise<void>
  getElementText(options: { id: string }): Promise<string>
  getElementTagName(options: { id: string }): Promise<string>
  getElementAttribute(options: { id: string }): Promise<string>
  getElementCssProperty(options: { id: string, propertyName: string }): Promise<string>
  getElementSize(options: { id: string }): Promise<{ width: number, height: number }>
  getElementLocation(options: { id: string }): Promise<{ x: number, y: number }>
  getElementLocationInView(options: { id: string }): Promise<{ x: number, y: number }>
  isElementSelected(options: { id: string }): Promise<boolean>
  isElementEnabled(options: { id: string }): Promise<boolean>
  isElementEqual(options: { id: string, other: string }): Promise<boolean>
  isElementDysplayed(options: { id: string }): Promise<boolean>
  mouseMoveTo(options: { element?: string, xoffset?: number, yoffset?: number }): Promise<void>
  mouseDoubleClick(): Promise<void>
  mouseClick(options: { button?: 0 | 1 | 2 }): Promise<void>
  mouseDown(options: { button?: 0 | 1 | 2 }): Promise<void>
  mouseUp(options: { button?: 0 | 1 | 2 }): Promise<void>
  touchClick(options: { element: string }): Promise<void>
  touchDown(options: { x: number, y: number }): Promise<void>
  touchUp(options: { x: number, y: number }): Promise<void>
  touchMove(options: { x: number, y: number }): Promise<void>
  touchScroll(options: { element?: string, xoffset: number, yoffset: number }): Promise<void>
  touchDoubleClick(options: { element: string }): Promise<void>
  touchLongClick(options: { element: string }): Promise<void>
  touchFlick(options: { element?: string, xoffset?: number, yoffset?: number, speed?: number, xspeed?: number, yspeed?: number }): Promise<void>
  getOrientation(): Promise<'LANDSCAPE' | 'PORTRAIT'>
  setOrientation(options: { orientation: 'LANDSCAPE' | 'PORTRAIT' }): Promise<void>
  getGeoLocation(): Promise<{ latitude: number, longitude: number, altitude: number }>
  setGeoLocation(options: { latitude: number, longitude: number, altitude: number }): Promise<void>
  getLocalStorageKeys(): Promise<string[]>
  setLocalStorage(options: { key: string, value: string }): Promise<void>
  clearLocalStorage(): Promise<void>
  getLocalStorageValue(options: { key: string }): Promise<string>
  deleteLocalStorageValue(options: { key: string }): Promise<void>
  getLocalStorageSize(): Promise<number>
  getSessionStorageKeys(): Promise<string[]>
  setSessionStorage(options: { key: string, value: string }): Promise<void>
  deleteSessionStorage(): Promise<void>
  getSessionStorageValue(options: { key: string }): Promise<string>
  deleteSessionStorageValue(options: { key: string }): Promise<void>
  getSessionStorageSize(): Promise<number>
}
