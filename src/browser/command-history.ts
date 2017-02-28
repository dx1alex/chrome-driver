import { Base } from './base'

export class CommandHistory extends Base {

  protected _lastError: CommandHistoryObject
  protected _lastCommand: CommandHistoryObject

  commandHistory: CommandHistoryObject[]

  getCommandHistory(endItems = 0) {
    return this.commandHistory.slice(-endItems)
  }

  getCommandHistoryErrors(endItems = 0) {
    return this.commandHistory.filter(v => v.error).slice(-endItems)
  }

  lastError(err?: any) {
    return this._lastError && this._lastError === err ? this._lastError : err
  }

  lastCommand() {
    return this._lastCommand
  }

}

export interface CommandHistoryObject {
  command: string
  args: any[]
  date: Date
  stack: string
  error?: any
  result?: any
  time?: number
}
