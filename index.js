const nouns = require('./nouns.json')
const puppeteer = require('puppeteer')
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
  const randomUserAgent = new UserAgent()
  const encodedQueryWords = encodeURIComponent(words.join(' '))
  // kp=1 Safe Search On https://duckduckgo.com/params
  const url = `https://duckduckgo.com/?kp=1&q=${encodedQueryWords}`

  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  page.setUserAgent(randomUserAgent.toString())
  page.setViewport(getRandomViewport())

  console.info(`Navigating to: ${url}`)
  await page.goto(url)
  await page.waitFor(10000)

  // let pagetUrl = ''
  // let pageTitle = ''
  // try {
  //   pageUrl = await browser
  //     .goto(url)
  //     .click('.result__a')
  //     .wait(10000) // arbitrary, I know, but a little related extra traffic is cool too.
  //     .url()
  //   pageTitle = await browser.title().end()
  // } catch (error) {
  //   console.error(error)
  // }

  await browser.close()

  // console.log(`Internet Noise made at ${new Date()}`)
  // console.log(`Title: ${pageTitle}`)
  // console.log(`URL: ${pageUrl}`)
  // console.log(`Viewport Size: ${randomViewport.width}x${randomViewport.height}`)
  // console.log(`User Agent: ${randomUserAgent}`)
}

const getWords = () => {
  const words = []
  const n = randomInterBetween(minNumberOfWords, maxNumberOfWords)

  words.push('!ducky')
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
