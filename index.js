const nouns = require('./nouns.json')
const Nightmare = require('nightmare')
const UserAgent = require('user-agents')

const minNumberOfWords = 2
const maxNumberOfWords = 4

const minViewPort = {
  width: 360,
  height: 640,
}
const maxViewPort = {
  width: 1920,
  height: 1080,
}

const randomInterBetween = (a, b) => {
  return a + Math.floor((1 + b - a) * Math.random())
}

const getRandomWord = () => {
  return nouns[randomInterBetween(0, nouns.length - 1)]
}

const getRandomViewport = () => {
  return {
    width: randomInterBetween(minViewPort.width, maxViewPort.width),
    height: randomInterBetween(minViewPort.height, maxViewPort.height),
  }
}

const lucky = async words => {
  const encodedQueryWords = encodeURIComponent(words.join(' '))
  // kp=1 Safe Search On https://duckduckgo.com/params
  const url = `https://duckduckgo.com/?kp=1&q=${encodedQueryWords}`
  console.info(`Navigating to: ${url}`)

  const browser = new Nightmare({ show: true })
  const randomUserAgent = new UserAgent()
  const randomViewport = getRandomViewport()

  browser.useragent(randomUserAgent.toString())
  browser.viewport(randomViewport.width, randomViewport.height)

  const pageUrl = await browser
    .goto(url)
    .click('.result__a')
    .wait(10000) // arbitrary, I know, but a little related extra traffic is cool too.
    .url()
  const pageTitle = await browser.title().end()

  console.log(`Internet Noise made at ${new Date()}`)
  console.log(`Title: ${pageTitle}`)
  console.log(`URL: ${pageUrl}`)
  console.log(`Viewport Size: ${randomViewport.width}x${randomViewport.height}`)
  console.log(`User Agent: ${randomUserAgent}`)
}

const getWords = () => {
  const words = []
  const n = randomInterBetween(minNumberOfWords, maxNumberOfWords)

  for (let i = 0; i < n; i++) {
    words.push(getRandomWord())
  }

  return words
}

const delay = async ms => {
  return await new Promise(resolve => setTimeout(resolve, ms))
}

const noisify = async () => {
  while (true) {
    // TODO: Make graceful exit
    await lucky(getWords())
    await delay(10 * 1000)
  }
}

noisify()
// Thanks to @The_HatedOne_ and http://makeinternetnoise.com/ for the inspiration
