export * from './keys'

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      derivedCtor.prototype[name] = baseCtor.prototype[name]
    })
  })
}

export function getDateTime(d = new Date()) {
  return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)} `
    + `${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}:${('0' + d.getSeconds()).slice(-2)}.${(d.getMilliseconds())}`
}


export function setArgs(args: Array<string>, key: string, value?: string | boolean) {
  let i = args.findIndex(v => v.split('=')[0] === key)
  if (typeof value === 'string') {
    const val = key + '=' + value
    if (i >= 0) {
      args[i] = val
    } else {
      args.push(val)
      i = args.length - 1
    }
  } else if (i < 0 && (value || value == null)) {
    args.push(key)
    i = args.length - 1
  } else if (i >= 0) {
    args.splice(i, 1)
    i = -1
  }
  return i
}