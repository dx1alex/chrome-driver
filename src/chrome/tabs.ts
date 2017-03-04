import { Base } from '../browser/base'
import { ChromeExtension } from './extension'

export interface ChromeTabs extends ChromeExtension {
}

export class ChromeTabs extends Base {

  fullscreen() {
    return this.extension(() => {
      return fullscreen()
    })
  }

}

declare function fullscreen(): Promise<void>
