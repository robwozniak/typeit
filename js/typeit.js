const DEFAULT_SPEED        = 95
const DEFAULT_DELAY        = 650
const DEFAULT_TYPEIT_CLASS = 'typeit'

class Typeit {
  constructor(selector, config) {
    if (!config || !config.words) return

    this.element     = selector instanceof Element ? selector : document.querySelector(selector)
    this.initWord    = this.element.textContent
    this.words       = this.initWord ? [this.initWord].concat(config.words): config.words
    this.speed       = config.speed || DEFAULT_SPEED
    this.delay       = config.delay || DEFAULT_DELAY
    this.letterTag   = config.letterTag || false
    this.letterClass = config.letterClass || false
    this.backwards   = config.backwards || false
    this.leaveLast   = config.leaveLast || false
    this.isInfinity  = config.infinity && !config.leaveLast || false
    this.onType      = config.onType || false
    this.onClear     = config.onClear || false
    this.onComplete  = config.onComplete || false
    this.events      = { onType: false, onClear: false, onComplete: false }

    this.element.classList.add(DEFAULT_TYPEIT_CLASS)

    this.initBaseEvents()
    this.initTypeLoop()

    if (config.infinity && config.leaveLast) {
      console.warn('Both infinity and leaveLast options are selected. Loop will be disabled. Please update your settings.')
    }
  }

  initBaseEvents() {
    for (let eventName in this.events) {
      if (this.events.hasOwnProperty(eventName)) {
        this.events[eventName] = new Event(eventName)
        this.element.addEventListener(eventName, (event) => {
          if (this[eventName] instanceof Function) {
            this[eventName].call(event, event, event.detail)
          }
        })
      }
    }
  }

  updateBaseEventsDetailData(word) {
    for (let eventName in this.events) {
      if (this.events.hasOwnProperty(eventName)) {
        this.events[eventName]['detail'] = word
      }
    }
  }

  initTypeLoop() {
    for (let idx = 0, typePromise = Promise.resolve(); idx < this.words.length; idx++) {
      typePromise = typePromise.then(() => {
        this.isLastWord = this.words.length - 1 === idx
        this.updateBaseEventsDetailData(this.words[idx])

        return this.type(this.words[idx])
          .then(() => this.wait(this.delay))
          .then(() => this.clear(this.words[idx]))
      }).then(() => {
        if (this.isInfinity && this.isLastWord) {
          this.initTypeLoop()
        }
        else if (!this.isInfinity && this.isLastWord) {
          this.element.dispatchEvent(this.events.onComplete)
        }
      })
    }
  }

  prepareLetter(letter) {
    return this.letterTag ? `<${this.letterTag} class="${this.letterClass || ''}">${letter}</${this.letterTag}>` : letter
  }

  type(word) {
    return new Promise(resolve => {
      if (this.element.textContent) {
        resolve(word)
        return
      }

      this.element.dispatchEvent(this.events.onType)

      let cursorPosition = 0
      const typeLoop = setInterval(() => {
        if (word[cursorPosition]) {
          this.element.insertAdjacentHTML(
            'beforeend',
            this.prepareLetter(word[cursorPosition])
          )
        }
        else {
          clearInterval(typeLoop)
          resolve(word)
          return
        }

        cursorPosition++
      }, this.speed)
    })
  }

  wait(time) {
    return new Promise(resolve => setTimeout(() => resolve(time), time))
  }

  clear(word) {
    return new Promise(resolve => {
      if (this.leaveLast && this.isLastWord) {
        resolve(word)
        return
      }

      this.element.dispatchEvent(this.events.onClear)

      const typeLoop = setInterval(() => {
        if (this.backwards && this.element.textContent) {
          this.element.removeChild(this.element.lastChild)
        }
        else {
          this.element.textContent = ''
          clearInterval(typeLoop)
          resolve(this.element.textContent)
          return
        }
      }, this.speed)
    })
  }
}

try {
  module.exports = Typeit
}
catch (error) {
  console.warn(error)
}
