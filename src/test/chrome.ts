import { ChromeOptions, Chrome } from '../chrome'

let options: ChromeOptions = {
  remote: 'http://localhost:9500',
  window: [0, 0, 1200, 800],
  log: 'console.info',
  dataDir: '/tmp/test0',
  onSessionExests: 'restart',
}

const bro = new Chrome(options)

main()
async function main() {
  try {
    await bro.start('https://vk.com/about')
    await bro.screenshot('/tmp/4.png')

    await bro.sleep(1000)
    console.log(JSON.stringify(bro.lastCommand()))
  } catch (err) {
    console.error(bro.lastError(err))
  }
}