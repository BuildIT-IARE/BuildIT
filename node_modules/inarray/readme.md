# inarray
> Curried predicate which checks that a value exists in an array. Generally faster than `indexOf` across JS engines.

[![Build Status](http://img.shields.io/travis/wilmoore/inarray.js.svg)](https://travis-ci.org/wilmoore/inarray.js) [![Code Climate](https://codeclimate.com/github/wilmoore/inarray.js/badges/gpa.svg)](https://codeclimate.com/github/wilmoore/inarray.js) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

```shell
npm install inarray --save
```

> You can also use Duo, Bower or [download the files manually](https://github.com/wilmoore/inarray.js/releases).

###### npm stats

[![npm](https://img.shields.io/npm/v/inarray.svg)](https://www.npmjs.org/package/inarray) [![NPM downloads](http://img.shields.io/npm/dm/inarray.svg)](https://www.npmjs.org/package/inarray) [![David](https://img.shields.io/david/wilmoore/inarray.js.svg)](https://david-dm.org/wilmoore/inarray.js)

## API Example

###### Basic

```js
var inarray = require('inarray')

inarray(['a', 'b', 'c'], 'b')
//=> true

inarray(['a', 'b', 'c'], 'z')
//=> false
```

###### Pointfree Style

```js
var inarray = require('inarray')
var include = inarray(['a', 'b', 'c'])

['a', 'c'].every(include)
//=> true
```

## API

### `inarray(list, item)`

###### arguments

 - `list (array)` The list to search.
 - `item (*)` The item/value to search for.

###### returns

 - `(boolean)` Whether given value exists in array.

## Alternatives

 - [_.contains]
 - [_.includes]

## Contributing

> SEE: [contributing.md](contributing.md)

## Licenses

[![GitHub license](https://img.shields.io/github/license/wilmoore/inarray.js.svg)](https://github.com/wilmoore/inarray.js/blob/master/license)

[_.contains]: http://underscorejs.org/#contains
[_.includes]: https://lodash.com/docs#includes
