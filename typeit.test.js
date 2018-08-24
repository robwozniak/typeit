const typeit  = require('./js/typeit')
const element = document.createElement('DIV')

element.setAttribute('id', 'sample');

describe('[ Functions ]', () => {
  let component

  beforeEach(function () {
    component = new typeit(element, {
      words: [
        'Sample text'
      ]
    })
  })

  test('[prepareLetter] Without specific configuration - simple text', () => {
    expect(component.prepareLetter('A')).toEqual('A')
  })

  test('[prepareLetter] With tag and class name configuration - html element', () => {
    component.letterTag = 'span'
    expect(component.prepareLetter('A')).toEqual(`<span class="">A</span>`)
  })

  test('[prepareLetter] With tag and class name configuration - html element', () => {
    component.letterTag   = 'span',
    component.letterClass = 'test'
    expect(component.prepareLetter('A')).toEqual(`<span class="test">A</span>`)
  })
})

describe('[ Promises ]', () => {
  let component

  beforeEach(function () {
    component = new typeit(element, {
      words: [
        'Sample text',
        'Sample code'
      ]
    })
  })

  it('[Wait] Delay 1500ms', () => {
    const start = performance.now()

    return component.wait(1500).then(data => {
      const end     = performance.now()
      const elapsed = end - start

      expect(elapsed).toBeGreaterThanOrEqual(data)
      expect(elapsed).toBeLessThanOrEqual(data + 150)
    })
  })

  it('[Clear] Word - both leaveLast and isLastWord are true', () => {
    component.leaveLast = true
    component.isLastWord = true
    return component.clear('Sample').then(data => expect(data).toEqual('Sample'))
  })

  it('[Clear] Word - both leaveLast and isLastWord are false', () => {
    component.leaveLast = false
    component.isLastWord = false
    return component.clear('Sample').then(data => expect(data).toEqual(''))
  })
})
