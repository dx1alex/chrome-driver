import { Base, Cookie } from './base'

export abstract class Cookies extends Base {

  setCookie(cookie: Cookie) {
    return this.webdriver.setCookie({ cookie })
  }

  getCookies() {
    return this.webdriver.getAllCookies()
  }

  deleteCookie(name: string) {
    return this.webdriver.deleteCookie({ name })
  }

  deleteAllCookies() {
    return this.webdriver.deleteAllCookies()
  }

}