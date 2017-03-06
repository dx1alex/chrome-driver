import { ChromeOptions, Chrome } from '../chrome'

let options: ChromeOptions = {
  remote: 'http://localhost:9500',
  window: [0, 0, 1200, 800],
  //log: 'console.info',
  dataDir: '/tmp/test0',
  onSessionExests: 'restart',
}

const bro = new Chrome(options)

main()
async function main() {
  try {
    await bro.start('https://vk.com')
    let url = await bro.url.parse()
    url = await bro.url.startsWith('https://vk.com')
    console.log('url', url)

    let title = await bro.title()
    console.log('title', title)

    title = await bro.title.toUpperCase()
    console.log('title', title)

    console.log(JSON.stringify(bro.lastCommand()))
  } catch (err) {
    console.error(bro.lastError(err))
  }
}