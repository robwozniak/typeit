!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.CCS=t():e.CCS=t()}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}n.r(t),n.d(t,"TypeIt",function(){return a});var i=650,o=95,s="typeit",a=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),n&&n.words&&(this.backwards=n.backwards||!1,this.delay=n.delay||i,this.element=t instanceof Element?t:document.querySelector(t),this.events={onType:!1,onClear:!1,onComplete:!1},this.frugal=n.frugal||!1,this.initWord=this.element.textContent,this.leaveLast=n.leaveLast||!1,this.isInfinity=n.infinity&&!n.leaveLast||!1,this.letterClass=n.letterClass||!1,this.letterTag=n.letterTag||!1,this.onClear=n.onClear||!1,this.onComplete=n.onComplete||!1,this.onType=n.onType||!1,this.sort=n.sort||!1,this.speed=n.speed||o,this.words=(this.initWord?[this.initWord].concat(n.words):n.words).map(function(e){return Array.isArray(e)?e.join(" "):e}),this.element.classList.add(s),this.sort&&(this.words=this.sortWords()),this.initBaseEvents(),this.initTypeLoop(),n.infinity&&n.leaveLast&&console.warn("Both infinity and leaveLast options are selected. Loop will be disabled. Please update your settings."))}var t,n,a;return t=e,(n=[{key:"initBaseEvents",value:function(){var e=this,t=function(t){e.events[t]=new Event(t),e.element.addEventListener(t,function(n){e[t]instanceof Function&&e[t].call(n,n,n.detail)})};for(var n in this.events)t(n)}},{key:"updateBaseEventsDetailData",value:function(e){for(var t in this.events)this.events[t].detail=e}},{key:"initTypeLoop",value:function(){for(var e=this,t=function(t,n,o){o=e.words[t].slice(),n=n.then(function(){return e.isLastWord=e.words.length-1===t,e.updateBaseEventsDetailData(o),r=n,i=o,e.type(o).then(function(){return e.wait(e.delay)}).then(function(){return e.clear(o)})}).then(function(){e.isInfinity&&e.isLastWord?e.initTypeLoop():!e.isInfinity&&e.isLastWord&&e.element.dispatchEvent(e.events.onComplete)}),r=n,i=o},n=0,r=Promise.resolve(),i="";n<this.words.length;n++)t(n,r,i)}},{key:"prepareLetter",value:function(e){return this.letterTag?"<".concat(this.letterTag,' class="').concat(this.letterClass||"",'">').concat(e,"</").concat(this.letterTag,">"):e}},{key:"type",value:function(e){var t=this;return new Promise(function(n){if(t.frugal&&t.element.textContent&&t.isFrugalAvailable(e))e=e.replace(t.element.textContent,"");else if(t.element.textContent)return void n(e);t.element.dispatchEvent(t.events.onType);var r=0,i=setInterval(function(){if(!e[r])return clearInterval(i),void n(e);t.element.insertAdjacentHTML("beforeend",t.prepareLetter(e[r])),r++},t.speed)})}},{key:"wait",value:function(e){return new Promise(function(t){return setTimeout(function(){return t(e)},e)})}},{key:"clear",value:function(e){var t=this;return new Promise(function(n){if(t.leaveLast&&t.isLastWord)n(e);else{var r=t.words.indexOf(e);t.element.dispatchEvent(t.events.onClear);var i=setInterval(function(){if(!t.backwards||!t.element.textContent)return t.element.textContent="",clearInterval(i),void n(t.element.textContent);t.element.removeChild(t.element.lastChild),t.frugal&&t.isFrugalAvailable(t.isLastWord&&t.isInfinity?t.words[0]:t.words[r+1])&&(n(e),clearInterval(i))},t.speed)}})}},{key:"isFrugalAvailable",value:function(e){return new RegExp("^(".concat(this.element.textContent,").*")).test(e)}},{key:"sortWords",value:function(){return this.words.sort(function(e,t){return(e=e.toLowerCase())===(t=t.toLowerCase())?0:e<t?-1:1})}}])&&r(t.prototype,n),a&&r(t,a),e}()}])});