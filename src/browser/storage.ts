import { Base } from './base'

export abstract class Storage extends Base {

  localStorage(): Promise<string[]>
  localStorage(key: string): Promise<string>
  localStorage(key: string, value: string): Promise<void>
  localStorage(key?: string, value?: string): Promise<any> {
    if (!key) {
      return this.webdriver.getLocalStorageKeys()
    }
    if (!value) {
      return this.webdriver.getLocalStorageValue({ key })
    }
    return this.webdriver.setLocalStorage({ key, value })
  }

  deleteLocalStorage(): Promise<void>
  deleteLocalStorage(key: string): Promise<void>
  deleteLocalStorage(key?: string) {
    if (!key) {
      return this.webdriver.clearLocalStorage()
    }
    return this.webdriver.deleteLocalStorageValue({ key })
  }

}