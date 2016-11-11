var FreeStyle = require('free-style')
var insertStyles = require('insert-styles')

var STYLE_ID = require('./constants').STYLE_ID

var styleInstance = null
var changeId = null

// One global style instance
module.exports = function getInstance (isDebug) {
  if (!styleInstance) {
    styleInstance = createStyleInstance(isDebug)
  }
  return styleInstance
}

function createStyleInstance (isDebug) {
  var Style = FreeStyle.create(undefined, isDebug)

  return {
    getStyles: getStyles,
    registerStyle: registerFn('registerStyle'),
    registerRule: registerFn('registerRule'),
    registerKeyframes: registerFn('registerKeyframes')
  }

  function getStyles () {
    return Style.getStyles()
  }

  function registerFn (methodName) {
    var method = Style[methodName]

    return function register (rule) {
      var result = method.call(Style, rule)

      if (Style.changeId !== changeId) {
        insertStyles(Style.getStyles(), {id: STYLE_ID})
        changeId = Style.changeId
      }

      return result
    }
  }
}
