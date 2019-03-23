const nouns = require('./nouns.json')
const Nightmare = require('nightmare')
const UserAgent = require('user-agents')

const minNumberOfWords = 2
const maxNumberOfWords = 4

function randomInterBetween(a, b) {
  return a + Math.floor((1 + b - a) * Math.random())
}

function getRandomWord() {
  return nouns[randomInterBetween(0, nouns.length - 1)]
}

async function lucky(words, name) {
  const encodedQueryWords = encodeURIComponent(words.join(' '))
  // kp=1 Safe Search On https://duckduckgo.com/params
  const url = `https://duckduckgo.com/?kp=1&q=${encodedQueryWords}`
  console.info(`Navigating to: ${url}`)

  const userAgent = new UserAgent()
  const browser = new Nightmare({ show: true })
  browser.useragent(userAgent.toString())

  const pageUrl = await browser
    .goto(url)
    .wait(10000) // arbitrary, I know, but a little related extra traffic is cool too.
    .url()
  const pageTitle = await browser.title().end()

  console.log(`Navigated to Random Page: ${pageTitle} @ ${pageUrl}`)
}

function getWords() {
  const words = []
  const n = randomInterBetween(minNumberOfWords, maxNumberOfWords)

  words.push('!ducky') // Like Google's I'm feeling lucky button
  for (let i = 0; i < n; i++) {
    words.push(getRandomWord())
  }

  return words
}

function noisify(name) {
  stop = false
  lucky(getWords(), name)
}

noisify('noise_a')
