export class TypeIt {
  constructor(selector, config) {
    if (!config || !config.words) return

    this.backwards   = config.backwards || false
    this.delay       = isNaN(config.delay) ? 650 : Number(config.delay)
    this.element     = selector instanceof Element ? selector : document.querySelector(selector)
    this.events      = { onType: false, onClear: false, onComplete: false }
    this.frugal      = config.frugal || false
    this.initWord    = this.element.textContent
    this.isInfinity  = config.infinity && !config.leaveLast || false
    this.leaveLast   = config.leaveLast || false
    this.letterClass = config.letterClass || false
    this.letterTag   = config.letterTag || false
    this.onClear     = config.onClear || false
    this.onComplete  = config.onComplete || false
    this.onType      = config.onType || false
    this.speed       = isNaN(config.speed) ? 95 : Number(config.speed)
    this.words       = (this.initWord ? [this.initWord].concat(config.words) : config.words).map(
      elem => Array.isArray(elem) ? elem.join(' ') : elem
    )

    this.initBaseEvents()
    this.initTypeLoop()

    if (config.infinity && config.leaveLast) {
      console.warn('Both infinity and leaveLast options are selected. Loop will be disabled. Please update your settings.')
    }
  }

  initBaseEvents() {
    for (let eventName in this.events) {
      this.events[eventName] = new Event(eventName)
      this.element.addEventListener(eventName, (event) => {
        if (this[eventName] instanceof Function) {
          this[eventName].call(event, event, event.detail)
        }
      })
    }
  }

  updateBaseEventsDetailData(word) {
    for (let eventName in this.events) {
      this.events[eventName]['detail'] = word
    }
  }

  initTypeLoop() {
    for (
      let idx         = 0,
          typePromise = Promise.resolve(),
          currentWord = '';
      idx < this.words.length;
      idx++
    ) {
      // create shallow copy of current word
      currentWord = this.words[idx].slice()
      typePromise = typePromise.then(() => {
        this.isLastWord = this.words.length - 1 === idx
        this.updateBaseEventsDetailData(currentWord)

        return this.type(currentWord)
          .then(() => this.wait(this.delay))
          .then(() => this.clear(currentWord))
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
    return this.letterTag ?
      `<${this.letterTag} class="${this.letterClass || ''}">${letter}</${this.letterTag}>`
      :
      letter
  }

  type(word) {
    return new Promise(resolve => {
      if (
        this.frugal &&
        this.element.textContent &&
        this.isFrugalAvailable(word)
      ) {
        word = word.replace(this.element.textContent, '')
      }
      else if (this.element.textContent) {
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

      let currentWordIndex = this.words.indexOf(word)

      this.element.dispatchEvent(this.events.onClear)

      const clearLoop = setInterval(() => {
        if (this.backwards && this.element.textContent) {
          this.element.removeChild(this.element.lastChild)
          if (
            this.frugal &&
            this.isFrugalAvailable(
              this.isLastWord &&
              this.isInfinity ? this.words[0] : this.words[currentWordIndex + 1]
            )
          ) {
            resolve(word)
            clearInterval(clearLoop)
          }
        }
        else {
          this.element.textContent = ''
          clearInterval(clearLoop)
          resolve(this.element.textContent)
          return
        }
      }, this.speed)
    })
  }

  isFrugalAvailable(a) {
    return new RegExp(`^(${this.element.textContent}).*`).test(a)
  }

  sortWords() {
    return this.words.sort((a, b) => {
      a = a.toLowerCase()
      b = b.toLowerCase()
      return a === b ? 0 : a < b ? -1 : 1
    })
  }
}
