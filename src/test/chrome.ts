import { ChromeOptions, Chrome } from '../chrome'

let options: ChromeOptions = {
  remote: 'http://localhost:9500',
  window: [0, 0, 1200, 800],
  //log: 'console.info',
  dataDir: '/tmp/test0',
  onSessionExists: 'restart',
}


const bro = new Chrome(options)

main()
async function main() {
  try {
    await bro.start('http://m.vk.com')
    await bro.capture('#mhead > a > div', './1.png')
  } catch (err) {
    console.error(bro.lastError(err))
  }
}