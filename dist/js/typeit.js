'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_SPEED = 95;
var DEFAULT_DELAY = 650;
var DEFAULT_TYPEIT_CLASS = 'typeit';

var Typeit = function () {
  function Typeit(selector, config) {
    _classCallCheck(this, Typeit);

    if (!config || !config.words) return;

    this.element = selector instanceof Element ? selector : document.querySelector(selector);
    this.initWord = this.element.textContent;
    this.words = this.initWord ? [this.initWord].concat(config.words) : config.words;
    this.speed = config.speed || DEFAULT_SPEED;
    this.delay = config.delay || DEFAULT_DELAY;
    this.letterTag = config.letterTag || false;
    this.letterClass = config.letterClass || false;
    this.backwards = config.backwards || false;
    this.leaveLast = config.leaveLast || false;
    this.isInfinity = config.infinity && !config.leaveLast || false;
    this.onType = config.onType || false;
    this.onClear = config.onClear || false;
    this.onComplete = config.onComplete || false;
    this.events = { onType: false, onClear: false, onComplete: false };

    this.element.classList.add(DEFAULT_TYPEIT_CLASS);

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
        if (_this.events.hasOwnProperty(eventName)) {
          _this.events[eventName] = new Event(eventName);
          _this.element.addEventListener(eventName, function (event) {
            if (_this[eventName] instanceof Function) {
              _this[eventName].call(event, event, event.detail);
            }
          });
        }
      };

      for (var eventName in this.events) {
        _loop(eventName);
      }
    }
  }, {
    key: 'updateBaseEventsDetailData',
    value: function updateBaseEventsDetailData(word) {
      for (var eventName in this.events) {
        if (this.events.hasOwnProperty(eventName)) {
          this.events[eventName]['detail'] = word;
        }
      }
    }
  }, {
    key: 'initTypeLoop',
    value: function initTypeLoop() {
      var _this2 = this;

      var _loop2 = function _loop2(idx, _typePromise) {
        _typePromise = _typePromise.then(function () {
          _this2.isLastWord = _this2.words.length - 1 === idx;
          _this2.updateBaseEventsDetailData(_this2.words[idx]);

          return _this2.type(_this2.words[idx]).then(function () {
            return _this2.wait(_this2.delay);
          }).then(function () {
            return _this2.clear(_this2.words[idx]);
          });
        }).then(function () {
          if (_this2.isInfinity && _this2.isLastWord) {
            _this2.initTypeLoop();
          } else if (!_this2.isInfinity && _this2.isLastWord) {
            _this2.element.dispatchEvent(_this2.events.onComplete);
          }
        });
        typePromise = _typePromise;
      };

      for (var idx = 0, typePromise = Promise.resolve(); idx < this.words.length; idx++) {
        _loop2(idx, typePromise);
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
        if (_this3.element.textContent) {
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

        _this4.element.dispatchEvent(_this4.events.onClear);

        var typeLoop = setInterval(function () {
          if (_this4.backwards && _this4.element.textContent) {
            _this4.element.removeChild(_this4.element.lastChild);
          } else {
            _this4.element.textContent = '';
            clearInterval(typeLoop);
            resolve(_this4.element.textContent);
            return;
          }
        }, _this4.speed);
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