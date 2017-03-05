import { Base } from '../browser/base'
import { Exec } from '../browser/exec'

export interface ChromeExtension extends Exec {
}

export class ChromeExtension extends Base {

  extension<T>(code: string | Function, ...args: any[]) {
    let script = '' + code

    if (typeof code === 'function') {
      script = `return (${script}).apply(null, arguments)`
    }

    return this.executeAsync<T>(async (code: string, args: any[]) => {
      const extensionId = '9d009613-1f79-4455-b5d2-f5fe09bbe044'
      const res = await sendMessageToExtension(extensionId, { code, args })
      if (res.error) throw res.error
      return res.message
    }, script, args)
  }

}

declare function sendMessageToExtension(id: string, message: any): Promise<any>
