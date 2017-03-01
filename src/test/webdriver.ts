import { Webdriver } from '../webdriver'

const wd = new Webdriver('http://127.0.0.1:9515')

main()
async function main() {
  try {
    let status = await wd.status()
    console.log(status)

    let init = await wd.initSession({ desiredCapabilities: { browserName: 'chrome' } })
    console.log(init)

    await wd.go({ url: 'http://ya.ru' })
    console.log(await wd.getTitle())

  } catch (err) {
    console.error(err)
  } finally {
    console.log(await wd.deleteSession())
  }
}
