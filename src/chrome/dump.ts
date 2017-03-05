import { Base } from '../browser/base'
import { getDateTime } from '../helpers'
import { ChromeExtension } from './extension'
import { CommandHistory } from '../browser/command-history'
import { Getter } from '../browser/getter'
import { Screenshot } from '../browser/screenshot'

import * as fs from 'fs'

export interface ChromeDump extends ChromeExtension, CommandHistory, Getter, Screenshot {
}

export abstract class ChromeDump extends Base {

  async saveAsMHTML(filePath: string) {
    const mhtml = await this.extension<string>(() => saveAsMHTML())

    const base64Data = mhtml.substr('data:;base64,'.length)

    return new Promise<string>((resolve, reject) => {
      fs.writeFile(<string>filePath, base64Data, 'base64', err => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  async dump(dir?: string) {
    if (!dir) {
      dir = this.capabilities.chrome.userDataDir
    }

    const dumpDir = getDateTime().replace(' ', '_')
    dir = `${dir}/${dumpDir}`
    fs.mkdirSync(dir)

    const commandHistory = JSON.stringify(this.commandHistory, null, '  ')
    const history = new Promise<void>((resolve, reject) => {
      fs.writeFile(`${dir}/command_history.json`, commandHistory, err => {
        if (err) return reject(err)
        resolve()
      })
    })

    const lastError = JSON.stringify(this.lastError(), null, '  ')
    const error = new Promise<void>((resolve, reject) => {
      fs.writeFile(`${dir}/last_error.json`, lastError, err => {
        if (err) return reject(err)
        resolve()
      })
    })

    const html_page = await this.html()
    const html = new Promise<string>((resolve, reject) => {
      fs.writeFile(`${dir}/page.html`, html_page, err => {
        if (err) return reject(err)
        resolve(html_page)
      })
    })

    const mhtml = this.saveAsMHTML(`${dir}/page.mht`)

    const screenshot = this.screenshot(`${dir}/screenshot.png`)

    return Promise.all([history, error, html, mhtml, screenshot])
  }

}

declare function saveAsMHTML(): Promise<string>
