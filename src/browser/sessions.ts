import { Base, Capabilities } from "./base";

export class Sessions extends Base {

  getSession(sessionId?: string) {
    if (!sessionId) sessionId = this.sessionId
    return this.webdriver.getSession({ sessionId })
  }

  deleteSession(sessionId: string) {
    return this.webdriver.deleteSession({ sessionId })
  }

  getSessions() {
    return this.webdriver.getSessions({ sessionId: this.sessionId })
  }

}