import { Base } from "./base"

export class Alert extends Base {

  setAlert(text: string) {
    return this.webdriver.setAlertText({ text })
  }

  getAlert(): Promise<string> {
    return this.webdriver.getAlertText()
  }

  okAlert() {
    return this.webdriver.acceptAlert()
  }

  cancelAlert() {
    return this.webdriver.dismissAlert()
  }

  async alert(accept: boolean, text?: string) {
    if (text) await this._.setAlert(text)
    if (accept) {
      await this._.okAlert()
    } else {
      await this._.cancelAlert()
    }
  }

}