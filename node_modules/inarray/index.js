'use strict'

/*!
 * imports.
 */

var curry2 = require('curry2')

/*!
 * exports.
 */

module.exports = curry2(inarray)

/**
 * Whether given value exists in array.
 *
 * @param {Array} list
 * The list to search.
 *
 * @param {*} item
 * The item/value to search for.
 *
 * @return {Boolean}
 * Whether given value exists in array.
 */

function inarray (list, item) {
  list = Object.prototype.toString.call(list) === '[object Array]' ? list : []

  var idx = -1
  var end = list.length

  while (++idx < end) {
    if (list[idx] === item) return true
  }

  return false
}
