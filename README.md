# typeit.js
Simple JavaScript Typing Animation Plugin

## Setup development environment with docker
Usage purposes: You don't (or you do not want to) have node installed globally on your machine.

Required:
- [docker](https://docs.docker.com/install/)
- [docker-compose](https://docs.docker.com/compose/)

Run `$ docker-compose up` inside the project's root directory.

## Usage
### Initialize

To initialize Typeit plugin you need to pass two arguments:
1. st - selector or DOM element
2. nd - configuration object

Init example:
```
<h1>
  <span id="typeit"></span>
</h1>

<script src="./path/to/typeit.js"></script>
<script>
new CCS.TypeIt('#typeit', {
  words: [
    'Sample text',
    ['This', 'is', 'also', 'allowed']
  ],
  speed: 100,
  delay: 900,
  backwards: true,
  infinity: true,
  onType: function(event, word) {
    // handle event
  }
})
</script>
```
### Options (config)
- `words` - an array of Strings (array with pieces of words will be transformed to strings). **Note**: text content typed inside your DOM element will be automatically added to the beginning of the words array
- `speed` - typing speed, by default `95`(ms)
- `delay` - delay between *typeit* actions, by default `650`(ms)
- `letterTag` - specify each letter html tag, by default `false` - pure text
- `letterClass` - specify each letter wrapper class, by default `false` - no class. **Note**: Works only when a `letterTag` is also specified
- `backwards` - removes letters one by one, by default `false` - removes the whole word
- `leaveLast` - leave the last word visible after finishing the whole typing loop, by default `false`
- `infinity` - enable infinity type loop, by default `false`. **Note**: Option will be disabled automatically when both `infinity` and `leaveLast` options are selected
- `onType`/`onClear`/`onComplete` - functions which are triggered during plugin lifecycle. Accepts callback function with two parameters (`event` and `word`) as a value, by default `false`
### Events
We can distinguish three main events during the plugin lifecycle:
1. `onType` - triggered every time when the word is typing
2. `onClear` - triggered every time when the word is clearing
3. `onComplete` - triggered when typing loop is over and `infinity` option is disabled

## Test coverage
There are available some basic unit tests which (more or less) cover some basic *typeit.js* functionality.
Run `$yarn test` inside the project's root directory to start tests.
