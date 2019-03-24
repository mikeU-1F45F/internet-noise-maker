const nouns = require('./nouns')
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
      config.viewPort.minimum.width,
      config.viewPort.maximum.width,
    ),
    height: randomInterBetween(
      config.viewPort.minimum.height,
      config.viewPort.maximum.height,
    ),
  }
}

const getRandomMsToNextPage = () => {
  return (
    randomInterBetween(
      config.delay.secondsToNextPage.minimum,
      config.delay.secondsToNextPage.maximum,
    ) * 1000
  )
}

const getRandomMsViewingPage = () => {
  return (
    randomInterBetween(
      config.delay.secondsViewingPage.minimum,
      config.delay.secondsViewingPage.maximum,
    ) * 1000
  )
}

const lucky = async words => {
  const randomUserAgent = new UserAgent()
  const randomViewport = getRandomViewport()
  const randomMsViewingPage = getRandomMsViewingPage()

  const encodedQueryWords = encodeURIComponent(words.join(' '))
  // kp=1 Safe Search On https://duckduckgo.com/params
  const url = `https://duckduckgo.com/?kp=1&q=${encodedQueryWords}`

  const browser = await puppeteer.launch({
    args: [
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
    ],
    executablePath: '/usr/bin/chromium-browser',
    //headless: false,
  })

  let pageUrl = ''
  let pageTitle = ''
  try {
    const page = await browser.newPage()
    page.setUserAgent(randomUserAgent.toString())
    page.setViewport(randomViewport)

    console.info(`Navigating to: ${url}`)
    await page.goto(url)
    await page.waitFor(randomMsViewingPage)

    pageUrl = await page.url()
    pageTitle = await page.title()
  } catch (error) {
    console.log('Exception', id, error.message)
  }
  await browser.close()

  console.log(`Internet Noise made at ${new Date()}`)
  console.log(`Title: ${pageTitle}`)
  console.log(`URL: ${pageUrl}`)
  console.log(`Viewport Size: ${randomViewport.width}x${randomViewport.height}`)
  console.log(`User Agent: ${randomUserAgent}`)
  console.log(`Viewed Page for ${randomMsViewingPage / 1000} seconds`)
}

const getWords = () => {
  const words = []
  const n = randomInterBetween(
    config.wordCount.minimum,
    config.wordCount.maximum,
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
  let randomMsBeforNextPage = getRandomMsToNextPage()
  // TODO: Make graceful exit
  while (true) {
    await lucky(getWords())
    console.log(
      `Delay seconds before next page: ${randomMsBeforNextPage / 1000}`,
    )
    await delay((randomMsBeforNextPage = getRandomMsToNextPage()))
  }
}

noisify()
// Thanks to @The_HatedOne_ and http://makeinternetnoise.com/ for the inspiration
