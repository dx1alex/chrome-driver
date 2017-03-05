import { Base } from '../browser/base'
import { ChromeExtension } from './extension'

import * as fs from 'fs'

export interface ChromeCapture extends ChromeExtension {
}

export class ChromeCapture extends Base {

  async captureTab() {
    const png = await this.extension<string>(() => {
      return new Promise((resolve, reject) => {
        chrome.tabs.captureVisibleTab({ format: 'png' }, resolve)
      })
    })

    return png.substr('data:image/png;base64,'.length)
  }

}

