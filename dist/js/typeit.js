'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_DELAY = 650;
var DEFAULT_SPEED = 95;
var DEFAULT_TYPEIT_CLASS = 'typeit';

var Typeit = function () {
  function Typeit(selector, config) {
    _classCallCheck(this, Typeit);

    if (!config || !config.words) return;

    this.backwards = config.backwards || false;
    this.delay = config.delay || DEFAULT_DELAY;
    this.element = selector instanceof Element ? selector : document.querySelector(selector);
    this.events = { onType: false, onClear: false, onComplete: false };
    this.frugal = config.frugal || false;
    this.initWord = this.element.textContent;
    this.leaveLast = config.leaveLast || false;
    this.isInfinity = config.infinity && !config.leaveLast || false;
    this.letterClass = config.letterClass || false;
    this.letterTag = config.letterTag || false;
    this.onClear = config.onClear || false;
    this.onComplete = config.onComplete || false;
    this.onType = config.onType || false;
    this.sort = config.sort || false;
    this.speed = config.speed || DEFAULT_SPEED;
    this.words = (this.initWord ? [this.initWord].concat(config.words) : config.words).map(function (elem) {
      return Array.isArray(elem) ? elem.join(' ') : elem;
    });

    this.element.classList.add(DEFAULT_TYPEIT_CLASS);
    if (this.sort) this.words = this.sortWords();

    this.initBaseEvents();
    this.initTypeLoop();

    if (config.infinity && config.leaveLast) {
      console.warn('Both infinity and leaveLast options are selected. Loop will be disabled. Please update your settings.');
    }
  }

  _createClass(Typeit, [{
    key: 'initBaseEvents',
    value: function initBaseEvents() {
      var _this = this;

      var _loop = function _loop(eventName) {
        _this.events[eventName] = new Event(eventName);
        _this.element.addEventListener(eventName, function (event) {
          if (_this[eventName] instanceof Function) {
            _this[eventName].call(event, event, event.detail);
          }
        });
      };

      for (var eventName in this.events) {
        _loop(eventName);
      }
    }
  }, {
    key: 'updateBaseEventsDetailData',
    value: function updateBaseEventsDetailData(word) {
      for (var eventName in this.events) {
        this.events[eventName]['detail'] = word;
      }
    }
  }, {
    key: 'initTypeLoop',
    value: function initTypeLoop() {
      var _this2 = this;

      var _loop2 = function _loop2(idx, _typePromise, _currentWord) {
        // create shallow copy of current word
        _currentWord = _this2.words[idx].slice();
        _typePromise = _typePromise.then(function () {
          _this2.isLastWord = _this2.words.length - 1 === idx;
          _this2.updateBaseEventsDetailData(_currentWord);

          return _this2.type(_currentWord).then(function () {
            return _this2.wait(_this2.delay);
          }).then(function () {
            return _this2.clear(_currentWord);
          });
        }).then(function () {
          if (_this2.isInfinity && _this2.isLastWord) {
            _this2.initTypeLoop();
          } else if (!_this2.isInfinity && _this2.isLastWord) {
            _this2.element.dispatchEvent(_this2.events.onComplete);
          }
        });
        typePromise = _typePromise;
        currentWord = _currentWord;
      };

      for (var idx = 0, typePromise = Promise.resolve(), currentWord = ''; idx < this.words.length; idx++) {
        _loop2(idx, typePromise, currentWord);
      }
    }
  }, {
    key: 'prepareLetter',
    value: function prepareLetter(letter) {
      return this.letterTag ? '<' + this.letterTag + ' class="' + (this.letterClass || '') + '">' + letter + '</' + this.letterTag + '>' : letter;
    }
  }, {
    key: 'type',
    value: function type(word) {
      var _this3 = this;

      return new Promise(function (resolve) {
        if (_this3.frugal && _this3.element.textContent && _this3.isFrugalAvailable(word)) {
          word = word.replace(_this3.element.textContent, '');
        } else if (_this3.element.textContent) {
          resolve(word);
          return;
        }

        _this3.element.dispatchEvent(_this3.events.onType);

        var cursorPosition = 0;
        var typeLoop = setInterval(function () {
          if (word[cursorPosition]) {
            _this3.element.insertAdjacentHTML('beforeend', _this3.prepareLetter(word[cursorPosition]));
          } else {
            clearInterval(typeLoop);
            resolve(word);
            return;
          }

          cursorPosition++;
        }, _this3.speed);
      });
    }
  }, {
    key: 'wait',
    value: function wait(time) {
      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve(time);
        }, time);
      });
    }
  }, {
    key: 'clear',
    value: function clear(word) {
      var _this4 = this;

      return new Promise(function (resolve) {
        if (_this4.leaveLast && _this4.isLastWord) {
          resolve(word);
          return;
        }

        var currentWordIndex = _this4.words.indexOf(word);

        _this4.element.dispatchEvent(_this4.events.onClear);

        var clearLoop = setInterval(function () {
          if (_this4.backwards && _this4.element.textContent) {
            _this4.element.removeChild(_this4.element.lastChild);
            if (_this4.frugal && _this4.isFrugalAvailable(_this4.isLastWord && _this4.isInfinity ? _this4.words[0] : _this4.words[currentWordIndex + 1])) {
              resolve(word);
              clearInterval(clearLoop);
            }
          } else {
            _this4.element.textContent = '';
            clearInterval(clearLoop);
            resolve(_this4.element.textContent);
            return;
          }
        }, _this4.speed);
      });
    }
  }, {
    key: 'isFrugalAvailable',
    value: function isFrugalAvailable(a) {
      return new RegExp('^(' + this.element.textContent + ').*').test(a);
    }
  }, {
    key: 'sortWords',
    value: function sortWords() {
      return this.words.sort(function (a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a === b ? 0 : a < b ? -1 : 1;
      });
    }
  }]);

  return Typeit;
}();

try {
  module.exports = Typeit;
} catch (error) {
  console.warn(error);
}