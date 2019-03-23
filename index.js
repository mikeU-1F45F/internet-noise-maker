const nouns = require('./nouns.json')
const Nightmare = require('nightmare')

let stop = false
//let popups = {}
const min_number_of_words = 2
const max_number_of_words = 4

function random_integer_between(a, b) {
  return a + Math.floor((1 + b - a) * Math.random())
}

function get_random_word() {
  return nouns[random_integer_between(0, nouns.length - 1)]
}

async function lucky(words, name) {
  const encodedQueryWords = encodeURIComponent(words.join(' '))
  // kp=1 Safe Search On https://duckduckgo.com/params
  const url = `https://duckduckgo.com/?kp=1&q=${encodedQueryWords}`
  console.info(`Navigating to: ${url}`)

  const browser = new Nightmare({ show: true })
  // TODO: https://github.com/segmentio/nightmare#useragentuseragent

  const pageUrl = await browser
    .goto(url)
    .wait(10000) // arbitrary, I know, but a little related extra traffic is cool too.
    .url()
  const pageTitle = await browser.title().end()

  console.log(`Navigated to Random Page: ${pageTitle} @ ${pageUrl}`)
}

function get_words() {
  const words = []
  const n = random_integer_between(min_number_of_words, max_number_of_words)

  words.push('!ducky')
  for (let i = 0; i < n; i++) {
    words.push(get_random_word())
  }

  return words
}

function noisify(name) {
  stop = false
  lucky(get_words(), name)
}

noisify('noise_a')
