const Timeout = setTimeout(function () {}, 0).constructor

function createPropertyName() {
  var tokens = []
  var args = Array.prototype.slice.call(arguments)
  var nargs = args.length
  if (nargs === 1 && Array.isArray(args[0])) {
    args = args[0]
    nargs = args.length
  }
  for (var i = 0; i < nargs; i++) {
    var arg = args[i]
    if (typeof arg === 'string') {
      if (tokens.length > 0) {
        tokens.push('.')
      }
      tokens.push(arg)
    } else if (typeof arg === 'number') {
      tokens.push('[' + arg + ']')
    } else {
      throw new Error(
        'Invalid argument type at index ' + i + ' (must be string or number).'
      )
    }
  }
  return tokens.join('')
}

function _isArray(val) {
  return Array.isArray(val)
}

function _isObject(val) {
  return val != null && typeof val === 'object'
}

function _isTimeout(val) {
  return val instanceof Timeout
}

function denormalize(data, keys, map) {
  if (arguments.length === 1) {
    keys = []
    map = {}
  }
  if (_isArray(data)) {
    data.forEach(function (d, i) {
      denormalize(d, keys.concat(i), map)
    })
  } else if (_isTimeout(data)) {
    // if it's a timeout ignore it (it won't denormalize properly)
  } else if (_isObject(data)) {
    Object.keys(data).forEach(function (key) {
      denormalize(data[key], keys.concat(key), map)
    })
  } else {
    map[createPropertyName(keys)] = data
  }
  return map
}

module.exports = denormalize
