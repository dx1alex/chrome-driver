import { ChromeOptions, Chrome } from '../'

let options: ChromeOptions = {
  remote: 'http://localhost:9500',
  window: [0, 0, 1200, 800],
  log: true,
  //verbose: true,
  dataDir: '/tmp/test0',
  ifActiveSession: 'restart'
}

const bro = new Chrome(options)

main()
async function main() {
  try {
    console.log(await bro.getStatus())

    await bro.start()
    console.log(bro.capabilities)

    await bro.go('http://ya.ru')

    console.log(bro.lastCommand())
  } catch (err) {
    console.error(bro.lastError(err))
  }
}