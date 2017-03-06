import { Base } from '../browser/base'
import { ChromeExtension } from './extension'

export interface ChromeTabs extends ChromeExtension {
}

export abstract class ChromeTabs extends Base {

  fullscreen() {
    return this.extension(() => fullscreen())
  }

  focused() {
    return this.extension(() => focused())
  }

}

declare function fullscreen(): Promise<void>
declare function focused(): Promise<void>
