const nouns = require('./nouns.json')
const config = require('./config')
const puppeteer = require('puppeteer')
const UserAgent = require('user-agents')

const randomInterBetween = (a, b) => {
  return a + Math.floor((1 + b - a) * Math.random())
}

const getRandomWord = () => {
  return nouns[randomInterBetween(0, nouns.length - 1)]
}

const getRandomViewport = () => {
  return {
    width: randomInterBetween(
      config.ViewPort.Minimum.width,
      config.ViewPort.Maximum.width,
    ),
    height: randomInterBetween(
      config.ViewPort.Minimum.height,
      config.ViewPort.Maximum.height,
    ),
  }
}

const lucky = async words => {
  const randomUserAgent = new UserAgent()
  const randomViewport = getRandomViewport()
  const encodedQueryWords = encodeURIComponent(words.join(' '))
  // kp=1 Safe Search On https://duckduckgo.com/params
  const url = `https://duckduckgo.com/?kp=1&q=${encodedQueryWords}`

  const browser = await puppeteer.launch({
    args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
  })
  const page = await browser.newPage()
  page.setUserAgent(randomUserAgent.toString())
  page.setViewport(randomViewport)

  console.info(`Navigating to: ${url}`)
  await page.goto(url)
  await page.waitFor(10000) // Arbitrary, I know, but a little extra traffic is cool too.

  const pageUrl = await page.url()
  const pageTitle = await page.title()

  await browser.close()

  console.log(`Internet Noise made at ${new Date()}`)
  console.log(`Title: ${pageTitle}`)
  console.log(`URL: ${pageUrl}`)
  console.log(`Viewport Size: ${randomViewport.width}x${randomViewport.height}`)
  console.log(`User Agent: ${randomUserAgent}`)
}

const getWords = () => {
  const words = []
  const n = randomInterBetween(
    config.WordCount.Minimum,
    config.WordCount.Maximum,
  )

  words.push('!ducky') // Like Google's I'm Feeling Lucky
  for (let i = 0; i < n; i++) {
    words.push(getRandomWord())
  }

  return words
}

const delay = async ms => {
  return await new Promise(resolve => setTimeout(resolve, ms))
}

const noisify = async () => {
  // TODO: Make graceful exit
  while (true) {
    await lucky(getWords())
    await delay(10 * 1000)
  }
}

noisify()
// Thanks to @The_HatedOne_ and http://makeinternetnoise.com/ for the inspiration
