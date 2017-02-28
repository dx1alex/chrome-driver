import {
  Browser,
  Capabilities,
  PauseSettings,
  Timeouts,
  Proxy
} from './browser'

import * as fs from 'fs'
import * as path from 'path'

export class Chrome extends Browser {
  protected static _no_proxy_list: string[] = Browser._no_proxy_list.concat('setArgs')
  static default_prefs: object = {
    session: {
      restore_on_startup: 4,
      startup_urls: ['about:blank']
    }
  }
  static default_args = [
    'disable-background-networking',
    'disable-client-side-phishing-detection',
    'disable-component-update',
    'disable-hang-monitor',
    'disable-prompt-on-repost',
    'disable-default-apps',
    'disable-translate',
    'disable-sync',
    'disable-web-resources',
    'disable-translate-new-ux',
    'disable-session-crashed-bubble',
    'disable-password-manager-reauthentication',
    'disable-save-password-bubble',
    'disable-plugins-discovery',
    'disable-plugins',
    'disable-web-security',
    'no-sandbox',
    'safe-plugins',
    'allow-running-insecure-content',
    'ignore-urlfetcher-cert-requests',
    'safebrowsing-disable-auto-update',
    'safebrowsing-disable-download-protection',
    'ignore-certificate-errors',
    'metrics-recording-only',
    'no-default-browser-check',
    'no-first-run',
    'no-managed-user-acknowledgment-check',
    'no-network-profile-warning',
    'no-pings',
    'noerrdialogs',
    'disable-bundled-ppapi-flash'
  ]

  constructor(chromeOptions: ChromeOptions) {
    const options: ChromeOptions = JSON.parse(JSON.stringify(chromeOptions))

    const dc: ChromeOptionsCapabilities = {
      browserName: 'chrome',
      chromeOptions: {
        args: [... new Set(Chrome.default_args.concat(options.args || []))],
        binary: options.binary,
        extensions: options.extensions,
        localState: options.localState,
        prefs: options.prefs || Chrome.default_prefs,
        detach: options.detach,
        debuggerAddress: options.debuggerAddress,
        excludeSwitches: options.excludeSwitches,
        minidumpPath: options.minidumpPath,
        windowTypes: options.windowTypes,
        mobileEmulation: options.mobileEmulation,
        perfLoggingPrefs: options.perfLoggingPrefs
      }
    }

    options.desiredCapabilities = Object.assign(options.desiredCapabilities || {}, dc)

    super(options)
  }

  async start(startOptions?: ChromeStartOptions) {
    const options: ChromeStartOptions = JSON.parse(JSON.stringify(Object.assign({}, this.options, startOptions)))
    const chromeOptions = options.desiredCapabilities.chromeOptions

    if (options.dataDir) {
      const userDataDir = path.join(options.dataDir, options.user ? options.user + '' : '')
      const sessions = await this.webdriver.getSessions()
      for (const v of sessions) {
        if (v.capabilities.chrome.userDataDir === userDataDir) {
          switch (options.ifActiveSession) {
            case 'continue':
              this.sessionId = this.webdriver.sessionId = v.id
              this.capabilities = v.capabilities
              this.started = true
              return
            case 'restart':
              this.webdriver.sessionId = v.id
              await this.webdriver.deleteSession({ sessionId: v.id })
              break
            case 'exception':
            default:
              throw new Error(`session ${v.id} with profile ${userDataDir} is exists`)
          }
          break
        }
      }
      setArgs(chromeOptions.args, 'user-data-dir', userDataDir)
    }

    if (options.useragent) {
      setArgs(chromeOptions.args, 'user-agent', options.useragent)
    }

    if (options.enableFlash) {
      setArgs(chromeOptions.args, 'disable-bundled-ppapi-flash', false)
    }

    await super.start(options)

    if (options.fullscreen) {
      //TODO 
      //await this._.fullscreen()
    }
  }

  setArgs(key: string, value?: string | boolean): number
  setArgs(args: string[]): number
  setArgs(args: { [key: string]: string | boolean }): number
  setArgs(args?: string | string[] | { [key: string]: string | boolean }, value?: string | boolean) {
    if (Array.isArray(args)) {
      this.options.desiredCapabilities.chromeOptions.args = args
      return 0
    } else if (typeof args === 'string') {
      return setArgs(this.options.desiredCapabilities.chromeOptions.args, args, value)
    }

    for (let k of Object.keys(args)) {
      setArgs(this.options.desiredCapabilities.chromeOptions.args, k, value)
    }
    return 0
  }

}

function setArgs(args: Array<string>, key: string, value?: string | boolean) {
  let i = args.findIndex(v => v.split('=')[0] === key)
  if (typeof value === 'string') {
    const val = key + '=' + value
    if (i >= 0) {
      args[i] = val
    } else {
      args.push(val)
      i = args.length - 1
    }
  } else if (i < 0 && (value || value == null)) {
    args.push(key)
    i = args.length - 1
  } else if (i >= 0) {
    args.splice(i, 1)
    i = -1
  }
  return i
}

export interface ChromeOptions extends ChromeStartOptions {
  remote: string
  log?: string | boolean
  verbose?: boolean
  waitTimeout?: number
  waitInterval?: number
  pause?: PauseSettings
  noCommandHistory?: boolean
}

export interface ChromeStartOptions extends ChromeOptionsCapabilities {
  proxy?: any
  url?: string
  maximaze?: boolean
  windowSize?: number[]
  windowPosition?: number[]
  timeouts?: Timeouts
  useragent?: string
  fullscreen?: boolean
  enableFlash?: boolean
  dataDir?: string
  user?: string
  profile?: string
  ifActiveSession?: 'exception' | 'restart' | 'continue'
  desiredCapabilities?: ChromeOptionsCapabilities
}

export interface ChromeOptionsCapabilities extends Capabilities {
  args?: string[]
  binary?: string
  extensions?: string[]
  localState?: { [key: string]: any }
  prefs?: { [key: string]: any }
  detach?: boolean
  debuggerAddress?: string
  excludeSwitches?: string[]
  minidumpPath?: string
  windowTypes?: string[]

  /**
   * A dictionary with either a value for “deviceName,” or values for “deviceMetrics” and “userAgent” 
   * Refer to Mobile Emulation for more information.
   */
  mobileEmulation?: {
    deviceName?: string
    deviceMetrics?: {
      width: number
      height: number
      pixelRatio: number
    }
    userAgent?: string
  }

  /**
   * An optional dictionary that specifies performance logging preferences
   */
  perfLoggingPrefs?: {

    /**
     * Whether or not to collect events from Network domain.
     * @type {boolean}
     */
    enableNetwork?: boolean

    /**
     * Whether or not to collect events from Page domain. 
     * @type {boolean}
     */
    enablePage?: boolean

    /**
     * Whether or not to collect events from Timeline domain. 
     * Note: when tracing is enabled, Timeline domain is implicitly disabled, unless enableTimeline is explicitly set to true.
     * (false if tracing is enabled)	
     * @type {boolean}
     */
    enableTimeline?: boolean

    /**
     * A comma-separated string of Chrome tracing categories for which trace events should be collected. 
     * An unspecified or empty string disables tracing.
     * (empty)
     * @type {string}
     */
    tracingCategories?: string

    /**
     * The requested number of milliseconds between DevTools trace buffer usage events. 
     * For example, if 1000, then once per second, DevTools will report how full the trace buffer is. 
     * If a report indicates the buffer usage is 100%, a warning will be issued.
     * (positive integer 1000)
     * @type {number}
     */
    bufferUsageReportingInterval?: number
  }
}
