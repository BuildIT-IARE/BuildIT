'use strict'

/*!
 * exports.
 */

module.exports = curry2

/**
 * Curry a binary function.
 *
 * @param {Function} fn
 * Binary function to curry.
 *
 * @param {Object} [self]
 * Function `this` context.
 *
 * @return {Function|*}
 * If partially applied, return unary function, otherwise, return result of full application.
 */

function curry2 (fn, self) {
  var out = function () {
    return arguments.length > 1
    ? fn.call(self, arguments[0], arguments[1])
    : fn.bind(self, arguments[0])
  }

  out.uncurry = function uncurry () {
    return fn
  }

  return out
}
