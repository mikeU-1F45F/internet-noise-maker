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
  console.log(`\r\nMaking Internet Noise at ${new Date()}`)

  const randomUserAgent = new UserAgent()
  const randomViewport = getRandomViewport()
  const randomMsViewingPage = getRandomMsViewingPage()

  const encodedQueryWords = encodeURIComponent(words.join(' '))
  // kp=1 Safe Search On https://duckduckgo.com/params
  const url = `https://duckduckgo.com/?kp=1&q=${encodedQueryWords}`

  const launchOptions = {
    args: [
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    headless: false,
  }
  if (process.env.NODE_ENV === 'production') {
    launchOptions.executablePath = '/usr/bin/chromium-browser'
    launchOptions.headless = true
  }
  const browser = await puppeteer.launch(launchOptions)

  let pageUrl = ''
  let pageTitle = ''
  try {
    const page = await browser.newPage()

    page.setUserAgent(randomUserAgent.toString())
    console.log(`Set user agent to ${randomUserAgent}`)

    page.setViewport(randomViewport)
    console.log(
      `Set viewport to ${randomViewport.width}x${randomViewport.height}`,
    )

    console.info(`DDG search: ${url}`)
    await page.goto(url)

    console.log(`Waiting on page for ${randomMsViewingPage / 1000} seconds`)
    await page.waitFor(randomMsViewingPage)

    pageTitle = await page.title()
    console.log(`Title: ${pageTitle}`)
    pageUrl = await page.url()
    console.log(`URL: ${pageUrl}`)
  } catch (error) {
    console.log('Exception', error.message)
  }
  await browser.close()
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
  if (process.env.NODE_ENV) {
    console.log(`Running with NODE_ENV=${process.env.NODE_ENV}`)
  }

  let randomMsBeforeNextPage = getRandomMsToNextPage()
  // TODO: Make graceful exit
  while (true) {
    await lucky(getWords())
    console.log(
      `Delaying ${randomMsBeforeNextPage / 1000} seconds before next page`,
    )
    await delay((randomMsBeforeNextPage = getRandomMsToNextPage()))
  }
}

noisify()

// Thanks to @The_HatedOne_ and http://makeinternetnoise.com/ for the inspiration
