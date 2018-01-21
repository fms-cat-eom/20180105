(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/node_modules/assert/assert.js":[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"util/":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/node_modules/util/util.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/node_modules/util/node_modules/inherits/inherits_browser.js":[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/node_modules/util/support/isBufferBrowser.js":[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/node_modules/util/util.js":[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/node_modules/util/support/isBufferBrowser.js","_process":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/node_modules/process/browser.js","inherits":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/node_modules/util/node_modules/inherits/inherits_browser.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/automaton.min.js":[function(require,module,exports){
(function (global){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e) {
  if ("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = e();else if ("function" == typeof define && define.amd) define([], e);else {
    var t;t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.Automaton = e();
  }
}(function () {
  return function e(t, n, o) {
    function r(i, s) {
      if (!n[i]) {
        if (!t[i]) {
          var l = "function" == typeof require && require;if (!s && l) return l(i, !0);if (a) return a(i, !0);var u = new Error("Cannot find module '" + i + "'");throw u.code = "MODULE_NOT_FOUND", u;
        }var c = n[i] = { exports: {} };t[i][0].call(c.exports, function (e) {
          var n = t[i][1][e];return r(n || e);
        }, c, c.exports, e, t, n, o);
      }return n[i].exports;
    }for (var a = "function" == typeof require && require, i = 0; i < o.length; i++) {
      r(o[i]);
    }return r;
  }({ "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/babel-runtime/core-js/json/stringify.js": [function (e, t, n) {
      t.exports = { default: e("core-js/library/fn/json/stringify"), __esModule: !0 };
    }, { "core-js/library/fn/json/stringify": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/fn/json/stringify.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/babel-runtime/core-js/math/log10.js": [function (e, t, n) {
      t.exports = { default: e("core-js/library/fn/math/log10"), __esModule: !0 };
    }, { "core-js/library/fn/math/log10": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/fn/math/log10.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/babel-runtime/core-js/math/sign.js": [function (e, t, n) {
      t.exports = { default: e("core-js/library/fn/math/sign"), __esModule: !0 };
    }, { "core-js/library/fn/math/sign": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/fn/math/sign.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/fn/json/stringify.js": [function (e, t, n) {
      var o = e("../../modules/_core"),
          r = o.JSON || (o.JSON = { stringify: JSON.stringify });t.exports = function (e) {
        return r.stringify.apply(r, arguments);
      };
    }, { "../../modules/_core": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_core.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/fn/math/log10.js": [function (e, t, n) {
      e("../../modules/es6.math.log10"), t.exports = e("../../modules/_core").Math.log10;
    }, { "../../modules/_core": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_core.js", "../../modules/es6.math.log10": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/es6.math.log10.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/fn/math/sign.js": [function (e, t, n) {
      e("../../modules/es6.math.sign"), t.exports = e("../../modules/_core").Math.sign;
    }, { "../../modules/_core": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_core.js", "../../modules/es6.math.sign": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/es6.math.sign.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_a-function.js": [function (e, t, n) {
      t.exports = function (e) {
        if ("function" != typeof e) throw TypeError(e + " is not a function!");return e;
      };
    }, {}], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_an-object.js": [function (e, t, n) {
      var o = e("./_is-object");t.exports = function (e) {
        if (!o(e)) throw TypeError(e + " is not an object!");return e;
      };
    }, { "./_is-object": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_is-object.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_core.js": [function (e, t, n) {
      var o = t.exports = { version: "2.4.0" };"number" == typeof __e && (__e = o);
    }, {}], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_ctx.js": [function (e, t, n) {
      var o = e("./_a-function");t.exports = function (e, t, n) {
        if (o(e), void 0 === t) return e;switch (n) {case 1:
            return function (n) {
              return e.call(t, n);
            };case 2:
            return function (n, o) {
              return e.call(t, n, o);
            };case 3:
            return function (n, o, r) {
              return e.call(t, n, o, r);
            };}return function () {
          return e.apply(t, arguments);
        };
      };
    }, { "./_a-function": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_a-function.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_descriptors.js": [function (e, t, n) {
      t.exports = !e("./_fails")(function () {
        return 7 != Object.defineProperty({}, "a", { get: function get() {
            return 7;
          } }).a;
      });
    }, { "./_fails": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_fails.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_dom-create.js": [function (e, t, n) {
      var o = e("./_is-object"),
          r = e("./_global").document,
          a = o(r) && o(r.createElement);t.exports = function (e) {
        return a ? r.createElement(e) : {};
      };
    }, { "./_global": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_global.js", "./_is-object": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_is-object.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_export.js": [function (e, t, n) {
      var o = e("./_global"),
          r = e("./_core"),
          a = e("./_ctx"),
          i = e("./_hide"),
          s = function s(e, t, n) {
        var l,
            u,
            c,
            d = e & s.F,
            p = e & s.G,
            f = e & s.S,
            m = e & s.P,
            v = e & s.B,
            h = e & s.W,
            g = p ? r : r[t] || (r[t] = {}),
            y = g.prototype,
            _ = p ? o : f ? o[t] : (o[t] || {}).prototype;p && (n = t);for (l in n) {
          (u = !d && _ && void 0 !== _[l]) && l in g || (c = u ? _[l] : n[l], g[l] = p && "function" != typeof _[l] ? n[l] : v && u ? a(c, o) : h && _[l] == c ? function (e) {
            var t = function t(_t2, n, o) {
              if (this instanceof e) {
                switch (arguments.length) {case 0:
                    return new e();case 1:
                    return new e(_t2);case 2:
                    return new e(_t2, n);}return new e(_t2, n, o);
              }return e.apply(this, arguments);
            };return t.prototype = e.prototype, t;
          }(c) : m && "function" == typeof c ? a(Function.call, c) : c, m && ((g.virtual || (g.virtual = {}))[l] = c, e & s.R && y && !y[l] && i(y, l, c)));
        }
      };s.F = 1, s.G = 2, s.S = 4, s.P = 8, s.B = 16, s.W = 32, s.U = 64, s.R = 128, t.exports = s;
    }, { "./_core": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_core.js", "./_ctx": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_ctx.js", "./_global": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_global.js", "./_hide": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_hide.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_fails.js": [function (e, t, n) {
      t.exports = function (e) {
        try {
          return !!e();
        } catch (e) {
          return !0;
        }
      };
    }, {}], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_global.js": [function (e, t, n) {
      var o = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();"number" == typeof __g && (__g = o);
    }, {}], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_hide.js": [function (e, t, n) {
      var o = e("./_object-dp"),
          r = e("./_property-desc");t.exports = e("./_descriptors") ? function (e, t, n) {
        return o.f(e, t, r(1, n));
      } : function (e, t, n) {
        return e[t] = n, e;
      };
    }, { "./_descriptors": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_descriptors.js", "./_object-dp": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_object-dp.js", "./_property-desc": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_property-desc.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_ie8-dom-define.js": [function (e, t, n) {
      t.exports = !e("./_descriptors") && !e("./_fails")(function () {
        return 7 != Object.defineProperty(e("./_dom-create")("div"), "a", { get: function get() {
            return 7;
          } }).a;
      });
    }, { "./_descriptors": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_descriptors.js", "./_dom-create": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_dom-create.js", "./_fails": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_fails.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_is-object.js": [function (e, t, n) {
      t.exports = function (e) {
        return "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) ? null !== e : "function" == typeof e;
      };
    }, {}], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_math-sign.js": [function (e, t, n) {
      t.exports = Math.sign || function (e) {
        return 0 == (e = +e) || e != e ? e : e < 0 ? -1 : 1;
      };
    }, {}], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_object-dp.js": [function (e, t, n) {
      var o = e("./_an-object"),
          r = e("./_ie8-dom-define"),
          a = e("./_to-primitive"),
          i = Object.defineProperty;n.f = e("./_descriptors") ? Object.defineProperty : function (e, t, n) {
        if (o(e), t = a(t, !0), o(n), r) try {
          return i(e, t, n);
        } catch (e) {}if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");return "value" in n && (e[t] = n.value), e;
      };
    }, { "./_an-object": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_an-object.js", "./_descriptors": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_descriptors.js", "./_ie8-dom-define": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_ie8-dom-define.js", "./_to-primitive": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_to-primitive.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_property-desc.js": [function (e, t, n) {
      t.exports = function (e, t) {
        return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: t };
      };
    }, {}], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_to-primitive.js": [function (e, t, n) {
      var o = e("./_is-object");t.exports = function (e, t) {
        if (!o(e)) return e;var n, r;if (t && "function" == typeof (n = e.toString) && !o(r = n.call(e))) return r;if ("function" == typeof (n = e.valueOf) && !o(r = n.call(e))) return r;if (!t && "function" == typeof (n = e.toString) && !o(r = n.call(e))) return r;throw TypeError("Can't convert object to primitive value");
      };
    }, { "./_is-object": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_is-object.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/es6.math.log10.js": [function (e, t, n) {
      var o = e("./_export");o(o.S, "Math", { log10: function log10(e) {
          return Math.log(e) / Math.LN10;
        } });
    }, { "./_export": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_export.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/es6.math.sign.js": [function (e, t, n) {
      var o = e("./_export");o(o.S, "Math", { sign: e("./_math-sign") });
    }, { "./_export": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_export.js", "./_math-sign": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/core-js/library/modules/_math-sign.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/process/browser.js": [function (e, t, n) {
      function o() {
        throw new Error("setTimeout has not been defined");
      }function r() {
        throw new Error("clearTimeout has not been defined");
      }function a(e) {
        if (d === setTimeout) return setTimeout(e, 0);if ((d === o || !d) && setTimeout) return d = setTimeout, setTimeout(e, 0);try {
          return d(e, 0);
        } catch (t) {
          try {
            return d.call(null, e, 0);
          } catch (t) {
            return d.call(this, e, 0);
          }
        }
      }function i(e) {
        if (p === clearTimeout) return clearTimeout(e);if ((p === r || !p) && clearTimeout) return p = clearTimeout, clearTimeout(e);try {
          return p(e);
        } catch (t) {
          try {
            return p.call(null, e);
          } catch (t) {
            return p.call(this, e);
          }
        }
      }function s() {
        h && m && (h = !1, m.length ? v = m.concat(v) : g = -1, v.length && l());
      }function l() {
        if (!h) {
          var e = a(s);h = !0;for (var t = v.length; t;) {
            for (m = v, v = []; ++g < t;) {
              m && m[g].run();
            }g = -1, t = v.length;
          }m = null, h = !1, i(e);
        }
      }function u(e, t) {
        this.fun = e, this.array = t;
      }function c() {}var d,
          p,
          f = t.exports = {};!function () {
        try {
          d = "function" == typeof setTimeout ? setTimeout : o;
        } catch (e) {
          d = o;
        }try {
          p = "function" == typeof clearTimeout ? clearTimeout : r;
        } catch (e) {
          p = r;
        }
      }();var m,
          v = [],
          h = !1,
          g = -1;f.nextTick = function (e) {
        var t = new Array(arguments.length - 1);if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) {
          t[n - 1] = arguments[n];
        }v.push(new u(e, t)), 1 !== v.length || h || a(l);
      }, u.prototype.run = function () {
        this.fun.apply(null, this.array);
      }, f.title = "browser", f.browser = !0, f.env = {}, f.argv = [], f.version = "", f.versions = {}, f.on = c, f.addListener = c, f.once = c, f.off = c, f.removeListener = c, f.removeAllListeners = c, f.emit = c, f.binding = function (e) {
        throw new Error("process.binding is not supported");
      }, f.cwd = function () {
        return "/";
      }, f.chdir = function (e) {
        throw new Error("process.chdir is not supported");
      }, f.umask = function () {
        return 0;
      };
    }, {}], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/vue-hot-reload-api/index.js": [function (e, t, n) {
      function o(e, t) {
        r(t, d, function () {
          l[e].instances.push(this);
        }), r(t, "beforeDestroy", function () {
          var t = l[e].instances;t.splice(t.indexOf(this), 1);
        });
      }function r(e, t, n) {
        var o = e[t];e[t] = o ? Array.isArray(o) ? o.concat(n) : [o, n] : [n];
      }function a(e) {
        return function (t, n) {
          try {
            e(t, n);
          } catch (e) {
            console.error(e), console.warn("Something went wrong during Vue component hot-reload. Full reload required.");
          }
        };
      }var i,
          s,
          l = window.__VUE_HOT_MAP__ = Object.create(null),
          u = !1,
          c = !1,
          d = "beforeCreate";n.install = function (e, t) {
        if (!u) return u = !0, i = e.__esModule ? e.default : e, s = i.version.split(".").map(Number), c = t, i.config._lifecycleHooks.indexOf("init") > -1 && (d = "init"), n.compatible = s[0] >= 2, n.compatible ? void 0 : void console.warn("[HMR] You are using a version of vue-hot-reload-api that is only compatible with Vue.js core ^2.0.0.");
      }, n.createRecord = function (e, t) {
        var n = null;"function" == typeof t && (n = t, t = n.options), o(e, t), l[e] = { Ctor: i.extend(t), instances: [] };
      }, n.rerender = a(function (e, t) {
        var n = l[e];"function" == typeof t && (t = t.options), n.Ctor.options.render = t.render, n.Ctor.options.staticRenderFns = t.staticRenderFns, n.instances.slice().forEach(function (e) {
          e.$options.render = t.render, e.$options.staticRenderFns = t.staticRenderFns, e._staticTrees = [], e.$forceUpdate();
        });
      }), n.reload = a(function (e, t) {
        "function" == typeof t && (t = t.options), o(e, t);var n = l[e];s[1] < 2 && (n.Ctor.extendOptions = t);var r = n.Ctor.super.extend(t);n.Ctor.options = r.options, n.Ctor.cid = r.cid, n.Ctor.prototype = r.prototype, r.release && r.release(), n.instances.slice().forEach(function (e) {
          e.$vnode && e.$vnode.context ? e.$vnode.context.$forceUpdate() : console.warn("Root or manually mounted instance modified. Full reload required.");
        });
      });
    }, {}], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/vue/dist/vue.runtime.common.js": [function (e, t, n) {
      (function (e, n) {
        "use strict";
        function o(e) {
          return null == e ? "" : "object" == (typeof e === "undefined" ? "undefined" : _typeof(e)) ? JSON.stringify(e, null, 2) : String(e);
        }function r(e) {
          var t = parseFloat(e);return isNaN(t) ? e : t;
        }function a(e, t) {
          for (var n = Object.create(null), o = e.split(","), r = 0; r < o.length; r++) {
            n[o[r]] = !0;
          }return t ? function (e) {
            return n[e.toLowerCase()];
          } : function (e) {
            return n[e];
          };
        }function i(e, t) {
          if (e.length) {
            var n = e.indexOf(t);if (n > -1) return e.splice(n, 1);
          }
        }function s(e, t) {
          return qn.call(e, t);
        }function l(e) {
          return "string" == typeof e || "number" == typeof e;
        }function u(e) {
          var t = Object.create(null);return function (n) {
            return t[n] || (t[n] = e(n));
          };
        }function c(e, t) {
          function n(n) {
            var o = arguments.length;return o ? o > 1 ? e.apply(t, arguments) : e.call(t, n) : e.call(t);
          }return n._length = e.length, n;
        }function d(e, t) {
          t = t || 0;for (var n = e.length - t, o = new Array(n); n--;) {
            o[n] = e[n + t];
          }return o;
        }function p(e, t) {
          for (var n in t) {
            e[n] = t[n];
          }return e;
        }function f(e) {
          return null !== e && "object" == (typeof e === "undefined" ? "undefined" : _typeof(e));
        }function m(e) {
          return Xn.call(e) === Zn;
        }function v(e) {
          for (var t = {}, n = 0; n < e.length; n++) {
            e[n] && p(t, e[n]);
          }return t;
        }function h() {}function g(e, t) {
          var n = f(e),
              o = f(t);if (!n || !o) return !n && !o && String(e) === String(t);try {
            return JSON.stringify(e) === JSON.stringify(t);
          } catch (n) {
            return e === t;
          }
        }function y(e, t) {
          for (var n = 0; n < e.length; n++) {
            if (g(e[n], t)) return n;
          }return -1;
        }function _(e) {
          var t = !1;return function () {
            t || (t = !0, e());
          };
        }function b(e) {
          var t = (e + "").charCodeAt(0);return 36 === t || 95 === t;
        }function x(e, t, n, o) {
          Object.defineProperty(e, t, { value: n, enumerable: !!o, writable: !0, configurable: !0 });
        }function w(e) {
          if (!oo.test(e)) {
            var t = e.split(".");return function (e) {
              for (var n = 0; n < t.length; n++) {
                if (!e) return;e = e[t[n]];
              }return e;
            };
          }
        }function k(e) {
          return (/native code/.test(e.toString())
          );
        }function C(e) {
          So.target && Mo.push(So.target), So.target = e;
        }function S() {
          So.target = Mo.pop();
        }function M(e, t) {
          e.__proto__ = t;
        }function O(e, t, n) {
          for (var o = 0, r = n.length; o < r; o++) {
            var a = n[o];x(e, a, t[a]);
          }
        }function N(e, t) {
          if (f(e)) {
            var n;return s(e, "__ob__") && e.__ob__ instanceof jo ? n = e.__ob__ : Do.shouldConvert && !mo() && (Array.isArray(e) || m(e)) && Object.isExtensible(e) && !e._isVue && (n = new jo(e)), t && n && n.vmCount++, n;
          }
        }function E(t, n, o, r) {
          var a = new So(),
              i = Object.getOwnPropertyDescriptor(t, n);if (!i || !1 !== i.configurable) {
            var s = i && i.get,
                l = i && i.set,
                u = N(o);Object.defineProperty(t, n, { enumerable: !0, configurable: !0, get: function get() {
                var e = s ? s.call(t) : o;return So.target && (a.depend(), u && u.dep.depend(), Array.isArray(e) && T(e)), e;
              }, set: function set(n) {
                var i = s ? s.call(t) : o;n === i || n !== n && i !== i || ("production" !== e.env.NODE_ENV && r && r(), l ? l.call(t, n) : o = n, u = N(n), a.notify());
              } });
          }
        }function D(t, n, o) {
          if (Array.isArray(t) && "number" == typeof n) return t.length = Math.max(t.length, n), t.splice(n, 1, o), o;if (s(t, n)) return t[n] = o, o;var r = t.__ob__;return t._isVue || r && r.vmCount ? ("production" !== e.env.NODE_ENV && _o("Avoid adding reactive properties to a Vue instance or its root $data at runtime - declare it upfront in the data option."), o) : r ? (E(r.value, n, o), r.dep.notify(), o) : (t[n] = o, o);
        }function j(t, n) {
          if (Array.isArray(t) && "number" == typeof n) return void t.splice(n, 1);var o = t.__ob__;if (t._isVue || o && o.vmCount) return void ("production" !== e.env.NODE_ENV && _o("Avoid deleting properties on a Vue instance or its root $data - just set it to null."));s(t, n) && (delete t[n], o && o.dep.notify());
        }function T(e) {
          for (var t = void 0, n = 0, o = e.length; n < o; n++) {
            t = e[n], t && t.__ob__ && t.__ob__.dep.depend(), Array.isArray(t) && T(t);
          }
        }function P(e, t) {
          if (!t) return e;for (var n, o, r, a = Object.keys(t), i = 0; i < a.length; i++) {
            n = a[i], o = e[n], r = t[n], s(e, n) ? m(o) && m(r) && P(o, r) : D(e, n, r);
          }return e;
        }function $(e, t) {
          return t ? e ? e.concat(t) : Array.isArray(t) ? t : [t] : e;
        }function A(e, t) {
          var n = Object.create(e || null);return t ? p(n, t) : n;
        }function I(e) {
          for (var t in e.components) {
            var n = t.toLowerCase();(Wn(n) || to.isReservedTag(n)) && _o("Do not use built-in or reserved HTML elements as component id: " + t);
          }
        }function V(t) {
          var n = t.props;if (n) {
            var o,
                r,
                a,
                i = {};if (Array.isArray(n)) for (o = n.length; o--;) {
              r = n[o], "string" == typeof r ? (a = zn(r), i[a] = { type: null }) : "production" !== e.env.NODE_ENV && _o("props must be strings when using array syntax.");
            } else if (m(n)) for (var s in n) {
              r = n[s], a = zn(s), i[a] = m(r) ? r : { type: r };
            }t.props = i;
          }
        }function U(e) {
          var t = e.directives;if (t) for (var n in t) {
            var o = t[n];"function" == typeof o && (t[n] = { bind: o, update: o });
          }
        }function L(t, n, o) {
          function r(e) {
            var r = To[e] || $o;d[e] = r(t[e], n[e], o, e);
          }"production" !== e.env.NODE_ENV && I(n), V(n), U(n);var a = n.extends;if (a && (t = "function" == typeof a ? L(t, a.options, o) : L(t, a, o)), n.mixins) for (var i = 0, l = n.mixins.length; i < l; i++) {
            var u = n.mixins[i];u.prototype instanceof lt && (u = u.options), t = L(t, u, o);
          }var c,
              d = {};for (c in t) {
            r(c);
          }for (c in n) {
            s(t, c) || r(c);
          }return d;
        }function Y(t, n, o, r) {
          if ("string" == typeof o) {
            var a = t[n];if (s(a, o)) return a[o];var i = zn(o);if (s(a, i)) return a[i];var l = Gn(i);if (s(a, l)) return a[l];var u = a[o] || a[i] || a[l];return "production" !== e.env.NODE_ENV && r && !u && _o("Failed to resolve " + n.slice(0, -1) + ": " + o, t), u;
          }
        }function J(t, n, o, r) {
          var a = n[t],
              i = !s(o, t),
              l = o[t];if (W(Boolean, a.type) && (i && !s(a, "default") ? l = !1 : W(String, a.type) || "" !== l && l !== Kn(t) || (l = !0)), void 0 === l) {
            l = R(r, a, t);var u = Do.shouldConvert;Do.shouldConvert = !0, N(l), Do.shouldConvert = u;
          }return "production" !== e.env.NODE_ENV && B(a, t, l, r, i), l;
        }function R(t, n, o) {
          if (s(n, "default")) {
            var r = n.default;return "production" !== e.env.NODE_ENV && f(r) && _o('Invalid default value for prop "' + o + '": Props with type Object/Array must use a factory function to return the default value.', t), t && t.$options.propsData && void 0 === t.$options.propsData[o] && void 0 !== t._props[o] ? t._props[o] : "function" == typeof r && "Function" !== H(n.type) ? r.call(t) : r;
          }
        }function B(e, t, n, o, r) {
          if (e.required && r) return void _o('Missing required prop: "' + t + '"', o);if (null != n || e.required) {
            var a = e.type,
                i = !a || !0 === a,
                s = [];if (a) {
              Array.isArray(a) || (a = [a]);for (var l = 0; l < a.length && !i; l++) {
                var u = F(n, a[l]);s.push(u.expectedType || ""), i = u.valid;
              }
            }if (!i) return void _o('Invalid prop: type check failed for prop "' + t + '". Expected ' + s.map(Gn).join(", ") + ", got " + Object.prototype.toString.call(n).slice(8, -1) + ".", o);var c = e.validator;c && (c(n) || _o('Invalid prop: custom validator check failed for prop "' + t + '".', o));
          }
        }function F(e, t) {
          var n,
              o = H(t);return n = "String" === o ? (typeof e === "undefined" ? "undefined" : _typeof(e)) == (o = "string") : "Number" === o ? (typeof e === "undefined" ? "undefined" : _typeof(e)) == (o = "number") : "Boolean" === o ? (typeof e === "undefined" ? "undefined" : _typeof(e)) == (o = "boolean") : "Function" === o ? (typeof e === "undefined" ? "undefined" : _typeof(e)) == (o = "function") : "Object" === o ? m(e) : "Array" === o ? Array.isArray(e) : e instanceof t, { valid: n, expectedType: o };
        }function H(e) {
          var t = e && e.toString().match(/^\s*function (\w+)/);return t && t[1];
        }function W(e, t) {
          if (!Array.isArray(t)) return H(t) === H(e);for (var n = 0, o = t.length; n < o; n++) {
            if (H(t[n]) === H(e)) return !0;
          }return !1;
        }function q(t, n, o) {
          if (to.errorHandler) to.errorHandler.call(null, t, n, o);else {
            if ("production" !== e.env.NODE_ENV && _o("Error in " + o + ":", n), !ao || "undefined" == typeof console) throw t;console.error(t);
          }
        }function z(e) {
          return new Fo(void 0, void 0, void 0, String(e));
        }function G(e) {
          var t = new Fo(e.tag, e.data, e.children, e.text, e.elm, e.context, e.componentOptions);return t.ns = e.ns, t.isStatic = e.isStatic, t.key = e.key, t.isCloned = !0, t;
        }function K(e) {
          for (var t = e.length, n = new Array(t), o = 0; o < t; o++) {
            n[o] = G(e[o]);
          }return n;
        }function X(e) {
          function t() {
            var e = arguments,
                n = t.fns;if (!Array.isArray(n)) return n.apply(null, arguments);for (var o = 0; o < n.length; o++) {
              n[o].apply(null, e);
            }
          }return t.fns = e, t;
        }function Z(t, n, o, r, a) {
          var i, s, l, u;for (i in t) {
            s = t[i], l = n[i], u = zo(i), s ? l ? s !== l && (l.fns = s, t[i] = l) : (s.fns || (s = t[i] = X(s)), o(u.name, s, u.once, u.capture)) : "production" !== e.env.NODE_ENV && _o('Invalid handler for event "' + u.name + '": got ' + String(s), a);
          }for (i in n) {
            t[i] || (u = zo(i), r(u.name, n[i], u.capture));
          }
        }function Q(e, t, n) {
          function o() {
            n.apply(this, arguments), i(r.fns, o);
          }var r,
              a = e[t];a ? a.fns && a.merged ? (r = a, r.fns.push(o)) : r = X([a, o]) : r = X([o]), r.merged = !0, e[t] = r;
        }function ee(e) {
          for (var t = 0; t < e.length; t++) {
            if (Array.isArray(e[t])) return Array.prototype.concat.apply([], e);
          }return e;
        }function te(e) {
          return l(e) ? [z(e)] : Array.isArray(e) ? ne(e) : void 0;
        }function ne(e, t) {
          var n,
              o,
              r,
              a = [];for (n = 0; n < e.length; n++) {
            null != (o = e[n]) && "boolean" != typeof o && (r = a[a.length - 1], Array.isArray(o) ? a.push.apply(a, ne(o, (t || "") + "_" + n)) : l(o) ? r && r.text ? r.text += String(o) : "" !== o && a.push(z(o)) : o.text && r && r.text ? a[a.length - 1] = z(r.text + o.text) : (o.tag && null == o.key && null != t && (o.key = "__vlist" + t + "_" + n + "__"), a.push(o)));
          }return a;
        }function oe(e) {
          return e && e.filter(function (e) {
            return e && e.componentOptions;
          })[0];
        }function re(e) {
          e._events = Object.create(null), e._hasHookEvent = !1;var t = e.$options._parentListeners;t && se(e, t);
        }function ae(e, t, n) {
          n ? Wo.$once(e, t) : Wo.$on(e, t);
        }function ie(e, t) {
          Wo.$off(e, t);
        }function se(e, t, n) {
          Wo = e, Z(t, n || {}, ae, ie, e);
        }function le(e, t) {
          var n = {};if (!e) return n;for (var o, r, a = [], i = 0, s = e.length; i < s; i++) {
            if (r = e[i], (r.context === t || r.functionalContext === t) && r.data && (o = r.data.slot)) {
              var l = n[o] || (n[o] = []);"template" === r.tag ? l.push.apply(l, r.children) : l.push(r);
            } else a.push(r);
          }return a.every(ue) || (n.default = a), n;
        }function ue(e) {
          return e.isComment || " " === e.text;
        }function ce(e) {
          for (var t = {}, n = 0; n < e.length; n++) {
            t[e[n][0]] = e[n][1];
          }return t;
        }function de(e) {
          var t = e.$options,
              n = t.parent;if (n && !t.abstract) {
            for (; n.$options.abstract && n.$parent;) {
              n = n.$parent;
            }n.$children.push(e);
          }e.$parent = n, e.$root = n ? n.$root : e, e.$children = [], e.$refs = {}, e._watcher = null, e._inactive = null, e._directInactive = !1, e._isMounted = !1, e._isDestroyed = !1, e._isBeingDestroyed = !1;
        }function pe(t, n, o) {
          t.$el = n, t.$options.render || (t.$options.render = qo, "production" !== e.env.NODE_ENV && (t.$options.template && "#" !== t.$options.template.charAt(0) || t.$options.el || n ? _o("You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.", t) : _o("Failed to mount component: template or render function not defined.", t))), ge(t, "beforeMount");var r;return r = "production" !== e.env.NODE_ENV && to.performance && Jo ? function () {
            var e = t._name,
                n = t._uid,
                r = "vue-perf-start:" + n,
                a = "vue-perf-end:" + n;Jo(r);var i = t._render();Jo(a), Ro(e + " render", r, a), Jo(r), t._update(i, o), Jo(a), Ro(e + " patch", r, a);
          } : function () {
            t._update(t._render(), o);
          }, t._watcher = new or(t, r, h), o = !1, null == t.$vnode && (t._isMounted = !0, ge(t, "mounted")), t;
        }function fe(t, n, o, r, a) {
          var i = !!(a || t.$options._renderChildren || r.data.scopedSlots || t.$scopedSlots !== no);if (t.$options._parentVnode = r, t.$vnode = r, t._vnode && (t._vnode.parent = r), t.$options._renderChildren = a, n && t.$options.props) {
            Do.shouldConvert = !1, "production" !== e.env.NODE_ENV && (Do.isSettingProps = !0);for (var s = t._props, l = t.$options._propKeys || [], u = 0; u < l.length; u++) {
              var c = l[u];s[c] = J(c, t.$options.props, n, t);
            }Do.shouldConvert = !0, "production" !== e.env.NODE_ENV && (Do.isSettingProps = !1), t.$options.propsData = n;
          }if (o) {
            var d = t.$options._parentListeners;t.$options._parentListeners = o, se(t, o, d);
          }i && (t.$slots = le(a, r.context), t.$forceUpdate());
        }function me(e) {
          for (; e && (e = e.$parent);) {
            if (e._inactive) return !0;
          }return !1;
        }function ve(e, t) {
          if (t) {
            if (e._directInactive = !1, me(e)) return;
          } else if (e._directInactive) return;if (e._inactive || null == e._inactive) {
            e._inactive = !1;for (var n = 0; n < e.$children.length; n++) {
              ve(e.$children[n]);
            }ge(e, "activated");
          }
        }function he(e, t) {
          if (!(t && (e._directInactive = !0, me(e)) || e._inactive)) {
            e._inactive = !0;for (var n = 0; n < e.$children.length; n++) {
              he(e.$children[n]);
            }ge(e, "deactivated");
          }
        }function ge(e, t) {
          var n = e.$options[t];if (n) for (var o = 0, r = n.length; o < r; o++) {
            try {
              n[o].call(e);
            } catch (n) {
              q(n, e, t + " hook");
            }
          }e._hasHookEvent && e.$emit("hook:" + t);
        }function ye() {
          Ko.length = 0, Xo = {}, "production" !== e.env.NODE_ENV && (Zo = {}), Qo = er = !1;
        }function _e() {
          er = !0;var t, n, o;for (Ko.sort(function (e, t) {
            return e.id - t.id;
          }), tr = 0; tr < Ko.length; tr++) {
            if (t = Ko[tr], n = t.id, Xo[n] = null, t.run(), "production" !== e.env.NODE_ENV && null != Xo[n] && (Zo[n] = (Zo[n] || 0) + 1, Zo[n] > to._maxUpdateCount)) {
              _o("You may have an infinite update loop " + (t.user ? 'in watcher with expression "' + t.expression + '"' : "in a component render function."), t.vm);break;
            }
          }var r = Ko.slice();for (ye(), tr = r.length; tr--;) {
            t = r[tr], o = t.vm, o._watcher === t && o._isMounted && ge(o, "updated");
          }vo && to.devtools && vo.emit("flush");
        }function be(e) {
          var t = e.id;if (null == Xo[t]) {
            if (Xo[t] = !0, er) {
              for (var n = Ko.length - 1; n >= 0 && Ko[n].id > e.id;) {
                n--;
              }Ko.splice(Math.max(n, tr) + 1, 0, e);
            } else Ko.push(e);Qo || (Qo = !0, go(_e));
          }
        }function xe(e) {
          rr.clear(), we(e, rr);
        }function we(e, t) {
          var n,
              o,
              r = Array.isArray(e);if ((r || f(e)) && Object.isExtensible(e)) {
            if (e.__ob__) {
              var a = e.__ob__.dep.id;if (t.has(a)) return;t.add(a);
            }if (r) for (n = e.length; n--;) {
              we(e[n], t);
            } else for (o = Object.keys(e), n = o.length; n--;) {
              we(e[o[n]], t);
            }
          }
        }function ke(e, t, n) {
          ar.get = function () {
            return this[t][n];
          }, ar.set = function (e) {
            this[t][n] = e;
          }, Object.defineProperty(e, n, ar);
        }function Ce(e) {
          e._watchers = [];var t = e.$options;t.props && Se(e, t.props), t.methods && je(e, t.methods), t.data ? Me(e) : N(e._data = {}, !0), t.computed && Ne(e, t.computed), t.watch && Te(e, t.watch);
        }function Se(t, n) {
          var o = t.$options.propsData || {},
              r = t._props = {},
              a = t.$options._propKeys = [],
              i = !t.$parent;Do.shouldConvert = i;for (var s in n) {
            !function (i) {
              a.push(i);var s = J(i, n, o, t);"production" !== e.env.NODE_ENV ? (ir[i] && _o('"' + i + '" is a reserved attribute and cannot be used as component prop.', t), E(r, i, s, function () {
                t.$parent && !Do.isSettingProps && _o("Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: \"" + i + '"', t);
              })) : E(r, i, s), i in t || ke(t, "_props", i);
            }(s);
          }Do.shouldConvert = !0;
        }function Me(t) {
          var n = t.$options.data;n = t._data = "function" == typeof n ? Oe(n, t) : n || {}, m(n) || (n = {}, "production" !== e.env.NODE_ENV && _o("data functions should return an object:\nhttps://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function", t));for (var o = Object.keys(n), r = t.$options.props, a = o.length; a--;) {
            r && s(r, o[a]) ? "production" !== e.env.NODE_ENV && _o('The data property "' + o[a] + '" is already declared as a prop. Use prop default value instead.', t) : b(o[a]) || ke(t, "_data", o[a]);
          }N(n, !0);
        }function Oe(e, t) {
          try {
            return e.call(t);
          } catch (e) {
            return q(e, t, "data()"), {};
          }
        }function Ne(t, n) {
          var o = t._computedWatchers = Object.create(null);for (var r in n) {
            var a = n[r],
                i = "function" == typeof a ? a : a.get;"production" !== e.env.NODE_ENV && void 0 === i && (_o('No getter function has been defined for computed property "' + r + '".', t), i = h), o[r] = new or(t, i, h, sr), r in t || Ee(t, r, a);
          }
        }function Ee(e, t, n) {
          "function" == typeof n ? (ar.get = De(t), ar.set = h) : (ar.get = n.get ? !1 !== n.cache ? De(t) : n.get : h, ar.set = n.set ? n.set : h), Object.defineProperty(e, t, ar);
        }function De(e) {
          return function () {
            var t = this._computedWatchers && this._computedWatchers[e];if (t) return t.dirty && t.evaluate(), So.target && t.depend(), t.value;
          };
        }function je(t, n) {
          var o = t.$options.props;for (var r in n) {
            t[r] = null == n[r] ? h : c(n[r], t), "production" !== e.env.NODE_ENV && (null == n[r] && _o('method "' + r + '" has an undefined value in the component definition. Did you reference the function correctly?', t), o && s(o, r) && _o('method "' + r + '" has already been defined as a prop.', t));
          }
        }function Te(e, t) {
          for (var n in t) {
            var o = t[n];if (Array.isArray(o)) for (var r = 0; r < o.length; r++) {
              Pe(e, n, o[r]);
            } else Pe(e, n, o);
          }
        }function Pe(e, t, n) {
          var o;m(n) && (o = n, n = n.handler), "string" == typeof n && (n = e[n]), e.$watch(t, n, o);
        }function $e(t, n, o, r, a) {
          if (t) {
            var i = o.$options._base;if (f(t) && (t = i.extend(t)), "function" != typeof t) return void ("production" !== e.env.NODE_ENV && _o("Invalid Component definition: " + String(t), o));if (!t.cid) if (t.resolved) t = t.resolved;else if (!(t = Ve(t, i, function () {
              o.$forceUpdate();
            }))) return;at(t), n = n || {}, n.model && Re(t.options, n);var s = Ue(n, t, a);if (t.options.functional) return Ae(t, s, n, o, r);var l = n.on;n.on = n.nativeOn, t.options.abstract && (n = {}), Ye(n);var u = t.options.name || a;return new Fo("vue-component-" + t.cid + (u ? "-" + u : ""), n, void 0, void 0, void 0, o, { Ctor: t, propsData: s, listeners: l, tag: a, children: r });
          }
        }function Ae(e, t, n, o, r) {
          var a = {},
              i = e.options.props;if (i) for (var s in i) {
            a[s] = J(s, i, t);
          }var l = Object.create(o),
              u = function u(e, t, n, o) {
            return Be(l, e, t, n, o, !0);
          },
              c = e.options.render.call(null, u, { props: a, data: n, parent: o, children: r, slots: function slots() {
              return le(r, o);
            } });return c instanceof Fo && (c.functionalContext = o, n.slot && ((c.data || (c.data = {})).slot = n.slot)), c;
        }function Ie(e, t, n, o) {
          var r = e.componentOptions,
              a = { _isComponent: !0, parent: t, propsData: r.propsData, _componentTag: r.tag, _parentVnode: e, _parentListeners: r.listeners, _renderChildren: r.children, _parentElm: n || null, _refElm: o || null },
              i = e.data.inlineTemplate;return i && (a.render = i.render, a.staticRenderFns = i.staticRenderFns), new r.Ctor(a);
        }function Ve(t, n, o) {
          if (!t.requested) {
            t.requested = !0;var r = t.pendingCallbacks = [o],
                a = !0,
                i = function i(e) {
              if (f(e) && (e = n.extend(e)), t.resolved = e, !a) for (var o = 0, i = r.length; o < i; o++) {
                r[o](e);
              }
            },
                s = function s(n) {
              "production" !== e.env.NODE_ENV && _o("Failed to resolve async component: " + String(t) + (n ? "\nReason: " + n : ""));
            },
                l = t(i, s);return l && "function" == typeof l.then && !t.resolved && l.then(i, s), a = !1, t.resolved;
          }t.pendingCallbacks.push(o);
        }function Ue(t, n, o) {
          var r = n.options.props;if (r) {
            var a = {},
                i = t.attrs,
                s = t.props,
                l = t.domProps;if (i || s || l) for (var u in r) {
              var c = Kn(u);if ("production" !== e.env.NODE_ENV) {
                var d = u.toLowerCase();u !== d && i && i.hasOwnProperty(d) && bo('Prop "' + d + '" is passed to component ' + yo(o || n) + ', but the declared prop name is "' + u + '". Note that HTML attributes are case-insensitive and camelCased props need to use their kebab-case equivalents when using in-DOM templates. You should probably use "' + c + '" instead of "' + u + '".');
              }Le(a, s, u, c, !0) || Le(a, i, u, c) || Le(a, l, u, c);
            }return a;
          }
        }function Le(e, t, n, o, r) {
          if (t) {
            if (s(t, n)) return e[n] = t[n], r || delete t[n], !0;if (s(t, o)) return e[n] = t[o], r || delete t[o], !0;
          }return !1;
        }function Ye(e) {
          e.hook || (e.hook = {});for (var t = 0; t < ur.length; t++) {
            var n = ur[t],
                o = e.hook[n],
                r = lr[n];e.hook[n] = o ? Je(r, o) : r;
          }
        }function Je(e, t) {
          return function (n, o, r, a) {
            e(n, o, r, a), t(n, o, r, a);
          };
        }function Re(e, t) {
          var n = e.model && e.model.prop || "value",
              o = e.model && e.model.event || "input";(t.props || (t.props = {}))[n] = t.model.value;var r = t.on || (t.on = {});r[o] ? r[o] = [t.model.callback].concat(r[o]) : r[o] = t.model.callback;
        }
        function Be(e, t, n, o, r, a) {
          return (Array.isArray(n) || l(n)) && (r = o, o = n, n = void 0), a && (r = dr), Fe(e, t, n, o, r);
        }function Fe(t, n, o, r, a) {
          if (o && o.__ob__) return "production" !== e.env.NODE_ENV && _o("Avoid using observed data object as vnode data: " + JSON.stringify(o) + "\nAlways create fresh vnode data objects in each render!", t), qo();if (!n) return qo();Array.isArray(r) && "function" == typeof r[0] && (o = o || {}, o.scopedSlots = { default: r[0] }, r.length = 0), a === dr ? r = te(r) : a === cr && (r = ee(r));var i, s;if ("string" == typeof n) {
            var l;s = to.getTagNamespace(n), i = to.isReservedTag(n) ? new Fo(to.parsePlatformTagName(n), o, r, void 0, void 0, t) : (l = Y(t.$options, "components", n)) ? $e(l, o, t, r, n) : new Fo(n, o, r, void 0, void 0, t);
          } else i = $e(n, o, t, r);return i ? (s && He(i, s), i) : qo();
        }function He(e, t) {
          if (e.ns = t, "foreignObject" !== e.tag && e.children) for (var n = 0, o = e.children.length; n < o; n++) {
            var r = e.children[n];r.tag && !r.ns && He(r, t);
          }
        }function We(e, t) {
          var n, o, r, a, i;if (Array.isArray(e) || "string" == typeof e) for (n = new Array(e.length), o = 0, r = e.length; o < r; o++) {
            n[o] = t(e[o], o);
          } else if ("number" == typeof e) for (n = new Array(e), o = 0; o < e; o++) {
            n[o] = t(o + 1, o);
          } else if (f(e)) for (a = Object.keys(e), n = new Array(a.length), o = 0, r = a.length; o < r; o++) {
            i = a[o], n[o] = t(e[i], i, o);
          }return n;
        }function qe(t, n, o, r) {
          var a = this.$scopedSlots[t];if (a) return o = o || {}, r && p(o, r), a(o) || n;var i = this.$slots[t];return i && "production" !== e.env.NODE_ENV && (i._rendered && _o('Duplicate presence of slot "' + t + '" found in the same render tree - this will likely cause render errors.', this), i._rendered = !0), i || n;
        }function ze(e) {
          return Y(this.$options, "filters", e, !0) || eo;
        }function Ge(e, t, n) {
          var o = to.keyCodes[t] || n;return Array.isArray(o) ? -1 === o.indexOf(e) : o !== e;
        }function Ke(t, n, o, r) {
          if (o) if (f(o)) {
            Array.isArray(o) && (o = v(o));var a;for (var i in o) {
              if ("class" === i || "style" === i) a = t;else {
                var s = t.attrs && t.attrs.type;a = r || to.mustUseProp(n, s, i) ? t.domProps || (t.domProps = {}) : t.attrs || (t.attrs = {});
              }i in a || (a[i] = o[i]);
            }
          } else "production" !== e.env.NODE_ENV && _o("v-bind without argument expects an Object or Array value", this);return t;
        }function Xe(e, t) {
          var n = this._staticTrees[e];return n && !t ? Array.isArray(n) ? K(n) : G(n) : (n = this._staticTrees[e] = this.$options.staticRenderFns[e].call(this._renderProxy), Qe(n, "__static__" + e, !1), n);
        }function Ze(e, t, n) {
          return Qe(e, "__once__" + t + (n ? "_" + n : ""), !0), e;
        }function Qe(e, t, n) {
          if (Array.isArray(e)) for (var o = 0; o < e.length; o++) {
            e[o] && "string" != typeof e[o] && et(e[o], t + "_" + o, n);
          } else et(e, t, n);
        }function et(e, t, n) {
          e.isStatic = !0, e.key = t, e.isOnce = n;
        }function tt(e) {
          e.$vnode = null, e._vnode = null, e._staticTrees = null;var t = e.$options._parentVnode,
              n = t && t.context;e.$slots = le(e.$options._renderChildren, n), e.$scopedSlots = no, e._c = function (t, n, o, r) {
            return Be(e, t, n, o, r, !1);
          }, e.$createElement = function (t, n, o, r) {
            return Be(e, t, n, o, r, !0);
          };
        }function nt(e) {
          var t = e.$options.provide;t && (e._provided = "function" == typeof t ? t.call(e) : t);
        }function ot(t) {
          var n = t.$options.inject;if (n) for (var o = Array.isArray(n), r = o ? n : ho ? Reflect.ownKeys(n) : Object.keys(n), a = 0; a < r.length; a++) {
            !function (a) {
              for (var i = r[a], s = o ? i : n[i], l = t; l;) {
                if (l._provided && s in l._provided) {
                  "production" !== e.env.NODE_ENV ? E(t, i, l._provided[s], function () {
                    _o('Avoid mutating an injected value directly since the changes will be overwritten whenever the provided component re-renders. injection being mutated: "' + i + '"', t);
                  }) : E(t, i, l._provided[s]);break;
                }l = l.$parent;
              }
            }(a);
          }
        }function rt(e, t) {
          var n = e.$options = Object.create(e.constructor.options);n.parent = t.parent, n.propsData = t.propsData, n._parentVnode = t._parentVnode, n._parentListeners = t._parentListeners, n._renderChildren = t._renderChildren, n._componentTag = t._componentTag, n._parentElm = t._parentElm, n._refElm = t._refElm, t.render && (n.render = t.render, n.staticRenderFns = t.staticRenderFns);
        }function at(e) {
          var t = e.options;if (e.super) {
            var n = at(e.super);if (n !== e.superOptions) {
              e.superOptions = n;var o = it(e);o && p(e.extendOptions, o), t = e.options = L(n, e.extendOptions), t.name && (t.components[t.name] = e);
            }
          }return t;
        }function it(e) {
          var t,
              n = e.options,
              o = e.sealedOptions;for (var r in n) {
            n[r] !== o[r] && (t || (t = {}), t[r] = st(n[r], o[r]));
          }return t;
        }function st(e, t) {
          if (Array.isArray(e)) {
            var n = [];t = Array.isArray(t) ? t : [t];for (var o = 0; o < e.length; o++) {
              t.indexOf(e[o]) < 0 && n.push(e[o]);
            }return n;
          }return e;
        }function lt(t) {
          "production" === e.env.NODE_ENV || this instanceof lt || _o("Vue is a constructor and should be called with the `new` keyword"), this._init(t);
        }function ut(e) {
          e.use = function (e) {
            if (!e.installed) {
              var t = d(arguments, 1);return t.unshift(this), "function" == typeof e.install ? e.install.apply(e, t) : "function" == typeof e && e.apply(null, t), e.installed = !0, this;
            }
          };
        }function ct(e) {
          e.mixin = function (e) {
            this.options = L(this.options, e);
          };
        }function dt(t) {
          t.cid = 0;var n = 1;t.extend = function (t) {
            t = t || {};var o = this,
                r = o.cid,
                a = t._Ctor || (t._Ctor = {});if (a[r]) return a[r];var i = t.name || o.options.name;"production" !== e.env.NODE_ENV && (/^[a-zA-Z][\w-]*$/.test(i) || _o('Invalid component name: "' + i + '". Component names can only contain alphanumeric characters and the hyphen, and must start with a letter.'));var s = function s(e) {
              this._init(e);
            };return s.prototype = Object.create(o.prototype), s.prototype.constructor = s, s.cid = n++, s.options = L(o.options, t), s.super = o, s.options.props && pt(s), s.options.computed && ft(s), s.extend = o.extend, s.mixin = o.mixin, s.use = o.use, to._assetTypes.forEach(function (e) {
              s[e] = o[e];
            }), i && (s.options.components[i] = s), s.superOptions = o.options, s.extendOptions = t, s.sealedOptions = p({}, s.options), a[r] = s, s;
          };
        }function pt(e) {
          var t = e.options.props;for (var n in t) {
            ke(e.prototype, "_props", n);
          }
        }function ft(e) {
          var t = e.options.computed;for (var n in t) {
            Ee(e.prototype, n, t[n]);
          }
        }function mt(t) {
          to._assetTypes.forEach(function (n) {
            t[n] = function (t, o) {
              return o ? ("production" !== e.env.NODE_ENV && "component" === n && to.isReservedTag(t) && _o("Do not use built-in or reserved HTML elements as component id: " + t), "component" === n && m(o) && (o.name = o.name || t, o = this.options._base.extend(o)), "directive" === n && "function" == typeof o && (o = { bind: o, update: o }), this.options[n + "s"][t] = o, o) : this.options[n + "s"][t];
            };
          });
        }function vt(e) {
          return e && (e.Ctor.options.name || e.tag);
        }function ht(e, t) {
          return "string" == typeof e ? e.split(",").indexOf(t) > -1 : e instanceof RegExp && e.test(t);
        }function gt(e, t) {
          for (var n in e) {
            var o = e[n];if (o) {
              var r = vt(o.componentOptions);r && !t(r) && (yt(o), e[n] = null);
            }
          }
        }function yt(e) {
          e && (e.componentInstance._inactive || ge(e.componentInstance, "deactivated"), e.componentInstance.$destroy());
        }function _t(e) {
          for (var t = e.data, n = e, o = e; o.componentInstance;) {
            o = o.componentInstance._vnode, o.data && (t = bt(o.data, t));
          }for (; n = n.parent;) {
            n.data && (t = bt(t, n.data));
          }return xt(t);
        }function bt(e, t) {
          return { staticClass: wt(e.staticClass, t.staticClass), class: e.class ? [e.class, t.class] : t.class };
        }function xt(e) {
          var t = e.class,
              n = e.staticClass;return n || t ? wt(n, kt(t)) : "";
        }function wt(e, t) {
          return e ? t ? e + " " + t : e : t || "";
        }function kt(e) {
          var t = "";if (!e) return t;if ("string" == typeof e) return e;if (Array.isArray(e)) {
            for (var n, o = 0, r = e.length; o < r; o++) {
              e[o] && (n = kt(e[o])) && (t += n + " ");
            }return t.slice(0, -1);
          }if (f(e)) {
            for (var a in e) {
              e[a] && (t += a + " ");
            }return t.slice(0, -1);
          }return t;
        }function Ct(e) {
          return Nr(e) ? "svg" : "math" === e ? "math" : void 0;
        }function St(e) {
          if (!ao) return !0;if (Er(e)) return !1;if (e = e.toLowerCase(), null != Dr[e]) return Dr[e];var t = document.createElement(e);return e.indexOf("-") > -1 ? Dr[e] = t.constructor === window.HTMLUnknownElement || t.constructor === window.HTMLElement : Dr[e] = /HTMLUnknownElement/.test(t.toString());
        }function Mt(t) {
          if ("string" == typeof t) {
            var n = document.querySelector(t);return n || ("production" !== e.env.NODE_ENV && _o("Cannot find element: " + t), document.createElement("div"));
          }return t;
        }function Ot(e, t) {
          var n = document.createElement(e);return "select" !== e ? n : (t.data && t.data.attrs && void 0 !== t.data.attrs.multiple && n.setAttribute("multiple", "multiple"), n);
        }function Nt(e, t) {
          return document.createElementNS(Mr[e], t);
        }function Et(e) {
          return document.createTextNode(e);
        }function Dt(e) {
          return document.createComment(e);
        }function jt(e, t, n) {
          e.insertBefore(t, n);
        }function Tt(e, t) {
          e.removeChild(t);
        }function Pt(e, t) {
          e.appendChild(t);
        }function $t(e) {
          return e.parentNode;
        }function At(e) {
          return e.nextSibling;
        }function It(e) {
          return e.tagName;
        }function Vt(e, t) {
          e.textContent = t;
        }function Ut(e, t, n) {
          e.setAttribute(t, n);
        }function Lt(e, t) {
          var n = e.data.ref;if (n) {
            var o = e.context,
                r = e.componentInstance || e.elm,
                a = o.$refs;t ? Array.isArray(a[n]) ? i(a[n], r) : a[n] === r && (a[n] = void 0) : e.data.refInFor ? Array.isArray(a[n]) && a[n].indexOf(r) < 0 ? a[n].push(r) : a[n] = [r] : a[n] = r;
          }
        }function Yt(e) {
          return void 0 === e || null === e;
        }function Jt(e) {
          return void 0 !== e && null !== e;
        }function Rt(e) {
          return !0 === e;
        }function Bt(e, t) {
          return e.key === t.key && e.tag === t.tag && e.isComment === t.isComment && Jt(e.data) === Jt(t.data) && Ft(e, t);
        }function Ft(e, t) {
          if ("input" !== e.tag) return !0;var n;return (Jt(n = e.data) && Jt(n = n.attrs) && n.type) === (Jt(n = t.data) && Jt(n = n.attrs) && n.type);
        }function Ht(e, t, n) {
          var o,
              r,
              a = {};for (o = t; o <= n; ++o) {
            r = e[o].key, Jt(r) && (a[r] = o);
          }return a;
        }function Wt(e, t) {
          (e.data.directives || t.data.directives) && qt(e, t);
        }function qt(e, t) {
          var n,
              o,
              r,
              a = e === Pr,
              i = t === Pr,
              s = zt(e.data.directives, e.context),
              l = zt(t.data.directives, t.context),
              u = [],
              c = [];for (n in l) {
            o = s[n], r = l[n], o ? (r.oldValue = o.value, Kt(r, "update", t, e), r.def && r.def.componentUpdated && c.push(r)) : (Kt(r, "bind", t, e), r.def && r.def.inserted && u.push(r));
          }if (u.length) {
            var d = function d() {
              for (var n = 0; n < u.length; n++) {
                Kt(u[n], "inserted", t, e);
              }
            };a ? Q(t.data.hook || (t.data.hook = {}), "insert", d) : d();
          }if (c.length && Q(t.data.hook || (t.data.hook = {}), "postpatch", function () {
            for (var n = 0; n < c.length; n++) {
              Kt(c[n], "componentUpdated", t, e);
            }
          }), !a) for (n in s) {
            l[n] || Kt(s[n], "unbind", e, e, i);
          }
        }function zt(e, t) {
          var n = Object.create(null);if (!e) return n;var o, r;for (o = 0; o < e.length; o++) {
            r = e[o], r.modifiers || (r.modifiers = Ir), n[Gt(r)] = r, r.def = Y(t.$options, "directives", r.name, !0);
          }return n;
        }function Gt(e) {
          return e.rawName || e.name + "." + Object.keys(e.modifiers || {}).join(".");
        }function Kt(e, t, n, o, r) {
          var a = e.def && e.def[t];a && a(n.elm, e, n, o, r);
        }function Xt(e, t) {
          if (e.data.attrs || t.data.attrs) {
            var n,
                o,
                r = t.elm,
                a = e.data.attrs || {},
                i = t.data.attrs || {};i.__ob__ && (i = t.data.attrs = p({}, i));for (n in i) {
              o = i[n], a[n] !== o && Zt(r, n, o);
            }lo && i.value !== a.value && Zt(r, "value", i.value);for (n in a) {
              null == i[n] && (kr(n) ? r.removeAttributeNS(wr, Cr(n)) : br(n) || r.removeAttribute(n));
            }
          }
        }function Zt(e, t, n) {
          xr(t) ? Sr(n) ? e.removeAttribute(t) : e.setAttribute(t, t) : br(t) ? e.setAttribute(t, Sr(n) || "false" === n ? "false" : "true") : kr(t) ? Sr(n) ? e.removeAttributeNS(wr, Cr(t)) : e.setAttributeNS(wr, t, n) : Sr(n) ? e.removeAttribute(t) : e.setAttribute(t, n);
        }function Qt(e, t) {
          var n = t.elm,
              o = t.data,
              r = e.data;if (o.staticClass || o.class || r && (r.staticClass || r.class)) {
            var a = _t(t),
                i = n._transitionClasses;i && (a = wt(a, kt(i))), a !== n._prevClass && (n.setAttribute("class", a), n._prevClass = a);
          }
        }function en(e) {
          var t;e[Yr] && (t = so ? "change" : "input", e[t] = [].concat(e[Yr], e[t] || []), delete e[Yr]), e[Jr] && (t = fo ? "click" : "change", e[t] = [].concat(e[Jr], e[t] || []), delete e[Jr]);
        }function tn(e, _t3, n, o) {
          if (n) {
            var r = _t3,
                a = hr;_t3 = function t(n) {
              null !== (1 === arguments.length ? r(n) : r.apply(null, arguments)) && nn(e, _t3, o, a);
            };
          }hr.addEventListener(e, _t3, o);
        }function nn(e, t, n, o) {
          (o || hr).removeEventListener(e, t, n);
        }function on(e, t) {
          if (e.data.on || t.data.on) {
            var n = t.data.on || {},
                o = e.data.on || {};hr = t.elm, en(n), Z(n, o, tn, nn, t.context);
          }
        }function rn(e, t) {
          if (e.data.domProps || t.data.domProps) {
            var n,
                o,
                r = t.elm,
                a = e.data.domProps || {},
                i = t.data.domProps || {};i.__ob__ && (i = t.data.domProps = p({}, i));for (n in a) {
              null == i[n] && (r[n] = "");
            }for (n in i) {
              if (o = i[n], "textContent" !== n && "innerHTML" !== n || (t.children && (t.children.length = 0), o !== a[n])) if ("value" === n) {
                r._value = o;var s = null == o ? "" : String(o);an(r, t, s) && (r.value = s);
              } else r[n] = o;
            }
          }
        }function an(e, t, n) {
          return !e.composing && ("option" === t.tag || sn(e, n) || ln(e, n));
        }function sn(e, t) {
          return document.activeElement !== e && e.value !== t;
        }function ln(e, t) {
          var n = e.value,
              o = e._vModifiers;return o && o.number || "number" === e.type ? r(n) !== r(t) : o && o.trim ? n.trim() !== t.trim() : n !== t;
        }function un(e) {
          var t = cn(e.style);return e.staticStyle ? p(e.staticStyle, t) : t;
        }function cn(e) {
          return Array.isArray(e) ? v(e) : "string" == typeof e ? Fr(e) : e;
        }function dn(e, t) {
          var n,
              o = {};if (t) for (var r = e; r.componentInstance;) {
            r = r.componentInstance._vnode, r.data && (n = un(r.data)) && p(o, n);
          }(n = un(e.data)) && p(o, n);for (var a = e; a = a.parent;) {
            a.data && (n = un(a.data)) && p(o, n);
          }return o;
        }function pn(e, t) {
          var n = t.data,
              o = e.data;if (n.staticStyle || n.style || o.staticStyle || o.style) {
            var r,
                a,
                i = t.elm,
                s = e.data.staticStyle,
                l = e.data.style || {},
                u = s || l,
                c = cn(t.data.style) || {};t.data.style = c.__ob__ ? p({}, c) : c;var d = dn(t, !0);for (a in u) {
              null == d[a] && qr(i, a, "");
            }for (a in d) {
              (r = d[a]) !== u[a] && qr(i, a, null == r ? "" : r);
            }
          }
        }function fn(e, t) {
          if (t && (t = t.trim())) if (e.classList) t.indexOf(" ") > -1 ? t.split(/\s+/).forEach(function (t) {
            return e.classList.add(t);
          }) : e.classList.add(t);else {
            var n = " " + (e.getAttribute("class") || "") + " ";n.indexOf(" " + t + " ") < 0 && e.setAttribute("class", (n + t).trim());
          }
        }function mn(e, t) {
          if (t && (t = t.trim())) if (e.classList) t.indexOf(" ") > -1 ? t.split(/\s+/).forEach(function (t) {
            return e.classList.remove(t);
          }) : e.classList.remove(t);else {
            for (var n = " " + (e.getAttribute("class") || "") + " ", o = " " + t + " "; n.indexOf(o) >= 0;) {
              n = n.replace(o, " ");
            }e.setAttribute("class", n.trim());
          }
        }function vn(e) {
          if (e) {
            if ("object" == (typeof e === "undefined" ? "undefined" : _typeof(e))) {
              var t = {};return !1 !== e.css && p(t, Xr(e.name || "v")), p(t, e), t;
            }return "string" == typeof e ? Xr(e) : void 0;
          }
        }function hn(e) {
          aa(function () {
            aa(e);
          });
        }function gn(e, t) {
          (e._transitionClasses || (e._transitionClasses = [])).push(t), fn(e, t);
        }function yn(e, t) {
          e._transitionClasses && i(e._transitionClasses, t), mn(e, t);
        }function _n(e, t, n) {
          var o = bn(e, t),
              r = o.type,
              a = o.timeout,
              i = o.propCount;if (!r) return n();var s = r === Qr ? na : ra,
              l = 0,
              u = function u() {
            e.removeEventListener(s, c), n();
          },
              c = function c(t) {
            t.target === e && ++l >= i && u();
          };setTimeout(function () {
            l < i && u();
          }, a + 1), e.addEventListener(s, c);
        }function bn(e, t) {
          var n,
              o = window.getComputedStyle(e),
              r = o[ta + "Delay"].split(", "),
              a = o[ta + "Duration"].split(", "),
              i = xn(r, a),
              s = o[oa + "Delay"].split(", "),
              l = o[oa + "Duration"].split(", "),
              u = xn(s, l),
              c = 0,
              d = 0;return t === Qr ? i > 0 && (n = Qr, c = i, d = a.length) : t === ea ? u > 0 && (n = ea, c = u, d = l.length) : (c = Math.max(i, u), n = c > 0 ? i > u ? Qr : ea : null, d = n ? n === Qr ? a.length : l.length : 0), { type: n, timeout: c, propCount: d, hasTransform: n === Qr && ia.test(o[ta + "Property"]) };
        }function xn(e, t) {
          for (; e.length < t.length;) {
            e = e.concat(e);
          }return Math.max.apply(null, t.map(function (t, n) {
            return wn(t) + wn(e[n]);
          }));
        }function wn(e) {
          return 1e3 * Number(e.slice(0, -1));
        }function kn(t, n) {
          var o = t.elm;o._leaveCb && (o._leaveCb.cancelled = !0, o._leaveCb());var a = vn(t.data.transition);if (a && !o._enterCb && 1 === o.nodeType) {
            for (var i = a.css, s = a.type, l = a.enterClass, u = a.enterToClass, c = a.enterActiveClass, d = a.appearClass, p = a.appearToClass, m = a.appearActiveClass, v = a.beforeEnter, h = a.enter, g = a.afterEnter, y = a.enterCancelled, b = a.beforeAppear, x = a.appear, w = a.afterAppear, k = a.appearCancelled, C = a.duration, S = Go, M = Go.$vnode; M && M.parent;) {
              M = M.parent, S = M.context;
            }var O = !S._isMounted || !t.isRootInsert;if (!O || x || "" === x) {
              var N = O && d ? d : l,
                  E = O && m ? m : c,
                  D = O && p ? p : u,
                  j = O ? b || v : v,
                  T = O && "function" == typeof x ? x : h,
                  P = O ? w || g : g,
                  $ = O ? k || y : y,
                  A = r(f(C) ? C.enter : C);"production" !== e.env.NODE_ENV && null != A && Sn(A, "enter", t);var I = !1 !== i && !lo,
                  V = On(T),
                  U = o._enterCb = _(function () {
                I && (yn(o, D), yn(o, E)), U.cancelled ? (I && yn(o, N), $ && $(o)) : P && P(o), o._enterCb = null;
              });t.data.show || Q(t.data.hook || (t.data.hook = {}), "insert", function () {
                var e = o.parentNode,
                    n = e && e._pending && e._pending[t.key];n && n.tag === t.tag && n.elm._leaveCb && n.elm._leaveCb(), T && T(o, U);
              }), j && j(o), I && (gn(o, N), gn(o, E), hn(function () {
                gn(o, D), yn(o, N), U.cancelled || V || (Mn(A) ? setTimeout(U, A) : _n(o, s, U));
              })), t.data.show && (n && n(), T && T(o, U)), I || V || U();
            }
          }
        }function Cn(t, n) {
          function o() {
            k.cancelled || (t.data.show || ((a.parentNode._pending || (a.parentNode._pending = {}))[t.key] = t), p && p(a), b && (gn(a, u), gn(a, d), hn(function () {
              gn(a, c), yn(a, u), k.cancelled || x || (Mn(w) ? setTimeout(k, w) : _n(a, l, k));
            })), m && m(a, k), b || x || k());
          }var a = t.elm;a._enterCb && (a._enterCb.cancelled = !0, a._enterCb());var i = vn(t.data.transition);if (!i) return n();if (!a._leaveCb && 1 === a.nodeType) {
            var s = i.css,
                l = i.type,
                u = i.leaveClass,
                c = i.leaveToClass,
                d = i.leaveActiveClass,
                p = i.beforeLeave,
                m = i.leave,
                v = i.afterLeave,
                h = i.leaveCancelled,
                g = i.delayLeave,
                y = i.duration,
                b = !1 !== s && !lo,
                x = On(m),
                w = r(f(y) ? y.leave : y);"production" !== e.env.NODE_ENV && null != w && Sn(w, "leave", t);var k = a._leaveCb = _(function () {
              a.parentNode && a.parentNode._pending && (a.parentNode._pending[t.key] = null), b && (yn(a, c), yn(a, d)), k.cancelled ? (b && yn(a, u), h && h(a)) : (n(), v && v(a)), a._leaveCb = null;
            });g ? g(o) : o();
          }
        }function Sn(e, t, n) {
          "number" != typeof e ? _o("<transition> explicit " + t + " duration is not a valid number - got " + JSON.stringify(e) + ".", n.context) : isNaN(e) && _o("<transition> explicit " + t + " duration is NaN - the duration expression might be incorrect.", n.context);
        }function Mn(e) {
          return "number" == typeof e && !isNaN(e);
        }function On(e) {
          if (!e) return !1;var t = e.fns;return t ? On(Array.isArray(t) ? t[0] : t) : (e._length || e.length) > 1;
        }function Nn(e, t) {
          t.data.show || kn(t);
        }function En(t, n, o) {
          var r = n.value,
              a = t.multiple;if (a && !Array.isArray(r)) return void ("production" !== e.env.NODE_ENV && _o('<select multiple v-model="' + n.expression + '"> expects an Array value for its binding, but got ' + Object.prototype.toString.call(r).slice(8, -1), o));for (var i, s, l = 0, u = t.options.length; l < u; l++) {
            if (s = t.options[l], a) i = y(r, jn(s)) > -1, s.selected !== i && (s.selected = i);else if (g(jn(s), r)) return void (t.selectedIndex !== l && (t.selectedIndex = l));
          }a || (t.selectedIndex = -1);
        }function Dn(e, t) {
          for (var n = 0, o = t.length; n < o; n++) {
            if (g(jn(t[n]), e)) return !1;
          }return !0;
        }function jn(e) {
          return "_value" in e ? e._value : e.value;
        }function Tn(e) {
          e.target.composing = !0;
        }function Pn(e) {
          e.target.composing = !1, $n(e.target, "input");
        }function $n(e, t) {
          var n = document.createEvent("HTMLEvents");n.initEvent(t, !0, !0), e.dispatchEvent(n);
        }function An(e) {
          return !e.componentInstance || e.data && e.data.transition ? e : An(e.componentInstance._vnode);
        }function In(e) {
          var t = e && e.componentOptions;return t && t.Ctor.options.abstract ? In(oe(t.children)) : e;
        }function Vn(e) {
          var t = {},
              n = e.$options;for (var o in n.propsData) {
            t[o] = e[o];
          }var r = n._parentListeners;for (var a in r) {
            t[zn(a)] = r[a];
          }return t;
        }function Un(e, t) {
          return (/\d-keep-alive$/.test(t.tag) ? e("keep-alive") : null
          );
        }function Ln(e) {
          for (; e = e.parent;) {
            if (e.data.transition) return !0;
          }
        }function Yn(e, t) {
          return t.key === e.key && t.tag === e.tag;
        }function Jn(e) {
          e.elm._moveCb && e.elm._moveCb(), e.elm._enterCb && e.elm._enterCb();
        }function Rn(e) {
          e.data.newPos = e.elm.getBoundingClientRect();
        }function Bn(e) {
          var t = e.data.pos,
              n = e.data.newPos,
              o = t.left - n.left,
              r = t.top - n.top;if (o || r) {
            e.data.moved = !0;var a = e.elm.style;a.transform = a.WebkitTransform = "translate(" + o + "px," + r + "px)", a.transitionDuration = "0s";
          }
        }var Fn,
            Hn,
            Wn = a("slot,component", !0),
            qn = Object.prototype.hasOwnProperty,
            zn = u(function (e) {
          return e.replace(/-(\w)/g, function (e, t) {
            return t ? t.toUpperCase() : "";
          });
        }),
            Gn = u(function (e) {
          return e.charAt(0).toUpperCase() + e.slice(1);
        }),
            Kn = u(function (e) {
          return e.replace(/([^-])([A-Z])/g, "$1-$2").replace(/([^-])([A-Z])/g, "$1-$2").toLowerCase();
        }),
            Xn = Object.prototype.toString,
            Zn = "[object Object]",
            Qn = function Qn() {
          return !1;
        },
            eo = function eo(e) {
          return e;
        },
            to = { optionMergeStrategies: Object.create(null), silent: !1, productionTip: "production" !== e.env.NODE_ENV, devtools: "production" !== e.env.NODE_ENV, performance: !1, errorHandler: null, ignoredElements: [], keyCodes: Object.create(null), isReservedTag: Qn, isUnknownElement: Qn, getTagNamespace: h, parsePlatformTagName: eo, mustUseProp: Qn, _assetTypes: ["component", "directive", "filter"], _lifecycleHooks: ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed", "activated", "deactivated"], _maxUpdateCount: 100 },
            no = Object.freeze({}),
            oo = /[^\w.$]/,
            ro = "__proto__" in {},
            ao = "undefined" != typeof window,
            io = ao && window.navigator.userAgent.toLowerCase(),
            so = io && /msie|trident/.test(io),
            lo = io && io.indexOf("msie 9.0") > 0,
            uo = io && io.indexOf("edge/") > 0,
            co = io && io.indexOf("android") > 0,
            po = io && /iphone|ipad|ipod|ios/.test(io),
            fo = io && /chrome\/\d+/.test(io) && !uo,
            mo = function mo() {
          return void 0 === Fn && (Fn = !ao && void 0 !== n && "server" === n.process.env.VUE_ENV), Fn;
        },
            vo = ao && window.__VUE_DEVTOOLS_GLOBAL_HOOK__,
            ho = "undefined" != typeof Symbol && k(Symbol) && "undefined" != typeof Reflect && k(Reflect.ownKeys),
            go = function () {
          function e() {
            o = !1;var e = n.slice(0);n.length = 0;for (var t = 0; t < e.length; t++) {
              e[t]();
            }
          }var t,
              n = [],
              o = !1;if ("undefined" != typeof Promise && k(Promise)) {
            var r = Promise.resolve(),
                a = function a(e) {
              console.error(e);
            };t = function t() {
              r.then(e).catch(a), po && setTimeout(h);
            };
          } else if ("undefined" == typeof MutationObserver || !k(MutationObserver) && "[object MutationObserverConstructor]" !== MutationObserver.toString()) t = function t() {
            setTimeout(e, 0);
          };else {
            var i = 1,
                s = new MutationObserver(e),
                l = document.createTextNode(String(i));s.observe(l, { characterData: !0 }), t = function t() {
              i = (i + 1) % 2, l.data = String(i);
            };
          }return function (e, r) {
            var a;if (n.push(function () {
              e && e.call(r), a && a(r);
            }), o || (o = !0, t()), !e && "undefined" != typeof Promise) return new Promise(function (e) {
              a = e;
            });
          };
        }();Hn = "undefined" != typeof Set && k(Set) ? Set : function () {
          function e() {
            this.set = Object.create(null);
          }return e.prototype.has = function (e) {
            return !0 === this.set[e];
          }, e.prototype.add = function (e) {
            this.set[e] = !0;
          }, e.prototype.clear = function () {
            this.set = Object.create(null);
          }, e;
        }();var yo,
            _o = h,
            bo = h;if ("production" !== e.env.NODE_ENV) {
          var xo = "undefined" != typeof console,
              wo = function wo(e) {
            return e.replace(/(?:^|[-_])(\w)/g, function (e) {
              return e.toUpperCase();
            }).replace(/[-_]/g, "");
          };_o = function _o(e, t) {
            xo && !to.silent && console.error("[Vue warn]: " + e + " " + (t ? ko(yo(t)) : ""));
          }, bo = function bo(e, t) {
            xo && !to.silent && console.warn("[Vue tip]: " + e + " " + (t ? ko(yo(t)) : ""));
          }, yo = function yo(e, t) {
            if (e.$root === e) return "<Root>";var n = "string" == typeof e ? e : "function" == typeof e && e.options ? e.options.name : e._isVue ? e.$options.name || e.$options._componentTag : e.name,
                o = e._isVue && e.$options.__file;if (!n && o) {
              var r = o.match(/([^\/\\]+)\.vue$/);n = r && r[1];
            }return (n ? "<" + wo(n) + ">" : "<Anonymous>") + (o && !1 !== t ? " at " + o : "");
          };var ko = function ko(e) {
            return "<Anonymous>" === e && (e += ' - use the "name" option for better debugging messages.'), "\n(found in " + e + ")";
          };
        }var Co = 0,
            So = function So() {
          this.id = Co++, this.subs = [];
        };So.prototype.addSub = function (e) {
          this.subs.push(e);
        }, So.prototype.removeSub = function (e) {
          i(this.subs, e);
        }, So.prototype.depend = function () {
          So.target && So.target.addDep(this);
        }, So.prototype.notify = function () {
          for (var e = this.subs.slice(), t = 0, n = e.length; t < n; t++) {
            e[t].update();
          }
        }, So.target = null;var Mo = [],
            Oo = Array.prototype,
            No = Object.create(Oo);["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(function (e) {
          var t = Oo[e];x(No, e, function () {
            for (var n = arguments, o = arguments.length, r = new Array(o); o--;) {
              r[o] = n[o];
            }var a,
                i = t.apply(this, r),
                s = this.__ob__;switch (e) {case "push":case "unshift":
                a = r;break;case "splice":
                a = r.slice(2);}return a && s.observeArray(a), s.dep.notify(), i;
          });
        });var Eo = Object.getOwnPropertyNames(No),
            Do = { shouldConvert: !0, isSettingProps: !1 },
            jo = function jo(e) {
          if (this.value = e, this.dep = new So(), this.vmCount = 0, x(e, "__ob__", this), Array.isArray(e)) {
            (ro ? M : O)(e, No, Eo), this.observeArray(e);
          } else this.walk(e);
        };jo.prototype.walk = function (e) {
          for (var t = Object.keys(e), n = 0; n < t.length; n++) {
            E(e, t[n], e[t[n]]);
          }
        }, jo.prototype.observeArray = function (e) {
          for (var t = 0, n = e.length; t < n; t++) {
            N(e[t]);
          }
        };var To = to.optionMergeStrategies;"production" !== e.env.NODE_ENV && (To.el = To.propsData = function (e, t, n, o) {
          return n || _o('option "' + o + '" can only be used during instance creation with the `new` keyword.'), $o(e, t);
        }), To.data = function (t, n, o) {
          return o ? t || n ? function () {
            var e = "function" == typeof n ? n.call(o) : n,
                r = "function" == typeof t ? t.call(o) : void 0;return e ? P(e, r) : r;
          } : void 0 : n ? "function" != typeof n ? ("production" !== e.env.NODE_ENV && _o('The "data" option should be a function that returns a per-instance value in component definitions.', o), t) : t ? function () {
            return P(n.call(this), t.call(this));
          } : n : t;
        }, to._lifecycleHooks.forEach(function (e) {
          To[e] = $;
        }), to._assetTypes.forEach(function (e) {
          To[e + "s"] = A;
        }), To.watch = function (e, t) {
          if (!t) return Object.create(e || null);if (!e) return t;var n = {};p(n, e);for (var o in t) {
            var r = n[o],
                a = t[o];r && !Array.isArray(r) && (r = [r]), n[o] = r ? r.concat(a) : [a];
          }return n;
        }, To.props = To.methods = To.computed = function (e, t) {
          if (!t) return Object.create(e || null);if (!e) return t;var n = Object.create(null);return p(n, e), p(n, t), n;
        };var Po,
            $o = function $o(e, t) {
          return void 0 === t ? e : t;
        };if ("production" !== e.env.NODE_ENV) {
          var Ao = a("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,require"),
              Io = function Io(e, t) {
            _o('Property or method "' + t + '" is not defined on the instance but referenced during render. Make sure to declare reactive data properties in the data option.', e);
          },
              Vo = "undefined" != typeof Proxy && Proxy.toString().match(/native code/);if (Vo) {
            var Uo = a("stop,prevent,self,ctrl,shift,alt,meta");to.keyCodes = new Proxy(to.keyCodes, { set: function set(e, t, n) {
                return Uo(t) ? (_o("Avoid overwriting built-in modifier in config.keyCodes: ." + t), !1) : (e[t] = n, !0);
              } });
          }var Lo = { has: function has(e, t) {
              var n = t in e,
                  o = Ao(t) || "_" === t.charAt(0);return n || o || Io(e, t), n || !o;
            } },
              Yo = { get: function get(e, t) {
              return "string" != typeof t || t in e || Io(e, t), e[t];
            } };Po = function Po(e) {
            if (Vo) {
              var t = e.$options,
                  n = t.render && t.render._withStripped ? Yo : Lo;e._renderProxy = new Proxy(e, n);
            } else e._renderProxy = e;
          };
        }var Jo, Ro;if ("production" !== e.env.NODE_ENV) {
          var Bo = ao && window.performance;Bo && Bo.mark && Bo.measure && Bo.clearMarks && Bo.clearMeasures && (Jo = function Jo(e) {
            return Bo.mark(e);
          }, Ro = function Ro(e, t, n) {
            Bo.measure(e, t, n), Bo.clearMarks(t), Bo.clearMarks(n), Bo.clearMeasures(e);
          });
        }var Fo = function Fo(e, t, n, o, r, a, i) {
          this.tag = e, this.data = t, this.children = n, this.text = o, this.elm = r, this.ns = void 0, this.context = a, this.functionalContext = void 0, this.key = t && t.key, this.componentOptions = i, this.componentInstance = void 0, this.parent = void 0, this.raw = !1, this.isStatic = !1, this.isRootInsert = !0, this.isComment = !1, this.isCloned = !1, this.isOnce = !1;
        },
            Ho = { child: {} };Ho.child.get = function () {
          return this.componentInstance;
        }, Object.defineProperties(Fo.prototype, Ho);var Wo,
            qo = function qo() {
          var e = new Fo();return e.text = "", e.isComment = !0, e;
        },
            zo = u(function (e) {
          var t = "~" === e.charAt(0);e = t ? e.slice(1) : e;var n = "!" === e.charAt(0);return e = n ? e.slice(1) : e, { name: e, once: t, capture: n };
        }),
            Go = null,
            Ko = [],
            Xo = {},
            Zo = {},
            Qo = !1,
            er = !1,
            tr = 0,
            nr = 0,
            or = function or(t, n, o, r) {
          this.vm = t, t._watchers.push(this), r ? (this.deep = !!r.deep, this.user = !!r.user, this.lazy = !!r.lazy, this.sync = !!r.sync) : this.deep = this.user = this.lazy = this.sync = !1, this.cb = o, this.id = ++nr, this.active = !0, this.dirty = this.lazy, this.deps = [], this.newDeps = [], this.depIds = new Hn(), this.newDepIds = new Hn(), this.expression = "production" !== e.env.NODE_ENV ? n.toString() : "", "function" == typeof n ? this.getter = n : (this.getter = w(n), this.getter || (this.getter = function () {}, "production" !== e.env.NODE_ENV && _o('Failed watching path: "' + n + '" Watcher only accepts simple dot-delimited paths. For full control, use a function instead.', t))), this.value = this.lazy ? void 0 : this.get();
        };or.prototype.get = function () {
          C(this);var e,
              t = this.vm;if (this.user) try {
            e = this.getter.call(t, t);
          } catch (e) {
            q(e, t, 'getter for watcher "' + this.expression + '"');
          } else e = this.getter.call(t, t);return this.deep && xe(e), S(), this.cleanupDeps(), e;
        }, or.prototype.addDep = function (e) {
          var t = e.id;this.newDepIds.has(t) || (this.newDepIds.add(t), this.newDeps.push(e), this.depIds.has(t) || e.addSub(this));
        }, or.prototype.cleanupDeps = function () {
          for (var e = this, t = this.deps.length; t--;) {
            var n = e.deps[t];e.newDepIds.has(n.id) || n.removeSub(e);
          }var o = this.depIds;this.depIds = this.newDepIds, this.newDepIds = o, this.newDepIds.clear(), o = this.deps, this.deps = this.newDeps, this.newDeps = o, this.newDeps.length = 0;
        }, or.prototype.update = function () {
          this.lazy ? this.dirty = !0 : this.sync ? this.run() : be(this);
        }, or.prototype.run = function () {
          if (this.active) {
            var e = this.get();if (e !== this.value || f(e) || this.deep) {
              var t = this.value;if (this.value = e, this.user) try {
                this.cb.call(this.vm, e, t);
              } catch (e) {
                q(e, this.vm, 'callback for watcher "' + this.expression + '"');
              } else this.cb.call(this.vm, e, t);
            }
          }
        }, or.prototype.evaluate = function () {
          this.value = this.get(), this.dirty = !1;
        }, or.prototype.depend = function () {
          for (var e = this, t = this.deps.length; t--;) {
            e.deps[t].depend();
          }
        }, or.prototype.teardown = function () {
          var e = this;if (this.active) {
            this.vm._isBeingDestroyed || i(this.vm._watchers, this);for (var t = this.deps.length; t--;) {
              e.deps[t].removeSub(e);
            }this.active = !1;
          }
        };var rr = new Hn(),
            ar = { enumerable: !0, configurable: !0, get: h, set: h },
            ir = { key: 1, ref: 1, slot: 1 },
            sr = { lazy: !0 },
            lr = { init: function init(e, t, n, o) {
            if (!e.componentInstance || e.componentInstance._isDestroyed) {
              (e.componentInstance = Ie(e, Go, n, o)).$mount(t ? e.elm : void 0, t);
            } else if (e.data.keepAlive) {
              var r = e;lr.prepatch(r, r);
            }
          }, prepatch: function prepatch(e, t) {
            var n = t.componentOptions;fe(t.componentInstance = e.componentInstance, n.propsData, n.listeners, t, n.children);
          }, insert: function insert(e) {
            e.componentInstance._isMounted || (e.componentInstance._isMounted = !0, ge(e.componentInstance, "mounted")), e.data.keepAlive && ve(e.componentInstance, !0);
          }, destroy: function destroy(e) {
            e.componentInstance._isDestroyed || (e.data.keepAlive ? he(e.componentInstance, !0) : e.componentInstance.$destroy());
          } },
            ur = Object.keys(lr),
            cr = 1,
            dr = 2,
            pr = 0;!function (t) {
          t.prototype._init = function (t) {
            var n = this;n._uid = pr++;var o, r;"production" !== e.env.NODE_ENV && to.performance && Jo && (o = "vue-perf-init:" + n._uid, r = "vue-perf-end:" + n._uid, Jo(o)), n._isVue = !0, t && t._isComponent ? rt(n, t) : n.$options = L(at(n.constructor), t || {}, n), "production" !== e.env.NODE_ENV ? Po(n) : n._renderProxy = n, n._self = n, de(n), re(n), tt(n), ge(n, "beforeCreate"), ot(n), Ce(n), nt(n), ge(n, "created"), "production" !== e.env.NODE_ENV && to.performance && Jo && (n._name = yo(n, !1), Jo(r), Ro(n._name + " init", o, r)), n.$options.el && n.$mount(n.$options.el);
          };
        }(lt), function (t) {
          var n = {};n.get = function () {
            return this._data;
          };var o = {};o.get = function () {
            return this._props;
          }, "production" !== e.env.NODE_ENV && (n.set = function (e) {
            _o("Avoid replacing instance root $data. Use nested data properties instead.", this);
          }, o.set = function () {
            _o("$props is readonly.", this);
          }), Object.defineProperty(t.prototype, "$data", n), Object.defineProperty(t.prototype, "$props", o), t.prototype.$set = D, t.prototype.$delete = j, t.prototype.$watch = function (e, t, n) {
            var o = this;n = n || {}, n.user = !0;var r = new or(o, e, t, n);return n.immediate && t.call(o, r.value), function () {
              r.teardown();
            };
          };
        }(lt), function (t) {
          var n = /^hook:/;t.prototype.$on = function (e, t) {
            var o = this,
                r = this;if (Array.isArray(e)) for (var a = 0, i = e.length; a < i; a++) {
              o.$on(e[a], t);
            } else (r._events[e] || (r._events[e] = [])).push(t), n.test(e) && (r._hasHookEvent = !0);return r;
          }, t.prototype.$once = function (e, t) {
            function n() {
              o.$off(e, n), t.apply(o, arguments);
            }var o = this;return n.fn = t, o.$on(e, n), o;
          }, t.prototype.$off = function (e, t) {
            var n = this,
                o = this;if (!arguments.length) return o._events = Object.create(null), o;if (Array.isArray(e)) {
              for (var r = 0, a = e.length; r < a; r++) {
                n.$off(e[r], t);
              }return o;
            }var i = o._events[e];if (!i) return o;if (1 === arguments.length) return o._events[e] = null, o;for (var s, l = i.length; l--;) {
              if ((s = i[l]) === t || s.fn === t) {
                i.splice(l, 1);break;
              }
            }return o;
          }, t.prototype.$emit = function (t) {
            var n = this;if ("production" !== e.env.NODE_ENV) {
              var o = t.toLowerCase();o !== t && n._events[o] && bo('Event "' + o + '" is emitted in component ' + yo(n) + ' but the handler is registered for "' + t + '". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "' + Kn(t) + '" instead of "' + t + '".');
            }var r = n._events[t];if (r) {
              r = r.length > 1 ? d(r) : r;for (var a = d(arguments, 1), i = 0, s = r.length; i < s; i++) {
                r[i].apply(n, a);
              }
            }return n;
          };
        }(lt), function (e) {
          e.prototype._update = function (e, t) {
            var n = this;n._isMounted && ge(n, "beforeUpdate");var o = n.$el,
                r = n._vnode,
                a = Go;Go = n, n._vnode = e, n.$el = r ? n.__patch__(r, e) : n.__patch__(n.$el, e, t, !1, n.$options._parentElm, n.$options._refElm), Go = a, o && (o.__vue__ = null), n.$el && (n.$el.__vue__ = n), n.$vnode && n.$parent && n.$vnode === n.$parent._vnode && (n.$parent.$el = n.$el);
          }, e.prototype.$forceUpdate = function () {
            var e = this;e._watcher && e._watcher.update();
          }, e.prototype.$destroy = function () {
            var e = this;if (!e._isBeingDestroyed) {
              ge(e, "beforeDestroy"), e._isBeingDestroyed = !0;var t = e.$parent;!t || t._isBeingDestroyed || e.$options.abstract || i(t.$children, e), e._watcher && e._watcher.teardown();for (var n = e._watchers.length; n--;) {
                e._watchers[n].teardown();
              }e._data.__ob__ && e._data.__ob__.vmCount--, e._isDestroyed = !0, e.__patch__(e._vnode, null), ge(e, "destroyed"), e.$off(), e.$el && (e.$el.__vue__ = null), e.$options._parentElm = e.$options._refElm = null;
            }
          };
        }(lt), function (t) {
          t.prototype.$nextTick = function (e) {
            return go(e, this);
          }, t.prototype._render = function () {
            var t = this,
                n = t.$options,
                o = n.render,
                r = n.staticRenderFns,
                a = n._parentVnode;if (t._isMounted) for (var i in t.$slots) {
              t.$slots[i] = K(t.$slots[i]);
            }t.$scopedSlots = a && a.data.scopedSlots || no, r && !t._staticTrees && (t._staticTrees = []), t.$vnode = a;var s;try {
              s = o.call(t._renderProxy, t.$createElement);
            } catch (n) {
              q(n, t, "render function"), s = "production" !== e.env.NODE_ENV && t.$options.renderError ? t.$options.renderError.call(t._renderProxy, t.$createElement, n) : t._vnode;
            }return s instanceof Fo || ("production" !== e.env.NODE_ENV && Array.isArray(s) && _o("Multiple root nodes returned from render function. Render function should return a single root node.", t), s = qo()), s.parent = a, s;
          }, t.prototype._o = Ze, t.prototype._n = r, t.prototype._s = o, t.prototype._l = We, t.prototype._t = qe, t.prototype._q = g, t.prototype._i = y, t.prototype._m = Xe, t.prototype._f = ze, t.prototype._k = Ge, t.prototype._b = Ke, t.prototype._v = z, t.prototype._e = qo, t.prototype._u = ce;
        }(lt);var fr = [String, RegExp],
            mr = { name: "keep-alive", abstract: !0, props: { include: fr, exclude: fr }, created: function created() {
            this.cache = Object.create(null);
          }, destroyed: function destroyed() {
            var e = this;for (var t in e.cache) {
              yt(e.cache[t]);
            }
          }, watch: { include: function include(e) {
              gt(this.cache, function (t) {
                return ht(e, t);
              });
            }, exclude: function exclude(e) {
              gt(this.cache, function (t) {
                return !ht(e, t);
              });
            } }, render: function render() {
            var e = oe(this.$slots.default),
                t = e && e.componentOptions;if (t) {
              var n = vt(t);if (n && (this.include && !ht(this.include, n) || this.exclude && ht(this.exclude, n))) return e;var o = null == e.key ? t.Ctor.cid + (t.tag ? "::" + t.tag : "") : e.key;this.cache[o] ? e.componentInstance = this.cache[o].componentInstance : this.cache[o] = e, e.data.keepAlive = !0;
            }return e;
          } },
            vr = { KeepAlive: mr };!function (t) {
          var n = {};n.get = function () {
            return to;
          }, "production" !== e.env.NODE_ENV && (n.set = function () {
            _o("Do not replace the Vue.config object, set individual fields instead.");
          }), Object.defineProperty(t, "config", n), t.util = { warn: _o, extend: p, mergeOptions: L, defineReactive: E }, t.set = D, t.delete = j, t.nextTick = go, t.options = Object.create(null), to._assetTypes.forEach(function (e) {
            t.options[e + "s"] = Object.create(null);
          }), t.options._base = t, p(t.options.components, vr), ut(t), ct(t), dt(t), mt(t);
        }(lt), Object.defineProperty(lt.prototype, "$isServer", { get: mo }), lt.version = "2.2.6";var hr,
            gr,
            yr = a("input,textarea,option,select"),
            _r = function _r(e, t, n) {
          return "value" === n && yr(e) && "button" !== t || "selected" === n && "option" === e || "checked" === n && "input" === e || "muted" === n && "video" === e;
        },
            br = a("contenteditable,draggable,spellcheck"),
            xr = a("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),
            wr = "http://www.w3.org/1999/xlink",
            kr = function kr(e) {
          return ":" === e.charAt(5) && "xlink" === e.slice(0, 5);
        },
            Cr = function Cr(e) {
          return kr(e) ? e.slice(6, e.length) : "";
        },
            Sr = function Sr(e) {
          return null == e || !1 === e;
        },
            Mr = { svg: "http://www.w3.org/2000/svg", math: "http://www.w3.org/1998/Math/MathML" },
            Or = a("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template"),
            Nr = a("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view", !0),
            Er = function Er(e) {
          return Or(e) || Nr(e);
        },
            Dr = Object.create(null),
            jr = Object.freeze({ createElement: Ot, createElementNS: Nt, createTextNode: Et, createComment: Dt, insertBefore: jt, removeChild: Tt, appendChild: Pt, parentNode: $t, nextSibling: At, tagName: It, setTextContent: Vt, setAttribute: Ut }),
            Tr = { create: function create(e, t) {
            Lt(t);
          }, update: function update(e, t) {
            e.data.ref !== t.data.ref && (Lt(e, !0), Lt(t));
          }, destroy: function destroy(e) {
            Lt(e, !0);
          } },
            Pr = new Fo("", {}, []),
            $r = ["create", "activate", "update", "remove", "destroy"],
            Ar = { create: Wt, update: Wt, destroy: function destroy(e) {
            Wt(e, Pr);
          } },
            Ir = Object.create(null),
            Vr = [Tr, Ar],
            Ur = { create: Xt, update: Xt },
            Lr = { create: Qt, update: Qt },
            Yr = "__r",
            Jr = "__c",
            Rr = { create: on, update: on },
            Br = { create: rn, update: rn },
            Fr = u(function (e) {
          var t = {};return e.split(/;(?![^(]*\))/g).forEach(function (e) {
            if (e) {
              var n = e.split(/:(.+)/);n.length > 1 && (t[n[0].trim()] = n[1].trim());
            }
          }), t;
        }),
            Hr = /^--/,
            Wr = /\s*!important$/,
            qr = function qr(e, t, n) {
          Hr.test(t) ? e.style.setProperty(t, n) : Wr.test(n) ? e.style.setProperty(t, n.replace(Wr, ""), "important") : e.style[Gr(t)] = n;
        },
            zr = ["Webkit", "Moz", "ms"],
            Gr = u(function (e) {
          if (gr = gr || document.createElement("div"), "filter" !== (e = zn(e)) && e in gr.style) return e;for (var t = e.charAt(0).toUpperCase() + e.slice(1), n = 0; n < zr.length; n++) {
            var o = zr[n] + t;if (o in gr.style) return o;
          }
        }),
            Kr = { create: pn, update: pn },
            Xr = u(function (e) {
          return { enterClass: e + "-enter", enterToClass: e + "-enter-to", enterActiveClass: e + "-enter-active", leaveClass: e + "-leave", leaveToClass: e + "-leave-to", leaveActiveClass: e + "-leave-active" };
        }),
            Zr = ao && !lo,
            Qr = "transition",
            ea = "animation",
            ta = "transition",
            na = "transitionend",
            oa = "animation",
            ra = "animationend";Zr && (void 0 === window.ontransitionend && void 0 !== window.onwebkittransitionend && (ta = "WebkitTransition", na = "webkitTransitionEnd"), void 0 === window.onanimationend && void 0 !== window.onwebkitanimationend && (oa = "WebkitAnimation", ra = "webkitAnimationEnd"));var aa = ao && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout,
            ia = /\b(transform|all)(,|$)/,
            sa = ao ? { create: Nn, activate: Nn, remove: function remove(e, t) {
            e.data.show ? t() : Cn(e, t);
          } } : {},
            la = [Ur, Lr, Rr, Br, Kr, sa],
            ua = la.concat(Vr),
            ca = function (t) {
          function n(e) {
            return new Fo(E.tagName(e).toLowerCase(), {}, [], void 0, e);
          }function o(e, t) {
            function n() {
              0 == --n.listeners && r(e);
            }return n.listeners = t, n;
          }function r(e) {
            var t = E.parentNode(e);Jt(t) && E.removeChild(t, e);
          }function i(t, n, o, r, a) {
            if (t.isRootInsert = !a, !s(t, n, o, r)) {
              var i = t.data,
                  l = t.children,
                  u = t.tag;Jt(u) ? ("production" !== e.env.NODE_ENV && (i && i.pre && D++, D || t.ns || to.ignoredElements.length && to.ignoredElements.indexOf(u) > -1 || !to.isUnknownElement(u) || _o("Unknown custom element: <" + u + '> - did you register the component correctly? For recursive components, make sure to provide the "name" option.', t.context)), t.elm = t.ns ? E.createElementNS(t.ns, u) : E.createElement(u, t), v(t), p(t, l, n), Jt(i) && m(t, n), d(o, t.elm, r), "production" !== e.env.NODE_ENV && i && i.pre && D--) : Rt(t.isComment) ? (t.elm = E.createComment(t.text), d(o, t.elm, r)) : (t.elm = E.createTextNode(t.text), d(o, t.elm, r));
            }
          }function s(e, t, n, o) {
            var r = e.data;if (Jt(r)) {
              var a = Jt(e.componentInstance) && r.keepAlive;if (Jt(r = r.hook) && Jt(r = r.init) && r(e, !1, n, o), Jt(e.componentInstance)) return u(e, t), Rt(a) && c(e, t, n, o), !0;
            }
          }function u(e, t) {
            Jt(e.data.pendingInsert) && t.push.apply(t, e.data.pendingInsert), e.elm = e.componentInstance.$el, f(e) ? (m(e, t), v(e)) : (Lt(e), t.push(e));
          }function c(e, t, n, o) {
            for (var r, a = e; a.componentInstance;) {
              if (a = a.componentInstance._vnode, Jt(r = a.data) && Jt(r = r.transition)) {
                for (r = 0; r < O.activate.length; ++r) {
                  O.activate[r](Pr, a);
                }t.push(a);break;
              }
            }d(n, e.elm, o);
          }function d(e, t, n) {
            Jt(e) && (Jt(n) ? E.insertBefore(e, t, n) : E.appendChild(e, t));
          }function p(e, t, n) {
            if (Array.isArray(t)) for (var o = 0; o < t.length; ++o) {
              i(t[o], n, e.elm, null, !0);
            } else l(e.text) && E.appendChild(e.elm, E.createTextNode(e.text));
          }function f(e) {
            for (; e.componentInstance;) {
              e = e.componentInstance._vnode;
            }return Jt(e.tag);
          }function m(e, t) {
            for (var n = 0; n < O.create.length; ++n) {
              O.create[n](Pr, e);
            }S = e.data.hook, Jt(S) && (Jt(S.create) && S.create(Pr, e), Jt(S.insert) && t.push(e));
          }function v(e) {
            for (var t, n = e; n;) {
              Jt(t = n.context) && Jt(t = t.$options._scopeId) && E.setAttribute(e.elm, t, ""), n = n.parent;
            }Jt(t = Go) && t !== e.context && Jt(t = t.$options._scopeId) && E.setAttribute(e.elm, t, "");
          }function h(e, t, n, o, r, a) {
            for (; o <= r; ++o) {
              i(n[o], a, e, t);
            }
          }function g(e) {
            var t,
                n,
                o = e.data;if (Jt(o)) for (Jt(t = o.hook) && Jt(t = t.destroy) && t(e), t = 0; t < O.destroy.length; ++t) {
              O.destroy[t](e);
            }if (Jt(t = e.children)) for (n = 0; n < e.children.length; ++n) {
              g(e.children[n]);
            }
          }function y(e, t, n, o) {
            for (; n <= o; ++n) {
              var a = t[n];Jt(a) && (Jt(a.tag) ? (_(a), g(a)) : r(a.elm));
            }
          }function _(e, t) {
            if (Jt(t) || Jt(e.data)) {
              var n = O.remove.length + 1;for (Jt(t) ? t.listeners += n : t = o(e.elm, n), Jt(S = e.componentInstance) && Jt(S = S._vnode) && Jt(S.data) && _(S, t), S = 0; S < O.remove.length; ++S) {
                O.remove[S](e, t);
              }Jt(S = e.data.hook) && Jt(S = S.remove) ? S(e, t) : t();
            } else r(e.elm);
          }function b(t, n, o, r, a) {
            for (var s, l, u, c, d = 0, p = 0, f = n.length - 1, m = n[0], v = n[f], g = o.length - 1, _ = o[0], b = o[g], w = !a; d <= f && p <= g;) {
              Yt(m) ? m = n[++d] : Yt(v) ? v = n[--f] : Bt(m, _) ? (x(m, _, r), m = n[++d], _ = o[++p]) : Bt(v, b) ? (x(v, b, r), v = n[--f], b = o[--g]) : Bt(m, b) ? (x(m, b, r), w && E.insertBefore(t, m.elm, E.nextSibling(v.elm)), m = n[++d], b = o[--g]) : Bt(v, _) ? (x(v, _, r), w && E.insertBefore(t, v.elm, m.elm), v = n[--f], _ = o[++p]) : (Yt(s) && (s = Ht(n, d, f)), l = Jt(_.key) ? s[_.key] : null, Yt(l) ? (i(_, r, t, m.elm), _ = o[++p]) : (u = n[l], "production" === e.env.NODE_ENV || u || _o("It seems there are duplicate keys that is causing an update error. Make sure each v-for item has a unique key."), Bt(u, _) ? (x(u, _, r), n[l] = void 0, w && E.insertBefore(t, _.elm, m.elm), _ = o[++p]) : (i(_, r, t, m.elm), _ = o[++p])));
            }d > f ? (c = Yt(o[g + 1]) ? null : o[g + 1].elm, h(t, c, o, p, g, r)) : p > g && y(t, n, d, f);
          }function x(e, t, n, o) {
            if (e !== t) {
              if (Rt(t.isStatic) && Rt(e.isStatic) && t.key === e.key && (Rt(t.isCloned) || Rt(t.isOnce))) return t.elm = e.elm, void (t.componentInstance = e.componentInstance);var r,
                  a = t.data;Jt(a) && Jt(r = a.hook) && Jt(r = r.prepatch) && r(e, t);var i = t.elm = e.elm,
                  s = e.children,
                  l = t.children;if (Jt(a) && f(t)) {
                for (r = 0; r < O.update.length; ++r) {
                  O.update[r](e, t);
                }Jt(r = a.hook) && Jt(r = r.update) && r(e, t);
              }Yt(t.text) ? Jt(s) && Jt(l) ? s !== l && b(i, s, l, n, o) : Jt(l) ? (Jt(e.text) && E.setTextContent(i, ""), h(i, null, l, 0, l.length - 1, n)) : Jt(s) ? y(i, s, 0, s.length - 1) : Jt(e.text) && E.setTextContent(i, "") : e.text !== t.text && E.setTextContent(i, t.text), Jt(a) && Jt(r = a.hook) && Jt(r = r.postpatch) && r(e, t);
            }
          }function w(e, t, n) {
            if (Rt(n) && Jt(e.parent)) e.parent.data.pendingInsert = t;else for (var o = 0; o < t.length; ++o) {
              t[o].data.hook.insert(t[o]);
            }
          }function k(t, n, o) {
            if ("production" !== e.env.NODE_ENV && !C(t, n)) return !1;n.elm = t;var r = n.tag,
                a = n.data,
                i = n.children;if (Jt(a) && (Jt(S = a.hook) && Jt(S = S.init) && S(n, !0), Jt(S = n.componentInstance))) return u(n, o), !0;if (Jt(r)) {
              if (Jt(i)) if (t.hasChildNodes()) {
                for (var s = !0, l = t.firstChild, c = 0; c < i.length; c++) {
                  if (!l || !k(l, i[c], o)) {
                    s = !1;break;
                  }l = l.nextSibling;
                }if (!s || l) return "production" === e.env.NODE_ENV || "undefined" == typeof console || j || (j = !0, console.warn("Parent: ", t), console.warn("Mismatching childNodes vs. VNodes: ", t.childNodes, i)), !1;
              } else p(n, i, o);if (Jt(a)) for (var d in a) {
                if (!T(d)) {
                  m(n, o);break;
                }
              }
            } else t.data !== n.text && (t.data = n.text);return !0;
          }function C(e, t) {
            return Jt(t.tag) ? 0 === t.tag.indexOf("vue-component") || t.tag.toLowerCase() === (e.tagName && e.tagName.toLowerCase()) : e.nodeType === (t.isComment ? 8 : 3);
          }var S,
              M,
              O = {},
              N = t.modules,
              E = t.nodeOps;for (S = 0; S < $r.length; ++S) {
            for (O[$r[S]] = [], M = 0; M < N.length; ++M) {
              Jt(N[M][$r[S]]) && O[$r[S]].push(N[M][$r[S]]);
            }
          }var D = 0,
              j = !1,
              T = a("attrs,style,class,staticClass,staticStyle,key");return function (t, o, r, a, s, l) {
            if (Yt(o)) return void (Jt(t) && g(t));var u = !1,
                c = [];if (Yt(t)) u = !0, i(o, c, s, l);else {
              var d = Jt(t.nodeType);if (!d && Bt(t, o)) x(t, o, c, a);else {
                if (d) {
                  if (1 === t.nodeType && t.hasAttribute("server-rendered") && (t.removeAttribute("server-rendered"), r = !0), Rt(r)) {
                    if (k(t, o, c)) return w(o, c, !0), t;"production" !== e.env.NODE_ENV && _o("The client-side rendered virtual DOM tree is not matching server-rendered content. This is likely caused by incorrect HTML markup, for example nesting block-level elements inside <p>, or missing <tbody>. Bailing hydration and performing full client-side render.");
                  }t = n(t);
                }var p = t.elm,
                    m = E.parentNode(p);if (i(o, c, p._leaveCb ? null : m, E.nextSibling(p)), Jt(o.parent)) {
                  for (var v = o.parent; v;) {
                    v.elm = o.elm, v = v.parent;
                  }if (f(o)) for (var h = 0; h < O.create.length; ++h) {
                    O.create[h](Pr, o.parent);
                  }
                }Jt(m) ? y(m, [t], 0, 0) : Jt(t.tag) && g(t);
              }
            }return w(o, c, u), o.elm;
          };
        }({ nodeOps: jr, modules: ua });lo && document.addEventListener("selectionchange", function () {
          var e = document.activeElement;e && e.vmodel && $n(e, "input");
        });var da = { inserted: function inserted(e, t, n) {
            if ("select" === n.tag) {
              var o = function o() {
                En(e, t, n.context);
              };o(), (so || uo) && setTimeout(o, 0);
            } else "textarea" !== n.tag && "text" !== e.type && "password" !== e.type || (e._vModifiers = t.modifiers, t.modifiers.lazy || (co || (e.addEventListener("compositionstart", Tn), e.addEventListener("compositionend", Pn)), lo && (e.vmodel = !0)));
          }, componentUpdated: function componentUpdated(e, t, n) {
            if ("select" === n.tag) {
              En(e, t, n.context);(e.multiple ? t.value.some(function (t) {
                return Dn(t, e.options);
              }) : t.value !== t.oldValue && Dn(t.value, e.options)) && $n(e, "change");
            }
          } },
            pa = { bind: function bind(e, t, n) {
            var o = t.value;n = An(n);var r = n.data && n.data.transition,
                a = e.__vOriginalDisplay = "none" === e.style.display ? "" : e.style.display;o && r && !lo ? (n.data.show = !0, kn(n, function () {
              e.style.display = a;
            })) : e.style.display = o ? a : "none";
          }, update: function update(e, t, n) {
            var o = t.value;o !== t.oldValue && (n = An(n), n.data && n.data.transition && !lo ? (n.data.show = !0, o ? kn(n, function () {
              e.style.display = e.__vOriginalDisplay;
            }) : Cn(n, function () {
              e.style.display = "none";
            })) : e.style.display = o ? e.__vOriginalDisplay : "none");
          }, unbind: function unbind(e, t, n, o, r) {
            r || (e.style.display = e.__vOriginalDisplay);
          } },
            fa = { model: da, show: pa },
            ma = { name: String, appear: Boolean, css: Boolean, mode: String, type: String, enterClass: String, leaveClass: String, enterToClass: String, leaveToClass: String, enterActiveClass: String, leaveActiveClass: String, appearClass: String, appearActiveClass: String, appearToClass: String, duration: [Number, String, Object] },
            va = { name: "transition", props: ma, abstract: !0, render: function render(t) {
            var n = this,
                o = this.$slots.default;if (o && (o = o.filter(function (e) {
              return e.tag;
            }), o.length)) {
              "production" !== e.env.NODE_ENV && o.length > 1 && _o("<transition> can only be used on a single element. Use <transition-group> for lists.", this.$parent);var r = this.mode;"production" !== e.env.NODE_ENV && r && "in-out" !== r && "out-in" !== r && _o("invalid <transition> mode: " + r, this.$parent);var a = o[0];if (Ln(this.$vnode)) return a;var i = In(a);if (!i) return a;if (this._leaving) return Un(t, a);var s = "__transition-" + this._uid + "-";i.key = null == i.key ? s + i.tag : l(i.key) ? 0 === String(i.key).indexOf(s) ? i.key : s + i.key : i.key;var u = (i.data || (i.data = {})).transition = Vn(this),
                  c = this._vnode,
                  d = In(c);if (i.data.directives && i.data.directives.some(function (e) {
                return "show" === e.name;
              }) && (i.data.show = !0), d && d.data && !Yn(i, d)) {
                var f = d && (d.data.transition = p({}, u));if ("out-in" === r) return this._leaving = !0, Q(f, "afterLeave", function () {
                  n._leaving = !1, n.$forceUpdate();
                }), Un(t, a);if ("in-out" === r) {
                  var m,
                      v = function v() {
                    m();
                  };Q(u, "afterEnter", v), Q(u, "enterCancelled", v), Q(f, "delayLeave", function (e) {
                    m = e;
                  });
                }
              }return a;
            }
          } },
            ha = p({ tag: String, moveClass: String }, ma);delete ha.mode;var ga = { props: ha, render: function render(t) {
            for (var n = this.tag || this.$vnode.data.tag || "span", o = Object.create(null), r = this.prevChildren = this.children, a = this.$slots.default || [], i = this.children = [], s = Vn(this), l = 0; l < a.length; l++) {
              var u = a[l];if (u.tag) if (null != u.key && 0 !== String(u.key).indexOf("__vlist")) i.push(u), o[u.key] = u, (u.data || (u.data = {})).transition = s;else if ("production" !== e.env.NODE_ENV) {
                var c = u.componentOptions,
                    d = c ? c.Ctor.options.name || c.tag || "" : u.tag;_o("<transition-group> children must be keyed: <" + d + ">");
              }
            }if (r) {
              for (var p = [], f = [], m = 0; m < r.length; m++) {
                var v = r[m];v.data.transition = s, v.data.pos = v.elm.getBoundingClientRect(), o[v.key] ? p.push(v) : f.push(v);
              }this.kept = t(n, null, p), this.removed = f;
            }return t(n, null, i);
          }, beforeUpdate: function beforeUpdate() {
            this.__patch__(this._vnode, this.kept, !1, !0), this._vnode = this.kept;
          }, updated: function updated() {
            var e = this.prevChildren,
                t = this.moveClass || (this.name || "v") + "-move";if (e.length && this.hasMove(e[0].elm, t)) {
              e.forEach(Jn), e.forEach(Rn), e.forEach(Bn);var n = document.body;n.offsetHeight;e.forEach(function (e) {
                if (e.data.moved) {
                  var n = e.elm,
                      o = n.style;gn(n, t), o.transform = o.WebkitTransform = o.transitionDuration = "", n.addEventListener(na, n._moveCb = function e(o) {
                    o && !/transform$/.test(o.propertyName) || (n.removeEventListener(na, e), n._moveCb = null, yn(n, t));
                  });
                }
              });
            }
          }, methods: { hasMove: function hasMove(e, t) {
              if (!Zr) return !1;if (null != this._hasMove) return this._hasMove;var n = e.cloneNode();e._transitionClasses && e._transitionClasses.forEach(function (e) {
                mn(n, e);
              }), fn(n, t), n.style.display = "none", this.$el.appendChild(n);var o = bn(n);return this.$el.removeChild(n), this._hasMove = o.hasTransform;
            } } },
            ya = { Transition: va, TransitionGroup: ga };lt.config.mustUseProp = _r, lt.config.isReservedTag = Er, lt.config.getTagNamespace = Ct, lt.config.isUnknownElement = St, p(lt.options.directives, fa), p(lt.options.components, ya), lt.prototype.__patch__ = ao ? ca : h, lt.prototype.$mount = function (e, t) {
          return e = e && ao ? Mt(e) : void 0, pe(this, e, t);
        }, setTimeout(function () {
          to.devtools && (vo ? vo.emit("init", lt) : "production" !== e.env.NODE_ENV && fo && console[console.info ? "info" : "log"]("Download the Vue Devtools extension for a better development experience:\nhttps://github.com/vuejs/vue-devtools")), "production" !== e.env.NODE_ENV && !1 !== to.productionTip && ao && "undefined" != typeof console && console[console.info ? "info" : "log"]("You are running Vue in development mode.\nMake sure to turn on production mode when deploying for production.\nSee more tips at https://vuejs.org/guide/deployment.html");
        }, 0), t.exports = lt;
      }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, { _process: "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/process/browser.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/vueify/lib/insert-css.js": [function (e, t, n) {
      function o() {}var r = n.cache = {};n.insert = function (e) {
        if (r[e]) return o;r[e] = !0;var t = document.createElement("style");return t.setAttribute("type", "text/css"), "textContent" in t ? t.textContent = e : t.styleSheet.cssText = e, document.getElementsByTagName("head")[0].appendChild(t), function () {
          document.getElementsByTagName("head")[0].removeChild(t), r[e] = !1;
        };
      };
    }, {}], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/compat.js": [function (e, t, n) {
      "use strict";
      Object.defineProperty(n, "__esModule", { value: !0 });var o = function o() {
        return { length: 1, resolution: 1e3, params: [] };
      },
          r = function r(e) {
        if (!e) return o();var t = JSON.parse(e);return 20170418 === t.rev ? t : t.gui ? (delete t.gui, t) : (console.log("Loaded data is invalid or not compatible with this revision"), o());
      };n.default = r;
    }, {}], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/images.js": [function (e, t, n) {
      "use strict";
      Object.defineProperty(n, "__esModule", { value: !0 });var o = e("./interpolator"),
          r = function (e) {
        return e && e.__esModule ? e : { default: e };
      }(o),
          a = function a() {
        var e = {},
            t = document.createElement("canvas"),
            n = t.width = t.height = 128,
            o = t.getContext("2d");o.lineCap = "round", o.lineJoin = "round";var a = function a(e) {
          return o.save(), o.clearRect(0, 0, n, n), e(), o.restore(), t.toDataURL();
        };e.modes = [];for (var i = 0; i < r.default.MODES; i++) {
          !function (t) {
            e.modes[t] = a(function () {
              o.beginPath(), o.moveTo(n / 8, n / 8 * 7);for (var e = r.default.generate({ mode: t }), a = 1; a < e.length; a++) {
                o.lineTo(n / 8 + n / 4 * 3 * a / e.length, n / 8 * 7 - n / 4 * 3 * e[a]);
              }o.strokeStyle = "#2af", o.lineWidth = n / 12, o.stroke();
            });
          }(i);
        }return e.mods = [], e.mods[r.default.MOD_RESET] = a(function () {
          o.beginPath(), o.arc(n / 2, n / 2, n / 3, -Math.PI / 4, Math.PI / 4 * 5, !1), o.moveTo(n / 2, n / 2), o.lineTo(n / 2, n / 8), o.strokeStyle = "#2af", o.lineWidth = n / 12, o.stroke();
        }), e.mods[r.default.MOD_SIN] = a(function () {
          o.beginPath(), o.moveTo(n / 8, n / 2);for (var e = r.default.generate({ mode: r.default.MODE_LINEAR, start: .5, end: .5, mods: [!1, {}] }), t = 1; t < e.length; t++) {
            o.lineTo(n / 8 + n / 4 * 3 * t / e.length, n / 8 * 7 - n / 4 * 3 * e[t]);
          }o.strokeStyle = "#2af", o.lineWidth = n / 12, o.stroke();
        }), e.mods[r.default.MOD_NOISE] = a(function () {
          o.beginPath(), o.moveTo(n / 8, n / 2);for (var e = r.default.generate({ mode: r.default.MODE_LINEAR, start: .5, end: .5, mods: [!1, !1, {}] }), t = 1; t < e.length; t++) {
            o.lineTo(n / 8 + n / 4 * 3 * t / e.length, n / 8 * 7 - n / 4 * 3 * e[t]);
          }o.strokeStyle = "#2af", o.lineWidth = n / 12, o.stroke();
        }), e.mods[r.default.MOD_LOFI] = a(function () {
          o.beginPath(), o.moveTo(n / 8, n / 8 * 7);for (var e = r.default.generate({ mode: r.default.MODE_LINEAR, start: 0, end: 1, mods: [!1, !1, !1, {}] }), t = 1; t < e.length; t++) {
            o.lineTo(n / 8 + n / 4 * 3 * t / e.length, n / 8 * 7 - n / 4 * 3 * e[t]);
          }o.strokeStyle = "#2af", o.lineWidth = n / 12, o.stroke();
        }), e.save = a(function () {
          o.beginPath(), o.moveTo(n / 8, n / 8), o.lineTo(n / 8, n / 8 * 7), o.lineTo(n / 8 * 7, n / 8 * 7), o.lineTo(n / 8 * 7, n / 4), o.lineTo(n / 4 * 3, n / 8), o.closePath(), o.moveTo(n / 4, n / 2), o.lineTo(n / 4 * 3, n / 2), o.lineTo(n / 4 * 3, n / 6 * 5), o.lineTo(n / 4, n / 6 * 5), o.closePath(), o.moveTo(n / 4, n / 6), o.lineTo(n / 3 * 2, n / 6), o.lineTo(n / 3 * 2, n / 8 * 3), o.lineTo(n / 4, n / 8 * 3), o.closePath(), o.moveTo(n / 2, n / 5), o.lineTo(n / 8 * 5, n / 5), o.lineTo(n / 8 * 5, n / 3), o.lineTo(n / 2, n / 3), o.closePath(), o.fillStyle = "#2af", o.fill();
        }), e.undo = a(function () {
          o.beginPath(), o.moveTo(n / 8 * 7, n / 16 * 13), o.lineTo(n / 8 * 7, n / 8 * 3), o.lineTo(n / 4 * 3, n / 4), o.lineTo(n / 8 * 3, n / 4), o.lineTo(n / 8 * 3, n / 8), o.lineTo(n / 8, n / 8 * 3), o.lineTo(n / 8 * 3, n / 8 * 5), o.lineTo(n / 8 * 3, n / 2), o.lineTo(n / 8 * 5, n / 2), o.lineTo(n / 8 * 5, n / 16 * 13), o.closePath(), o.fillStyle = "#2af", o.fill();
        }), e.redo = a(function () {
          o.beginPath(), o.moveTo(n / 8, n / 16 * 13), o.lineTo(n / 8, n / 8 * 3), o.lineTo(n / 4, n / 4), o.lineTo(n / 8 * 5, n / 4), o.lineTo(n / 8 * 5, n / 8), o.lineTo(n / 8 * 7, n / 8 * 3), o.lineTo(n / 8 * 5, n / 8 * 5), o.lineTo(n / 8 * 5, n / 2), o.lineTo(n / 8 * 3, n / 2), o.lineTo(n / 8 * 3, n / 16 * 13), o.closePath(), o.fillStyle = "#2af", o.fill();
        }), e.beatsnap = a(function () {
          o.beginPath(), o.moveTo(n / 8, n / 4 * 3), o.lineTo(n / 8, n / 8 * 7), o.lineTo(n / 8 * 3, n / 8 * 7), o.lineTo(n / 8 * 3, n / 4 * 3), o.closePath(), o.moveTo(n / 8 * 5, n / 4 * 3), o.lineTo(n / 8 * 5, n / 8 * 7), o.lineTo(n / 8 * 7, n / 8 * 7), o.lineTo(n / 8 * 7, n / 4 * 3), o.closePath(), o.fillStyle = "#2af", o.fill(), o.beginPath(), o.moveTo(n / 8, n / 16 * 11), o.lineTo(n / 8, n / 2), o.arc(n / 2, n / 2, n / 8 * 3, Math.PI, 0, !1), o.lineTo(n / 8 * 7, n / 16 * 11), o.lineTo(n / 8 * 5, n / 16 * 11), o.lineTo(n / 8 * 5, n / 2), o.arc(n / 2, n / 2, n / 8, 0, Math.PI, !0), o.lineTo(n / 8 * 3, n / 16 * 11), o.closePath(), o.fillStyle = "#2af", o.fill();
        }), e.config = a(function () {
          o.beginPath();for (var e = n / 2, t = 0; t < 24; t++) {
            var r = 0 == (2 & t) ? .42 * n : .3 * n,
                a = Math.PI * (t - .5) / 12;0 === t ? o.moveTo(e + Math.cos(a) * r, e + Math.sin(a) * r) : o.lineTo(e + Math.cos(a) * r, e + Math.sin(a) * r);
          }o.closePath(), o.arc(e, e, .15 * n, 0, 2 * Math.PI, !0), o.fillStyle = "#2af", o.fill();
        }), e.save = a(function () {
          o.beginPath(), o.moveTo(n / 8, n / 8), o.lineTo(n / 8, n / 8 * 7), o.lineTo(n / 8 * 7, n / 8 * 7), o.lineTo(n / 8 * 7, n / 4), o.lineTo(n / 4 * 3, n / 8), o.closePath(), o.moveTo(n / 4, n / 2), o.lineTo(n / 4 * 3, n / 2), o.lineTo(n / 4 * 3, n / 6 * 5), o.lineTo(n / 4, n / 6 * 5), o.closePath(), o.moveTo(n / 4, n / 6), o.lineTo(n / 3 * 2, n / 6), o.lineTo(n / 3 * 2, n / 8 * 3), o.lineTo(n / 4, n / 8 * 3), o.closePath(), o.moveTo(n / 2, n / 5), o.lineTo(n / 8 * 5, n / 5), o.lineTo(n / 8 * 5, n / 3), o.lineTo(n / 2, n / 3), o.closePath(), o.fillStyle = "#2af", o.fill();
        }), e;
      };n.default = a;
    }, { "./interpolator": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/interpolator.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/interpolator.js": [function (e, t, n) {
      "use strict";
      Object.defineProperty(n, "__esModule", { value: !0 });var o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      },
          r = e("./noise"),
          a = function (e) {
        return e && e.__esModule ? e : { default: e };
      }(r),
          i = function i(e) {
        var t = {};for (var n in e) {
          t[n] = e[n];
        }return t;
      },
          s = function s(e, t) {
        return "number" == typeof e ? e : t;
      },
          l = {};l.MODE_HOLD = 0, l.MODE_LINEAR = 1, l.MODE_SMOOTH = 2, l.MODE_EXP = 3, l.MODE_SPRING = 4, l.MODE_GRAVITY = 5, l.MODES = 6, l.modeNames = ["Hold", "Linear", "Smoothstep", "Exp. Smooth", "Critically Damped Spring", "Gravity and Bounce"], l.MOD_RESET = 0, l.MOD_SIN = 1, l.MOD_NOISE = 2, l.MOD_LOFI = 3, l.MODS = 4, l.modNames = ["Reset", "Sine Curve", "Perlin Noise", "Lo-Fi"], l.generate = function (e) {
        for (var t = "object" === (void 0 === e ? "undefined" : o(e)) ? e : {}, n = s(t.mode, l.MODE_LINEAR), r = s(t.start, 0), u = s(t.end, 1), c = s(t.length, 32), d = s(t.deltaTime, .01), p = "object" === o(t.mods) ? i(t.mods) : [], f = 0; f < l.MODS; f++) {
          p[f] = !!p[f] && p[f];
        }var m = [r];if (n === l.MODE_HOLD) {
          for (var v = 1; v < c; v++) {
            m[v] = r;
          }m[c - 1] = u;
        } else if (n === l.MODE_LINEAR) for (var h = 1; h < c; h++) {
          var g = h / (c - 1);m[h] = r + (u - r) * g;
        } else if (n === l.MODE_SMOOTH) for (var y = 1; y < c; y++) {
          var _ = y / (c - 1),
              b = _ * _ * (3 - 2 * _);m[y] = r + (u - r) * b;
        } else if (n === l.MODE_EXP) for (var x = s(t.factor, 10), w = 1; w < c; w++) {
          var k = w * d,
              C = 1 - Math.exp(-x * k);m[w] = r + (u - r) * C;
        } else if (n === l.MODE_SPRING) for (var S = s(t.rate, 500), M = s(t.damp, 1), O = s(t.vel, 0), N = r, E = 1; E < c; E++) {
          O += (-S * (N - u) - 2 * O * Math.sqrt(S) * M) * d, N += O * d, m[E] = N;
        } else if (n === l.MODE_GRAVITY) for (var D = s(t.gravity, 70), j = s(t.bounce, .3), T = s(t.vel, 0), P = Math.sign(u - r), $ = r, A = 1; A < c; A++) {
          T += D * P * d, $ += T * d, P !== Math.sign(u - $) && ($ = u + (u - $) * j, T *= -j), m[A] = $;
        }if (p[l.MOD_SIN]) for (var I = s(p[l.MOD_SIN].freq, 2), V = s(p[l.MOD_SIN].amp, .5), U = s(p[l.MOD_SIN].phase, 0), L = 0; L < c; L++) {
          m[L] += Math.sin(U * Math.PI * 2) * V, U = (U + 1 / (c - 1) * I) % 1;
        }if (p[l.MOD_NOISE]) for (var Y = s(p[l.MOD_NOISE].amp, 1), J = (0, a.default)({ length: c, recursion: s(p[l.MOD_NOISE].recursion, 3), freq: s(p[l.MOD_NOISE].freq, 1) * c / (c - 1), reso: s(p[l.MOD_NOISE].reso, 4), seed: s(p[l.MOD_NOISE].seed, 175) }), R = 0; R < c; R++) {
          m[R] += J[R] * Y;
        }if (p[l.MOD_LOFI]) for (var B = (c - 1) / s(p[l.MOD_LOFI].freq, 4), F = 0; F < c; F++) {
          m[F] = m[Math.ceil(Math.floor(F / B) * B)];
        }return m;
      }, n.default = l;
    }, { "./noise": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/noise.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/main.js": [function (e, t, n) {
      "use strict";
      function o(e) {
        return e && e.__esModule ? e : { default: e };
      }var r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      },
          a = e("vue"),
          i = o(a),
          s = e("./vue-gui/main.vue"),
          l = o(s),
          u = e("./compat"),
          c = o(u),
          d = e("./param"),
          p = o(d),
          f = function f(e) {
        var t = {},
            n = "object" === (void 0 === e ? "undefined" : r(e)) ? e : {},
            o = (0, c.default)(n.data);t.time = 0, t.length = o.length, t.resolution = o.resolution, t.setLength = function (e) {
          if (!isNaN(e)) {
            for (var n in t.params) {
              for (var o = t.params[n], r = o.nodes.length - 1; 0 < r; r--) {
                e < o.nodes[r].time && o.nodes.splice(r, 1);
              }o.nodes[o.nodes.length - 1].time !== e && o.addNode(e, 0);
            }t.length = e;
          }
        }, t.params = {}, t.createParam = function (e) {
          var n = new p.default(t);return t.params[e] = n, n;
        }, t.getParamNames = function () {
          var e = [];for (var n in t.params) {
            e.push(n);
          }return e = e.sort();
        }, t.countParams = function () {
          var e = 0;for (var n in t.params) {
            e++;
          }return e;
        };for (var a in o.params) {
          t.createParam(a).load(o.params[a]);
        }if (t.setLength(t.length), t.seek = function (e) {
          var o = e - Math.floor(e / t.length) * t.length,
              r = "function" == typeof n.onseek ? n.onseek(o) : null;t.time = "number" == typeof r ? r % t.length : t.time;
        }, n.gui) {
          var s = document.createElement("div");n.gui.appendChild(s), t.vue = new i.default({ el: s, data: { automaton: t }, render: function render(e) {
              return e(l.default, { props: { automaton: this.automaton } });
            } }), t.guiParams = "object" === r(o.gui) ? o.gui : { snap: { enable: !1, bpm: 120, offset: 0 } };
        }return t.renderAll = function () {
          for (var e in t.params) {
            t.params[e].render();
          }
        }, t.update = function (e) {
          t.time = e % t.length;
        }, t.auto = function (e) {
          if (!t.params[e]) {
            t.createParam(e);
          }return t.params[e].getValue();
        }, t.bye = function () {
          t = null;
        }, t.save = function () {
          var e = { rev: 20170418, length: t.length, resolution: t.resolution };e.params = {};for (var n in t.params) {
            var o = t.params[n];e.params[n] = o.nodes;
          }return t.guiParams && (e.gui = t.guiParams), e;
        }, t;
      };t.exports = f;
    }, { "./compat": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/compat.js", "./param": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/param.js", "./vue-gui/main.vue": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/vue-gui/main.vue", vue: "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/vue/dist/vue.runtime.common.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/noise.js": [function (e, t, n) {
      "use strict";
      Object.defineProperty(n, "__esModule", { value: !0 });var o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      },
          r = e("./xorshift"),
          a = function (e) {
        return e && e.__esModule ? e : { default: e };
      }(r),
          i = function i(e, t, n) {
        return e + n * n * (3 - 2 * n) * (t - e);
      },
          s = function s(e) {
        var t = "object" === (void 0 === e ? "undefined" : o(e)) ? e : { length: 32, recursion: 6, freq: 1, reso: 4, seed: 0 };t.length = parseInt(t.length), t.recursion = parseInt(t.recursion), t.reso = parseInt(t.reso), t.seed = parseInt(t.seed);var n = [0];(0, a.default)(t.seed);for (var r = 1; r < t.reso; r++) {
          n[r] = 2 * (0, a.default)() - 1;
        }n.push(n[0]);for (var s = [], l = 0; l < t.length; l++) {
          s[l] = 0;for (var u = l / t.length, c = 0; c < t.recursion; c++) {
            var d = u * t.freq * t.reso * Math.pow(2, c) % t.reso,
                p = Math.floor(d),
                f = d % 1,
                m = Math.pow(2, -c - 1);s[l] += m * i(n[p], n[p + 1], f);
          }
        }return s;
      };n.default = s;
    }, { "./xorshift": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/xorshift.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/param.js": [function (e, t, n) {
      "use strict";
      function o(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
      }Object.defineProperty(n, "__esModule", { value: !0 });var r = function () {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var o = t[n];o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
          }
        }return function (t, n, o) {
          return n && e(t.prototype, n), o && e(t, o), t;
        };
      }(),
          a = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
        return typeof e === "undefined" ? "undefined" : _typeof(e);
      } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
      },
          i = e("./interpolator"),
          s = function (e) {
        return e && e.__esModule ? e : { default: e };
      }(i),
          l = function l(e) {
        if ("object" !== (void 0 === e ? "undefined" : a(e))) return e;var t = {};for (var n in e) {
          t[n] = e[n];
        }return t;
      },
          u = function () {
        function e(t) {
          o(this, e);var n = this;n.automaton = t, n.values = [];for (var r = Math.ceil(n.automaton.resolution * n.automaton.length) + 1, a = 0; a < r; a++) {
            n.values[a] = 0;
          }n.nodes = [], n.addNode(0, 0), n.addNode(n.automaton.length, 1), n.render();
        }return r(e, [{ key: "load", value: function value(e) {
            var t = this;t.nodes = e, t.render();
          } }, { key: "sortNodes", value: function value() {
            this.nodes.sort(function (e, t) {
              return e.time - t.time;
            });
          } }, { key: "render", value: function value(e) {
            var t = this;t.values = [];for (var n = 1; n < t.nodes.length; n++) {
              var o = t.nodes[n - 1].time,
                  r = Math.floor(o * t.automaton.resolution),
                  a = t.nodes[n].time,
                  i = Math.floor(a * t.automaton.resolution),
                  l = 1 === n || t.nodes[n].mods[s.default.MOD_RESET],
                  u = t.nodes[n].mods[s.default.MOD_RESET] ? t.nodes[n].mods[s.default.MOD_RESET].velocity : 0,
                  c = 1 / t.automaton.resolution,
                  d = { mode: t.nodes[n].mode, start: l ? t.nodes[n - 1].value : t.values[r], end: t.nodes[n].value, deltaTime: c, length: i - r + 1, vel: !l && 2 < t.values.length ? (t.values[t.values.length - 1] - t.values[t.values.length - 2]) / c : u, mods: t.nodes[n].mods };for (var p in t.nodes[n].params) {
                d[p] = t.nodes[n].params[p];
              }var f = s.default.generate(d);t.values.pop(), t.values = t.values.concat(f);
            }
          } }, { key: "addNode", value: function value(e, t) {
            var n = this,
                o = n.nodes.filter(function (t) {
              return e < t.time;
            })[0];if (!o) {
              o = { mode: s.default.MODE_LINEAR, params: {}, mods: [] };for (var r = 0; r < s.default.MODS; r++) {
                o.mods[r] = !1;
              }
            }var a = { time: e, value: t, mode: o.mode, params: l(o.params), mods: o.mods.map(function (e) {
                return l(e);
              }) };return n.nodes.push(a), n.sortNodes(), n.render(), a;
          } }, { key: "setTime", value: function value(e, t) {
            var n = this;if (!(e < 0 || n.nodes.length <= e)) return 0 !== e && n.nodes.length - 1 !== e && (n.nodes[e].time = Math.min(Math.max(t, n.nodes[e - 1].time + 1 / n.automaton.resolution), n.nodes[e + 1].time - 1 / n.automaton.resolution), n.render()), n.nodes[e].time;
          } }, { key: "setValue", value: function value(e, t) {
            var n = this;if (!(e < 0 || n.nodes.length <= e)) return n.nodes[e].value = t, n.render(), n.nodes[e].value;
          } }, { key: "setMode", value: function value(e, t) {
            var n = this;if (!(e < 1 || n.nodes.length <= e)) {
              var o = n.nodes[e];o.mode = t, t === s.default.MODE_HOLD ? o.params = {} : t === s.default.MODE_LINEAR ? o.params = {} : t === s.default.MODE_SMOOTH ? o.params = {} : t === s.default.MODE_EXP ? o.params = { factor: 10 } : t === s.default.MODE_SPRING ? o.params = { rate: 500, damp: 1 } : t === s.default.MODE_GRAVITY && (o.params = { gravity: 70, bounce: .3 }), n.render();
            }
          } }, { key: "setParam", value: function value(e, t, n) {
            var o = this;e < 0 || o.nodes.length <= e || (o.nodes[e].params[t] = n, o.render());
          } }, { key: "setParams", value: function value(e, t) {
            var n = this;if (!(e < 0 || n.nodes.length <= e)) {
              for (var o in t) {
                n.nodes[e].params[o] = t[o];
              }n.render();
            }
          } }, { key: "activeModParams", value: function value(e, t, n) {
            var o = this;if (!(e < 0 || o.nodes.length <= e || t < 0 || s.default.MODS <= t)) if (n) {
              o.nodes[e].mods[t] = {};var r = void 0;t === s.default.MOD_RESET ? r = { velocity: 0 } : t === s.default.MOD_SIN ? r = { freq: 5, amp: .1, phase: 0 } : t === s.default.MOD_NOISE ? r = { freq: 1, amp: .2, reso: 8, recursion: 4, seed: 1 } : t === s.default.MOD_LOFI && (r = { freq: 10 }), o.setModParams(e, t, r);
            } else o.nodes[e].mods[t] = !1, o.render();
          } }, { key: "toggleMod", value: function value(e, t) {
            var n = this;e < 0 || n.nodes.length <= e || t < 0 || s.default.MODS <= t || n.activeModParams(e, t, !n.nodes[e].mods[t]);
          } }, { key: "setModParam", value: function value(e, t, n, o) {
            var r = this;e < 0 || r.nodes.length <= e || t < 0 || s.default.MODS <= t || (r.nodes[e].mods[t][n] = o, r.render());
          } }, { key: "setModParams", value: function value(e, t, n) {
            var o = this;if (!(e < 0 || o.nodes.length <= e || t < 0 || s.default.MODS <= t)) {
              for (var r in n) {
                o.nodes[e].mods[t][r] = n[r];
              }o.render();
            }
          } }, { key: "removeNode", value: function value(e) {
            var t = this;if (!(e < 1 || t.nodes.length - 1 <= e)) {
              var n = t.nodes.splice(e, 1);return t.render(), n;
            }
          } }, { key: "getValue", value: function value(e) {
            var t = this,
                n = "number" == typeof e ? e : t.automaton.time;if (n <= 0) return t.values[0];if (t.automaton.length <= n) return t.values[t.values.length - 1];var o = n * t.automaton.resolution,
                r = Math.floor(o),
                a = o % 1,
                i = t.values[r];return i + (t.values[r + 1] - i) * a;
          } }]), e;
      }();n.default = u;
    }, { "./interpolator": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/interpolator.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/vue-gui/main.vue": [function (e, t, n) {
      var o = e("vueify/lib/insert-css").insert('/* line 764, stdin */\n.parent {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background: #222;\n  color: #ddd;\n  user-select: none;\n  font: 300 14px "Helvetica Neue", sans-serif; }\n  /* line 779, stdin */\n  .parent .header {\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 30px;\n    background: #444; }\n    /* line 788, stdin */\n    .parent .header .headerTitle {\n      position: absolute;\n      left: 6px;\n      top: 0;\n      height: 30px;\n      font: 500 24px "Century Gothic", sans-serif;\n      letter-spacing: 8px;\n      color: #ddd; }\n    /* line 800, stdin */\n    .parent .header .headerButtonContainer {\n      position: absolute;\n      right: 4px; }\n      /* line 804, stdin */\n      .parent .header .headerButtonContainer .headerButton {\n        width: 24px;\n        height: 24px;\n        margin: 3px;\n        cursor: pointer; }\n  /* line 815, stdin */\n  .parent .paramList {\n    position: absolute;\n    left: 0;\n    top: 30px;\n    width: 120px;\n    height: calc( 100% - 30px);\n    background: #111;\n    overflow: hidden; }\n    /* line 826, stdin */\n    .parent .paramList .paramListInside {\n      position: absolute;\n      top: 0px;\n      width: 100%; }\n      /* line 831, stdin */\n      .parent .paramList .paramListInside .param {\n        margin: 2px;\n        padding: 2px 8px;\n        width: calc( 100% - 4px - 16px);\n        height: 20px;\n        font-size: 14px;\n        background: #333;\n        cursor: pointer; }\n        /* line 843, stdin */\n        .parent .paramList .paramListInside .param.selected {\n          background: #555;\n          color: #fff; }\n  /* line 852, stdin */\n  .parent .modMenu {\n    position: absolute;\n    right: 0;\n    top: 30px;\n    width: 200px;\n    height: calc( 100% - 30px);\n    background: #333;\n    overflow: hidden; }\n    /* line 863, stdin */\n    .parent .modMenu .modMenuInside {\n      position: absolute;\n      top: 0px;\n      width: calc( 100% - 20px);\n      padding: 20px 10px; }\n    /* line 870, stdin */\n    .parent .modMenu .sep {\n      width: calc( 100% - 10px);\n      height: 1px;\n      margin: 10px 5px 15px 5px;\n      background: #666; }\n    /* line 878, stdin */\n    .parent .modMenu .modeButtonContainer {\n      width: calc( 100% - 10px);\n      margin: -5px 5px 0 5px; }\n      /* line 882, stdin */\n      .parent .modMenu .modeButtonContainer .modeButton {\n        width: 30px;\n        height: 30px;\n        margin: 2px;\n        cursor: pointer; }\n        /* line 889, stdin */\n        .parent .modMenu .modeButtonContainer .modeButton:not(.active) {\n          filter: grayscale(90%); }\n    /* line 895, stdin */\n    .parent .modMenu .modsContainer {\n      width: 100%;\n      position: relative;\n      margin: 0 0 20px 0;\n      min-height: 24px; }\n      /* line 901, stdin */\n      .parent .modMenu .modsContainer .modIcon {\n        position: absolute;\n        left: 10px;\n        width: 24px;\n        height: 24px;\n        cursor: pointer; }\n        /* line 909, stdin */\n        .parent .modMenu .modsContainer .modIcon:not(.active) {\n          filter: grayscale(90%); }\n      /* line 914, stdin */\n      .parent .modMenu .modsContainer .modParams {\n        position: relative;\n        left: 30px;\n        width: calc( 100% - 30px); }\n  /* line 922, stdin */\n  .parent .timelineContainer {\n    position: absolute;\n    left: 120px;\n    top: 30px;\n    width: calc( 100% - 320px);\n    height: calc( 100% - 30px);\n    overflow: hidden; }\n    /* line 931, stdin */\n    .parent .timelineContainer .timeline {\n      position: absolute;\n      width: 100%;\n      height: 100%;\n      background: #222; }\n      /* line 938, stdin */\n      .parent .timelineContainer .timeline .timelineSvg {\n        stroke-linecap: round;\n        stroke-linejoin: round;\n        font: 400 10px "Helvetica Neue", sans-serif; }\n        /* line 944, stdin */\n        .parent .timelineContainer .timeline .timelineSvg .timelineGrid {\n          stroke: #fff;\n          stroke-width: 1; }\n        /* line 949, stdin */\n        .parent .timelineContainer .timeline .timelineSvg .timelineGridText {\n          fill: #fff; }\n        /* line 953, stdin */\n        .parent .timelineContainer .timeline .timelineSvg .timelineSnap {\n          stroke: #2af;\n          stroke-width: 1;\n          opacity: 0.6; }\n        /* line 959, stdin */\n        .parent .timelineContainer .timeline .timelineSvg .timelineSnapText {\n          fill: #2af;\n          opacity: 0.6; }\n        /* line 964, stdin */\n        .parent .timelineContainer .timeline .timelineSvg .timelinePath {\n          fill: none;\n          stroke: #fff;\n          stroke-width: 2; }\n        /* line 970, stdin */\n        .parent .timelineContainer .timeline .timelineSvg .timelineNode {\n          fill: #000;\n          stroke: #2af;\n          stroke-width: 2;\n          cursor: pointer; }\n          /* line 977, stdin */\n          .parent .timelineContainer .timeline .timelineSvg .timelineNode.active {\n            fill: #2af; }\n        /* line 982, stdin */\n        .parent .timelineContainer .timeline .timelineSvg .timelineTimeLine {\n          stroke: #2af;\n          stroke-width: 2; }\n        /* line 987, stdin */\n        .parent .timelineContainer .timeline .timelineSvg .timelineValueLine {\n          stroke: #2af;\n          stroke-width: 1; }\n        /* line 992, stdin */\n        .parent .timelineContainer .timeline .timelineSvg .timelineTimeText {\n          fill: #2af; }\n        /* line 996, stdin */\n        .parent .timelineContainer .timeline .timelineSvg .timelineValueText {\n          fill: #2af; }\n        /* line 1000, stdin */\n        .parent .timelineContainer .timeline .timelineSvg .timelineTimePoint {\n          fill: #2af; }\n  /* line 1007, stdin */\n  .parent .dialogContainer {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    text-align: center; }\n    /* line 1014, stdin */\n    .parent .dialogContainer .dialogBackground {\n      position: absolute;\n      width: 100%;\n      height: 100%;\n      background: #000;\n      opacity: 0.5; }\n    /* line 1023, stdin */\n    .parent .dialogContainer .dialog {\n      display: inline-block;\n      position: relative;\n      top: 50px;\n      padding: 10px;\n      background: #333; }\n      /* line 1031, stdin */\n      .parent .dialogContainer .dialog .dialogContent {\n        display: inline-block;\n        width: calc( 100% - 60px); }\n        /* line 1035, stdin */\n        .parent .dialogContainer .dialog .dialogContent * {\n          margin-bottom: 4px; }\n        /* line 1039, stdin */\n        .parent .dialogContainer .dialog .dialogContent .dialogName {\n          display: inline-block;\n          width: 70px;\n          padding-left: 10px;\n          text-align: left; }\n        /* line 1047, stdin */\n        .parent .dialogContainer .dialog .dialogContent .dialogCheck {\n          width: 50px; }\n        /* line 1051, stdin */\n        .parent .dialogContainer .dialog .dialogContent .dialogBox {\n          width: 50px;\n          padding: 2px;\n          background: #666;\n          color: #fff;\n          border: none;\n          text-align: center; }\n          /* line 1061, stdin */\n          .parent .dialogContainer .dialog .dialogContent .dialogBox.save {\n            width: 120px; }\n      /* line 1067, stdin */\n      .parent .dialogContainer .dialog .dialogButtonContainer {\n        width: 100%;\n        height: 24px;\n        margin-top: 5px;\n        text-align: center; }\n        /* line 1074, stdin */\n        .parent .dialogContainer .dialog .dialogButtonContainer .dialogButton {\n          display: inline-block;\n          width: 60px;\n          height: 16px;\n          padding: 4px;\n          margin: 0 5px;\n          text-align: center;\n          background: #555;\n          cursor: pointer; }');!function () {
        "use strict";
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }Object.defineProperty(n, "__esModule", { value: !0 });var o = e("babel-runtime/core-js/math/log10"),
            r = t(o),
            a = e("babel-runtime/core-js/json/stringify"),
            i = t(a),
            s = e("../vue-parambox/main.vue"),
            l = t(s),
            u = e("../images"),
            c = t(u),
            d = e("../interpolator"),
            p = t(d),
            f = function f(e, t) {
          var n = parseFloat(e),
              o = t || 0;return isNaN(n) ? o : n;
        },
            m = (0, c.default)(),
            v = new Array(p.default.MODES).fill(0).map(function (e, t) {
          return { name: p.default.modeNames[t], src: m.modes[t] };
        }),
            h = new Array(p.default.MODS).fill(0).map(function (e, t) {
          return { name: p.default.modNames[t], src: m.mods[t] };
        });n.default = { mounted: function mounted() {
            var e = this;this.$nextTick(function () {
              e.onResize();
            }), window.addEventListener("resize", this.onResize);
          }, beforeDestroy: function beforeDestroy() {
            window.removeEventListener("resize", this.onResize);
          }, props: ["automaton"], data: function data() {
            var e = this;return { headerButtons: [{ name: "Undo", src: m.undo, func: function func() {
                  alert("🙀 Not implemented 🙀");
                } }, { name: "Redo", src: m.redo, func: function func() {
                  alert("🙀 Not implemented 🙀");
                } }, { name: "Snap", src: m.beatsnap, func: function func() {
                  e.dialog = { show: !0, mode: "snap" }, e.$nextTick(function () {
                    e.$refs.dialogSnapEnable.checked = e.automaton.guiParams.snap.enable, e.$refs.dialogSnapBPM.value = e.automaton.guiParams.snap.bpm, e.$refs.dialogSnapOffset.value = e.automaton.guiParams.snap.offset;
                  });
                } }, { name: "Config", src: m.config, func: function func() {
                  e.dialog = { show: !0, mode: "config" }, e.$nextTick(function () {
                    e.$refs.dialogConfigLength.value = e.automaton.length, e.$refs.dialogConfigResolution.value = e.automaton.resolution;
                  });
                } }, { name: "Save", src: m.save, func: function func() {
                  e.dialog = { show: !0, mode: "save" }, e.$nextTick(function () {
                    e.$refs.dialogSaveJSON.value = (0, i.default)(e.automaton.save()), e.$refs.dialogSaveJSON.select();
                  });
                } }], modeButtons: v, mods: h, selectedParam: "", selectedNode: 0, paramListWheelPos: 0, modMenuWheelPos: 0, tlTimeMin: 0, tlTimeMax: 5, tlValueMin: 0, tlValueMax: 100, tlWidth: 0, tlHeight: 0, tlPath: "", snapLines: [], grid: { x: [], y: [] }, dialog: { show: !1, mode: "none" }, dialogConfigLengthShortened: !1 };
          }, methods: { log: function log(e) {
              console.log(e);
            }, updatePath: function updatePath() {
              if (this.validSelectedParam()) {
                for (var e = this.automaton.params[this.selectedParam], t = "", n = 0; n <= this.tlWidth; n++) {
                  var o = this.x2t(n),
                      r = this.v2y(e.getValue(o));t += (0 === n ? "M" : "L") + " " + n + " " + r + " ";
                }this.tlPath = t;
              }
            }, onResize: function onResize() {
              var e = this.$refs.timelineContainer;this.tlWidth = e.clientWidth, this.tlHeight = e.clientHeight, this.tlViewBox = "0 0 " + this.tlWidth + " " + this.tlHeight, this.tlTimeMax = Math.min(this.tlTimeMax, this.automaton.length), this.updateGrid(), this.updatePath();
            }, wheelParamList: function wheelParamList(e) {
              this.paramListWheelPos = Math.max(Math.min(this.paramListWheelPos + e.deltaY, this.$refs.paramListInside.clientHeight - (this.$refs.parent.clientHeight - this.$refs.header.clientHeight)), 0);
            }, wheelModMenu: function wheelModMenu(e) {
              this.modMenuWheelPos = Math.max(Math.min(this.modMenuWheelPos + e.deltaY, this.$refs.modMenuInside.clientHeight - (this.$refs.parent.clientHeight - this.$refs.header.clientHeight)), 0);
            }, wheelTimeline: function wheelTimeline(e) {
              if (e.shiftKey) {
                var t = this.x2t(e.offsetX);this.tlTimeMin -= .005 * (t - this.tlTimeMin) * e.deltaY, this.tlTimeMax += .005 * (this.tlTimeMax - t) * e.deltaY, this.tlTimeMin < 0 && (this.tlTimeMax = Math.max(this.tlTimeMax - this.tlTimeMin, this.tlTimeMax)), this.automaton.length < this.tlTimeMax && (this.tlTimeMin += this.automaton.length - this.tlTimeMax), this.tlTimeMin < 0 && (this.tlTimeMin = 0), this.automaton.length < this.tlTimeMax && (this.tlTimeMax = this.automaton.length);
              } else if (e.altKey) {
                var n = this.y2v(e.offsetY);this.tlValueMin -= .005 * (n - this.tlValueMin) * e.deltaY, this.tlValueMax += .005 * (this.tlValueMax - n) * e.deltaY;
              } else {
                var o = this.tlTimeMax - this.tlTimeMin,
                    r = this.tlValueMax - this.tlValueMin;this.tlTimeMin += e.deltaX * o / this.tlWidth, this.tlTimeMax += e.deltaX * o / this.tlWidth, this.tlTimeMin < 0 && (this.tlTimeMax += 0 - this.tlTimeMin), this.automaton.length < this.tlTimeMax && (this.tlTimeMin += this.automaton.length - this.tlTimeMax), this.tlTimeMin < 0 && (this.tlTimeMin = 0), this.automaton.length < this.tlTimeMax && (this.tlTimeMax = this.automaton.length), this.tlValueMin -= e.deltaY * r / this.tlHeight, this.tlValueMax -= e.deltaY * r / this.tlHeight;
              }this.updateGrid(), this.updatePath();
            }, validSelectedParam: function validSelectedParam() {
              return this.automaton.params && this.automaton.params[this.selectedParam];
            }, nodeInRange: function nodeInRange(e) {
              return this.validSelectedParam() && 0 <= e && e < this.automaton.params[this.selectedParam].nodes.length;
            }, validSelectedNode: function validSelectedNode() {
              return this.validSelectedParam() && this.nodeInRange(this.selectedNode);
            }, updateGrid: function updateGrid() {
              this.grid = { x: [], y: [] };for (var e = this.tlTimeMax - this.tlTimeMin, t = (0, r.default)(e), n = Math.pow(10, Math.floor(t) - 1), o = t - Math.floor(t), a = Math.floor(this.tlTimeMin / n), i = a * n, s = a - 10 * Math.floor(a / 10), l = a - 100 * Math.floor(a / 100), u = i; u < this.tlTimeMax; u += n) {
                var c = 0 === l ? .4 : 0 === s ? .4 - .3 * o : .1 - .3 * o;0 < c && this.grid.x.push({ val: u, pos: this.t2x(u), op: c }), s = (s + 1) % 10, l = (l + 1) % 100;
              }for (var d = this.tlValueMax - this.tlValueMin, p = (0, r.default)(d), f = Math.pow(10, Math.floor(p) - 1), m = p - Math.floor(p), v = Math.floor(this.tlValueMin / f), h = v * f, g = v - 10 * Math.floor(v / 10), y = v - 100 * Math.floor(v / 100), _ = h; _ < this.tlValueMax; _ += f) {
                var b = 0 === y ? .4 : 0 === g ? .4 - .3 * m : .1 - .3 * m;0 < b && this.grid.y.push({ val: _, pos: this.v2y(_), op: b }), g = (g + 1) % 10, y = (y + 1) % 100;
              }var x = 60 / this.automaton.guiParams.snap.bpm,
                  w = this.tlTimeMax - this.tlTimeMin,
                  k = Math.log(w / x) / Math.log(4),
                  C = Math.pow(4, Math.floor(k - .5)) * x,
                  S = Math.floor(this.tlTimeMin / C) * C + this.automaton.guiParams.snap.offset % C;this.snapLines = [];for (var M = S; M < this.tlTimeMax; M += C) {
                this.snapLines.push({ beat: (M - this.automaton.guiParams.snap.offset) / x, time: M, pos: this.t2x(M) });
              }
            }, x2t: function x2t(e) {
              return e / this.tlWidth * (this.tlTimeMax - this.tlTimeMin) + this.tlTimeMin;
            }, t2x: function t2x(e) {
              return (e - this.tlTimeMin) / (this.tlTimeMax - this.tlTimeMin) * this.tlWidth;
            }, y2v: function y2v(e) {
              return (1 - e / this.tlHeight) * (this.tlValueMax - this.tlValueMin) + this.tlValueMin;
            }, v2y: function v2y(e) {
              return (1 - (e - this.tlValueMin) / (this.tlValueMax - this.tlValueMin)) * this.tlHeight;
            }, addNode: function addNode(e) {
              if (this.validSelectedParam()) {
                var t = this.x2t(e.offsetX),
                    n = this.y2v(e.offsetY),
                    o = this.automaton.params[this.selectedParam],
                    r = o.addNode(t, n);this.selectNode(o.nodes.indexOf(r)), this.updatePath();
              }
            }, selectNode: function selectNode(e) {
              this.validSelectedParam() && this.nodeInRange(e) && (this.selectedNode = e);
            }, grabNode: function grabNode(e, t) {
              var n = this;if (this.selectNode(e), this.validSelectedParam() && this.validSelectedNode()) {
                var o = this.t2x(this.automaton.params[this.selectedParam].nodes[this.selectedNode].time),
                    r = this.v2y(this.automaton.params[this.selectedParam].nodes[this.selectedNode].value),
                    a = t.clientX,
                    i = t.clientY,
                    s = function s(e) {
                  e.preventDefault();var t = e.clientX - a + o,
                      s = e.clientY - i + r,
                      l = n.x2t(t),
                      u = n.y2v(s);if (n.automaton.guiParams.snap.enable && !e.altKey) for (var c = 0; c < n.snapLines.length; c++) {
                    var d = n.snapLines[c];if (Math.abs(d.pos - t) < 10) l = d.time;else if (t < d.pos) break;
                  }e.ctrlKey || e.metaKey || n.automaton.params[n.selectedParam].setTime(n.selectedNode, l), e.shiftKey || n.automaton.params[n.selectedParam].setValue(n.selectedNode, u), n.updatePath();
                },
                    l = function e(t) {
                  t.preventDefault(), window.removeEventListener("mousemove", s), window.removeEventListener("mouseup", e);
                };window.addEventListener("mousemove", s), window.addEventListener("mouseup", l);
              }
            }, removeNode: function removeNode(e) {
              if (this.validSelectedParam()) {
                this.automaton.params[this.selectedParam].removeNode(e), this.updatePath();
              }
            }, dialogSnapOK: function dialogSnapOK() {
              this.automaton.guiParams.snap.enable = this.$refs.dialogSnapEnable.checked, this.automaton.guiParams.snap.bpm = this.$refs.dialogSnapBPM.value, this.automaton.guiParams.snap.offset = this.$refs.dialogSnapOffset.value, this.updateGrid(), this.dialog.show = !1;
            }, dialogConfigLengthTest: function dialogConfigLengthTest() {
              if (!this.$refs.dialogConfigLength) return !1;var e = f(this.$refs.dialogConfigLength.value, this.automaton.length);this.dialogConfigLengthShortened = e < this.automaton.length;
            }, dialogConfigOK: function dialogConfigOK() {
              var e = f(this.$refs.dialogConfigLength.value, this.automaton.length);this.automaton.setLength(e), this.tlTimeMax = Math.min(this.tlTimeMax, this.automaton.length), console.log(this.automaton.length), this.automaton.resolution = f(this.$refs.dialogConfigResolution.value, this.automaton.resolution), this.automaton.renderAll(), this.updatePath(), this.dialog.show = !1;
            } }, components: { parambox: l.default } };
      }(), t.exports.__esModule && (t.exports = t.exports.default);var r = "function" == typeof t.exports ? t.exports.options : t.exports;r.functional && console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions."), r.render = function () {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { ref: "parent", staticClass: "parent" }, [n("div", { ref: "header", staticClass: "header" }, [n("div", { staticClass: "headerTitle" }, [e._v("AUTOMATON")]), e._v(" "), n("div", { staticClass: "headerButtonContainer" }, e._l(e.headerButtons, function (e) {
          return n("img", { staticClass: "headerButton", attrs: { src: e.src }, on: { click: e.func } });
        }))]), e._v(" "), n("div", { staticClass: "paramList" }, [n("div", { ref: "paramListInside", staticClass: "paramListInside", style: { top: -e.paramListWheelPos + "px" }, on: { wheel: function wheel(t) {
              t.preventDefault(), e.wheelParamList(t);
            } } }, e._l(e.automaton.params, function (t, o) {
          return n("div", { staticClass: "param", class: { selected: o === e.selectedParam }, on: { click: function click(t) {
                e.selectedParam = o, e.selectedNode = 0, e.onResize(), e.updatePath();
              } } }, [e._v(e._s(o))]);
        }))]), e._v(" "), n("div", { staticClass: "modMenu" }, [e.validSelectedParam() ? n("div", { ref: "modMenuInside", staticClass: "modMenuInside", style: { top: -e.modMenuWheelPos + "px" }, on: { wheel: function wheel(t) {
              t.preventDefault(), e.wheelModMenu(t);
            } } }, [n("parambox", { attrs: { type: "number", name: "time", value: e.automaton.params[e.selectedParam].nodes[e.selectedNode].time.toFixed(3) }, on: { changed: function changed(t) {
              e.automaton.params[e.selectedParam].setTime(e.selectedNode, t), e.updatePath();
            } } }), e._v(" "), n("parambox", { attrs: { type: "number", name: "value", value: e.automaton.params[e.selectedParam].nodes[e.selectedNode].value.toFixed(3) }, on: { changed: function changed(t) {
              e.automaton.params[e.selectedParam].setValue(e.selectedNode, t), e.updatePath();
            } } }), e._v(" "), 0 !== e.selectedNode ? [n("div", { staticClass: "sep" }), e._v(" "), n("div", { staticClass: "modeButtonContainer" }, e._l(e.modeButtons, function (t, o) {
          return n("img", { staticClass: "modeButton", class: { active: o === e.automaton.params[e.selectedParam].nodes[e.selectedNode].mode }, attrs: { src: t.src }, on: { click: function click(t) {
                e.automaton.params[e.selectedParam].setMode(e.selectedNode, o), e.updatePath();
              } } });
        })), e._v(" "), e._l(e.automaton.params[e.selectedParam].nodes[e.selectedNode].params, function (t, o) {
          return n("parambox", { attrs: { type: "number", name: o, value: e.automaton.params[e.selectedParam].nodes[e.selectedNode].params[o].toFixed(3) }, on: { changed: function changed(t) {
                e.automaton.params[e.selectedParam].setParam(e.selectedNode, o, t), e.updatePath();
              } } });
        }), e._v(" "), n("div", { staticClass: "sep" }), e._v(" "), e._l(e.mods, function (t, o) {
          return n("div", { staticClass: "modsContainer" }, [n("img", { staticClass: "modIcon", class: { active: e.automaton.params[e.selectedParam].nodes[e.selectedNode].mods[o] }, attrs: { src: t.src }, on: { click: function click(t) {
                e.automaton.params[e.selectedParam].toggleMod(e.selectedNode, o), e.updatePath();
              } } }), e._v(" "), e.automaton.params[e.selectedParam].nodes[e.selectedNode].mods[o] ? n("div", { staticClass: "modParams" }, e._l(e.automaton.params[e.selectedParam].nodes[e.selectedNode].mods[o], function (t, r) {
            return n("parambox", { attrs: { type: "number", name: r, value: e.automaton.params[e.selectedParam].nodes[e.selectedNode].mods[o][r].toFixed(3) }, on: { changed: function changed(t) {
                  e.automaton.params[e.selectedParam].setModParam(e.selectedNode, o, r, t), e.updatePath();
                } } });
          })) : e._e()]);
        })] : e._e()], 2) : e._e()]), e._v(" "), n("div", { ref: "timelineContainer", staticClass: "timelineContainer" }, [e.validSelectedParam() ? n("div", { staticClass: "timeline", on: { wheel: function wheel(t) {
              t.preventDefault(), e.wheelTimeline(t);
            } } }, [n("svg", { staticClass: "timelineSvg", attrs: { width: e.tlWidth, height: e.tlHeight, viewBox: e.tlViewBox }, on: { dblclick: e.addNode } }, [e._l(e.grid.x, function (t) {
          return n("line", { staticClass: "timelineGrid", attrs: { x1: t.pos, y1: 0, x2: t.pos, y2: e.tlHeight, opacity: t.op } });
        }), e._v(" "), e._l(e.grid.y, function (t) {
          return n("line", { staticClass: "timelineGrid", attrs: { x1: 0, y1: t.pos, x2: e.tlWidth, y2: t.pos, opacity: t.op } });
        }), e._v(" "), e._l(e.grid.x, function (t) {
          return n("text", { staticClass: "timelineGridText", attrs: { x: t.pos + 2, y: e.tlHeight - 2, opacity: t.op } }, [e._v(e._s(t.val.toFixed(3)))]);
        }), e._v(" "), e._l(e.grid.y, function (t) {
          return n("text", { staticClass: "timelineGridText", attrs: { x: "2", y: t.pos - 2, opacity: t.op } }, [e._v(e._s(t.val.toFixed(3)))]);
        }), e._v(" "), e.automaton.guiParams.snap.enable ? [e._l(e.snapLines, function (t) {
          return n("line", { staticClass: "timelineSnap", attrs: { x1: t.pos, y1: 0, x2: t.pos, y2: e.tlHeight } });
        }), e._v(" "), e._l(e.snapLines, function (t) {
          return n("text", { staticClass: "timelineSnapText", attrs: { x: t.pos + 2, y: "10" } }, [e._v(e._s(t.beat.toFixed(2)))]);
        })] : e._e(), e._v(" "), n("path", { staticClass: "timelinePath", attrs: { d: e.tlPath } }), e._v(" "), e._l(e.automaton.params[e.selectedParam].nodes, function (t, o) {
          return e.t2x(e.tlTimeMin) <= e.t2x(t.time) + 10 && e.t2x(t.time) - 10 <= e.t2x(e.tlTimeMax) ? n("g", { staticClass: "timelineNode", class: { active: o === e.selectedNode }, on: { dblclick: function dblclick(t) {
                t.stopPropagation(), e.removeNode(o);
              }, mousedown: function mousedown(t) {
                e.grabNode(o, t);
              } } }, [e.tlValueMin <= t.value && t.value <= e.tlValueMax ? n("circle", { attrs: { transform: "translate(" + e.t2x(t.time) + "," + e.v2y(t.value) + ")", r: "5" } }) : t.value < e.tlValueMin ? n("path", { attrs: { transform: "translate(" + e.t2x(t.time) + "," + e.tlHeight + ")", d: "M 0 -4 L 5 -12 L -5 -12 z" } }) : n("path", { attrs: { transform: "translate(" + e.t2x(t.time) + ",0)", d: "M 0 4 L -5 12 L 5 12 z" } })]) : e._e();
        }), e._v(" "), n("line", { staticClass: "timelineTimeLine", attrs: { x1: e.t2x(e.automaton.time), y1: 0, x2: e.t2x(e.automaton.time), y2: e.tlHeight } }), e._v(" "), n("line", { staticClass: "timelineValueLine", attrs: { x1: 0, y1: e.v2y(e.automaton.params[e.selectedParam].getValue(e.automaton.time)), x2: e.tlWidth, y2: e.v2y(e.automaton.params[e.selectedParam].getValue(e.automaton.time)) } }), e._v(" "), n("text", { staticClass: "timelineTimeText", attrs: { x: e.t2x(e.automaton.time) + 2, y: e.tlHeight - 2 } }, [e._v(e._s(e.automaton.time.toFixed(3)))]), e._v(" "), n("text", { staticClass: "timelineValueText", attrs: { x: "2", y: e.v2y(e.automaton.params[e.selectedParam].getValue(e.automaton.time)) - 2 } }, [e._v(e._s(e.automaton.params[e.selectedParam].getValue(e.automaton.time).toFixed(3)))]), e._v(" "), n("circle", { staticClass: "timelineTimePoint", attrs: { r: "5", cx: e.t2x(e.automaton.time), cy: e.v2y(e.automaton.params[e.selectedParam].getValue(e.automaton.time)) } })], 2)]) : e._e()]), e._v(" "), e.dialog.show ? n("div", { staticClass: "dialogContainer" }, [n("div", { staticClass: "dialogBackground", on: { click: function click(t) {
              e.dialog.show = !1;
            } } }), e._v(" "), n("div", { staticClass: "dialog" }, ["snap" === e.dialog.mode ? [n("div", { staticClass: "dialogContent", style: { width: "200px" } }, [n("div", [n("div", { staticClass: "dialogName" }, [e._v("Beatsnap")]), e._v(" "), n("input", { ref: "dialogSnapEnable", staticClass: "dialogCheck", attrs: { type: "checkbox" } })]), e._v(" "), n("div", [n("div", { staticClass: "dialogName" }, [e._v("BPM")]), e._v(" "), n("input", { ref: "dialogSnapBPM", staticClass: "dialogBox" })]), e._v(" "), n("div", [n("div", { staticClass: "dialogName" }, [e._v("Offset")]), e._v(" "), n("input", { ref: "dialogSnapOffset", staticClass: "dialogBox" })])]), e._v(" "), n("div", { staticClass: "dialogButtonContainer" }, [n("div", { staticClass: "dialogButton", on: { click: e.dialogSnapOK } }, [e._v("OK")]), e._v(" "), n("div", { staticClass: "dialogButton", on: { click: function click(t) {
              e.dialog.show = !1;
            } } }, [e._v("Cancel")])])] : "config" === e.dialog.mode ? [n("div", { staticClass: "dialogContent", style: { width: "200px" } }, [n("div", [n("div", { staticClass: "dialogName" }, [e._v("Length")]), e._v(" "), n("input", { ref: "dialogConfigLength", staticClass: "dialogBox", on: { input: e.dialogConfigLengthTest } })]), e._v(" "), n("div", [n("div", { staticClass: "dialogName" }, [e._v("Resolution")]), e._v(" "), n("input", { ref: "dialogConfigResolution", staticClass: "dialogBox" })]), e._v(" "), e.dialogConfigLengthShortened ? n("div", { style: { fontSize: "9px", color: "#f66" } }, [e._v("\n            Shortening length may cause loss of node data\n          ")]) : e._e()]), e._v(" "), n("div", { staticClass: "dialogButtonContainer" }, [n("div", { staticClass: "dialogButton", on: { click: e.dialogConfigOK } }, [e._v("OK")]), e._v(" "), n("div", { staticClass: "dialogButton", on: { click: function click(t) {
              e.dialog.show = !1;
            } } }, [e._v("Cancel")])])] : "save" === e.dialog.mode ? [n("div", { staticClass: "dialogContent", style: { width: "200px" } }, [n("div", [e._v("\n            Copy the JSON below:\n          ")]), e._v(" "), n("div", [n("input", { ref: "dialogSaveJSON", staticClass: "dialogBox save", attrs: { readonly: "true" } })])]), e._v(" "), n("div", { staticClass: "dialogButtonContainer" }, [n("div", { staticClass: "dialogButton", on: { click: function click(t) {
              e.dialog.show = !1;
            } } }, [e._v("OK")])])] : e._e()], 2)]) : e._e()]);
      }, r.staticRenderFns = [], t.hot && function () {
        var n = e("vue-hot-reload-api");n.install(e("vue"), !0), n.compatible && (t.hot.accept(), t.hot.dispose(o), t.hot.data ? n.reload("data-v-3e83ac13", r) : n.createRecord("data-v-3e83ac13", r));
      }();
    }, { "../images": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/images.js", "../interpolator": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/interpolator.js", "../vue-parambox/main.vue": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/vue-parambox/main.vue", "babel-runtime/core-js/json/stringify": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/babel-runtime/core-js/json/stringify.js", "babel-runtime/core-js/math/log10": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/babel-runtime/core-js/math/log10.js", vue: "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/vue/dist/vue.runtime.common.js", "vue-hot-reload-api": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/vue-hot-reload-api/index.js", "vueify/lib/insert-css": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/vueify/lib/insert-css.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/vue-parambox/main.vue": [function (e, t, n) {
      var o = e("vueify/lib/insert-css").insert("/* line 108, stdin */\n.parambox {\n  position: relative;\n  width: 100%;\n  height: 16px;\n  margin: 0 0 5px 0;\n  font-size: 14px; }\n  /* line 116, stdin */\n  .parambox .name {\n    position: absolute;\n    left: 20px;\n    top: 0;\n    height: 100%; }\n  /* line 123, stdin */\n  .parambox .number {\n    position: absolute;\n    right: 10px;\n    top: 0;\n    width: 60px;\n    height: 100%; }\n    /* line 130, stdin */\n    .parambox .number .valueText {\n      position: absolute;\n      left: 0;\n      top: 0;\n      width: 100%;\n      height: 100%;\n      text-align: center;\n      cursor: pointer; }\n    /* line 142, stdin */\n    .parambox .number .valueInput {\n      position: absolute;\n      left: 0;\n      top: 0;\n      width: 100%;\n      height: 100%;\n      border: none;\n      padding: 0;\n      text-align: center;\n      background: #666;\n      color: #fff; }\n  /* line 158, stdin */\n  .parambox .boolean {\n    position: absolute;\n    right: 34px;\n    bottom: 0;\n    width: 12px;\n    height: 12px;\n    background: #ddd; }\n    /* line 167, stdin */\n    .parambox .boolean .booleanCheck {\n      position: absolute;\n      left: 2px;\n      top: 2px;\n      width: calc( 100% - 4px);\n      height: calc( 100% - 4px);\n      background: #2af; }");!function () {
        "use strict";
        function t(e) {
          return e && e.__esModule ? e : { default: e };
        }Object.defineProperty(n, "__esModule", { value: !0 });var o = e("babel-runtime/core-js/math/log10"),
            r = t(o),
            a = e("babel-runtime/core-js/math/sign"),
            i = t(a);n.default = { props: ["width", "name", "value", "type"], data: function data() {
            return { input: !1, lastClick: 0 };
          }, methods: { md: function md(e) {
              var t = this,
                  n = Date.now();if (n - this.lastClick < 500 && (this.input = !0, this.$refs.valueInput.value = this.value, setTimeout(function () {
                t.$refs.valueInput.focus(), t.$refs.valueInput.select();
              }, 10)), this.lastClick = n, "number" === this.type) {
                var o = e.clientY,
                    a = function a(e) {
                  e.preventDefault();var n = Number(t.value),
                      a = e.clientY,
                      s = o - a;if (o = a, e.shiftKey) {
                    for (var l = Math.abs(s), u = (0, i.default)(s), c = 0; c < l; c++) {
                      var d = Math.abs(n),
                          p = (0, i.default)(n + 1e-4 * u),
                          f = Math.floor((0, r.default)(d + 1e-4 * u * p)) - 1 - (e.altKey ? 1 : 0),
                          m = Math.max(.001, Math.pow(10, f)) * u;n = parseFloat((n + m).toFixed(3));
                    }t.$emit("changed", Number(n));
                  } else {
                    var v = e.altKey ? .001 : .01;t.$emit("changed", Number((n + s * v).toFixed(3)));
                  }
                },
                    s = function e(t) {
                  t.preventDefault(), window.removeEventListener("mousemove", a), window.removeEventListener("mouseup", e);
                };window.addEventListener("mousemove", a), window.addEventListener("mouseup", s);
              }
            }, enter: function enter(e) {
              this.$emit("changed", Number(this.$refs.valueInput.value)), this.input = !1;
            }, blur: function blur(e) {
              this.input = !1;
            }, bToggle: function bToggle(e) {
              this.$emit("changed", !this.value);
            } } };
      }(), t.exports.__esModule && (t.exports = t.exports.default);var r = "function" == typeof t.exports ? t.exports.options : t.exports;r.functional && console.error("[vueify] functional components are not supported and should be defined in plain js files using render functions."), r.render = function () {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "parambox", style: { width: e.width } }, [n("div", { staticClass: "name" }, [e._v(e._s(e.name))]), e._v(" "), "number" === e.type ? n("div", { staticClass: "number" }, [n("div", { staticClass: "valueText", on: { mousedown: e.md } }, [e._v(e._s(e.value))]), e._v(" "), n("input", { directives: [{ name: "show", rawName: "v-show", value: e.input, expression: "input" }], ref: "valueInput", staticClass: "valueInput", on: { keydown: function keydown(t) {
              if (!("button" in t) && e._k(t.keyCode, "enter", 13)) return null;e.enter(t);
            }, blur: e.blur } })]) : "boolean" === e.type ? n("div", { staticClass: "boolean", on: { click: e.bToggle } }, [n("div", { directives: [{ name: "show", rawName: "v-show", value: e.value, expression: "value" }], staticClass: "booleanCheck" })]) : e._e()]);
      }, r.staticRenderFns = [], t.hot && function () {
        var n = e("vue-hot-reload-api");n.install(e("vue"), !0), n.compatible && (t.hot.accept(), t.hot.dispose(o), t.hot.data ? n.reload("data-v-62312774", r) : n.createRecord("data-v-62312774", r));
      }();
    }, { "babel-runtime/core-js/math/log10": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/babel-runtime/core-js/math/log10.js", "babel-runtime/core-js/math/sign": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/babel-runtime/core-js/math/sign.js", vue: "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/vue/dist/vue.runtime.common.js", "vue-hot-reload-api": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/vue-hot-reload-api/index.js", "vueify/lib/insert-css": "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/node_modules/vueify/lib/insert-css.js" }], "/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/xorshift.js": [function (e, t, n) {
      "use strict";
      Object.defineProperty(n, "__esModule", { value: !0 });var o = void 0,
          r = function r(e) {
        return o = e || o || 1, o ^= o << 13, o ^= o >>> 17, (o ^= o << 5) / Math.pow(2, 32) + .5;
      };n.default = r;
    }, {}] }, {}, ["/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/main.js"])("/Users/Yutaka/Dropbox/pro/JavaScript/automaton/src/main.js");
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/catmath.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// にゃーん

var CatMath = {};

/**
 * adds a two vec
 * @param {array} a - vec
 * @param {array} b - vec
 */
CatMath.vecAdd = function (a, b) {
  return a.map(function (e, i) {
    return e + b[i];
  });
};

/**
 * substracts a vec from an another vec
 * @param {array} a - vec
 * @param {array} b - vec
 */
CatMath.vecSub = function (a, b) {
  return a.map(function (e, i) {
    return e - b[i];
  });
};

/**
 * returns a cross of two vec3s
 * @param {array} a - vec3
 * @param {array} b - vec3
 */
CatMath.vec3Cross = function (a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
};

/**
 * scales a vec by scalar
 * @param {number} s - scalar
 * @param {array} v - vec
 */
CatMath.vecScale = function (s, v) {
  return v.map(function (e) {
    return e * s;
  });
};

/**
 * returns length of a vec
 * @param {array} v - vec
 */
CatMath.vecLength = function (v) {
  return Math.sqrt(v.reduce(function (p, c) {
    return p + c * c;
  }, 0.0));
};

/**
 * normalizes a vec
 * @param {array} v - vec
 */
CatMath.vecNormalize = function (v) {
  return CatMath.vecScale(1.0 / CatMath.vecLength(v), v);
};

/**
 * applies two mat4s
 * @param {array} a - mat4
 * @param {array} b - mat4
 */
CatMath.mat4Apply = function (a, b) {
  return [a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3], a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3], a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3], a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3], a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7], a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7], a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7], a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7], a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11], a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11], a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11], a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11], a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15], a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15], a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15], a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]];
};

/**
 * transpose a mat4
 * @param {array} m - mat4
 */
CatMath.mat4Transpose = function (m) {
  return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
};

/**
 * returns an indentity mat4
 */
CatMath.mat4Identity = function () {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

CatMath.mat4Translate = function (v) {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v[0], v[1], v[2], 1];
};

CatMath.mat4Scale = function (v) {
  return [v[0], 0, 0, 0, 0, v[1], 0, 0, 0, 0, v[2], 0, 0, 0, 0, 1];
};

CatMath.mat4ScaleXYZ = function (s) {
  return [s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1];
};

CatMath.mat4RotateX = function (t) {
  return [1, 0, 0, 0, 0, Math.cos(t), -Math.sin(t), 0, 0, Math.sin(t), Math.cos(t), 0, 0, 0, 0, 1];
};

CatMath.mat4RotateY = function (t) {
  return [Math.cos(t), 0, Math.sin(t), 0, 0, 1, 0, 0, -Math.sin(t), 0, Math.cos(t), 0, 0, 0, 0, 1];
};

CatMath.mat4RotateZ = function (t) {
  return [Math.cos(t), -Math.sin(t), 0, 0, Math.sin(t), Math.cos(t), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

CatMath.mat4LookAt = function (pos, tar, air, rot) {
  var dir = CatMath.vecNormalize(CatMath.vecSub(tar, pos));
  var sid = CatMath.vecNormalize(CatMath.vec3Cross(dir, air));
  var top = CatMath.vec3Cross(sid, dir);
  sid = CatMath.vecAdd(CatMath.vecScale(Math.cos(rot), sid), CatMath.vecScale(Math.sin(rot), top));
  top = CatMath.vec3Cross(sid, dir);

  return [sid[0], top[0], dir[0], 0.0, sid[1], top[1], dir[1], 0.0, sid[2], top[2], dir[2], 0.0, -sid[0] * pos[0] - sid[1] * pos[1] - sid[2] * pos[2], -top[0] * pos[0] - top[1] * pos[1] - top[2] * pos[2], -dir[0] * pos[0] - dir[1] * pos[1] - dir[2] * pos[2], 1.0];
};

CatMath.mat4Perspective = function (fov, aspect, near, far) {
  var p = 1.0 / Math.tan(fov * Math.PI / 360.0);
  var d = far / (far - near);
  return [p / aspect, 0.0, 0.0, 0.0, 0.0, p, 0.0, 0.0, 0.0, 0.0, d, 1.0, 0.0, 0.0, -near * d, 0.0];
};

exports.default = CatMath;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/glcat-path.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var requiredFields = function requiredFields(object, nanithefuck, fields) {
  fields.map(function (field) {
    if (typeof object[field] === "undefined") {
      throw "GLCat-Path: " + field + " is required for " + nanithefuck;
    }
  });
};

var Path = function () {
  function Path(glCat, params) {
    _classCallCheck(this, Path);

    var it = this;

    it.glCat = glCat;
    it.gl = glCat.gl;

    it.paths = {};
    it.globalFunc = function () {};
    it.params = params || {};
  }

  _createClass(Path, [{
    key: "add",
    value: function add(paths) {
      var it = this;

      for (var name in paths) {
        var path = paths[name];
        requiredFields(path, "path object", ["width", "height", "vert", "frag", "blend", "func"]);
        it.paths[name] = path;

        if (typeof path.depthTest === "undefined") {
          path.depthTest = true;
        }

        if (path.framebuffer) {
          if (path.drawbuffers) {
            path.framebuffer = it.glCat.createDrawBuffers(path.width, path.height, path.drawbuffers);
          } else if (path.float) {
            path.framebuffer = it.glCat.createFloatFramebuffer(path.width, path.height);
          } else {
            path.framebuffer = it.glCat.createFramebuffer(path.width, path.height);
          }
        }
        path.program = it.glCat.createProgram(path.vert, path.frag);
      }
    }
  }, {
    key: "render",
    value: function render(name, params) {
      var _it$gl;

      var it = this;

      if (!params) {
        params = {};
      }
      var path = it.paths[name];
      params.target = typeof params.target !== "undefined" ? params.target : path.framebuffer ? path.framebuffer.framebuffer : null;

      it.gl.viewport(0, 0, path.width, path.height);
      it.glCat.useProgram(path.program);
      it.gl.bindFramebuffer(it.gl.FRAMEBUFFER, params.target);
      if (it.params.drawbuffers) {
        it.glCat.drawBuffers(path.drawbuffers ? path.drawbuffers : params.target === null ? [it.gl.BACK] : [it.gl.COLOR_ATTACHMENT0]);
      }
      (_it$gl = it.gl).blendFunc.apply(_it$gl, _toConsumableArray(path.blend));
      if (path.clear) {
        var _it$glCat;

        (_it$glCat = it.glCat).clear.apply(_it$glCat, _toConsumableArray(path.clear));
      }
      path.depthTest ? it.gl.enable(it.gl.DEPTH_TEST) : it.gl.disable(it.gl.DEPTH_TEST);

      it.glCat.uniform2fv('resolution', [path.width, path.height]);
      it.globalFunc(path, params);
      path.func(path, params);
    }
  }, {
    key: "resize",
    value: function resize(name, width, height) {
      var it = this;

      var path = it.paths[name];

      path.width = width;
      path.height = height;

      if (path.framebuffer) {
        if (it.params.drawbuffers && path.drawbuffers) {
          path.framebuffer = it.glCat.createDrawBuffers(path.width, path.height, path.drawbuffers);
        } else if (path.float) {
          path.framebuffer = it.glCat.createFloatFramebuffer(path.width, path.height);
        } else {
          path.framebuffer = it.glCat.createFramebuffer(path.width, path.height);
        }
      }

      if (typeof path.onresize === "function") {
        path.onresize(path, width, height);
      }
    }
  }, {
    key: "setGlobalFunc",
    value: function setGlobalFunc(func) {
      this.globalFunc = func;
    }
  }, {
    key: "fb",
    value: function fb(name) {
      if (!this.paths[name]) {
        throw "glcat-path.fb: path called " + name + " is not defined";
      }
      if (!this.paths[name].framebuffer) {
        throw "glcat-path.fb: there is no framebuffer for the path " + name;
      }

      return this.paths[name].framebuffer;
    }
  }]);

  return Path;
}();

exports.default = Path;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/glcat.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GLCat = function () {
	function GLCat(_gl) {
		_classCallCheck(this, GLCat);

		var it = this;

		it.gl = _gl;
		var gl = it.gl;

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		it.extensions = {};

		it.currentProgram = null;
	}

	_createClass(GLCat, [{
		key: "getExtension",
		value: function getExtension(_name, _throw) {
			var it = this;
			var gl = it.gl;

			if ((typeof _name === "undefined" ? "undefined" : _typeof(_name)) === "object" && _name.isArray()) {
				return _name.every(function (name) {
					return it.getExtension(name, _throw);
				});
			} else if (typeof _name === "string") {
				if (it.extensions[_name]) {
					return it.extensions[_name];
				} else {
					it.extensions[_name] = gl.getExtension(_name);
					if (it.extensions[_name]) {
						return it.extensions[_name];
					} else {
						if (_throw) {
							throw console.error("The extension \"" + _name + "\" is not supported");
						}
						return false;
					}
				}
				return !!it.extensions[_name];
			} else {
				throw "GLCat.getExtension: _name must be string or array";
			}
		}
	}, {
		key: "createProgram",
		value: function createProgram(_vert, _frag, _onError) {
			var it = this;
			var gl = it.gl;

			var error = void 0;
			if (typeof _onError === 'function') {
				error = _onError;
			} else {
				error = function error(_str) {
					console.error(_str);
				};
			}

			var vert = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vert, _vert);
			gl.compileShader(vert);
			if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
				error(gl.getShaderInfoLog(vert));
				return null;
			}

			var frag = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(frag, _frag);
			gl.compileShader(frag);
			if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
				error(gl.getShaderInfoLog(frag));
				return null;
			}

			var program = gl.createProgram();
			gl.attachShader(program, vert);
			gl.attachShader(program, frag);
			gl.linkProgram(program);
			if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
				program.locations = {};
				return program;
			} else {
				error(gl.getProgramInfoLog(program));
				return null;
			}
		}
	}, {
		key: "useProgram",
		value: function useProgram(_program) {
			var it = this;
			var gl = it.gl;

			gl.useProgram(_program);
			it.currentProgram = _program;
		}
	}, {
		key: "createVertexbuffer",
		value: function createVertexbuffer(_array) {
			var it = this;
			var gl = it.gl;

			var buffer = gl.createBuffer();

			if (_array) {
				it.setVertexbuffer(buffer, _array);
			}

			return buffer;
		}
	}, {
		key: "setVertexbuffer",
		value: function setVertexbuffer(_buffer, _array) {
			var it = this;
			var gl = it.gl;

			gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_array), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			_buffer.length = _array.length;
		}
	}, {
		key: "createIndexbuffer",
		value: function createIndexbuffer(_array) {
			var it = this;
			var gl = it.gl;

			var buffer = gl.createBuffer();

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(_array), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

			buffer.length = _array.length;
			return buffer;
		}
	}, {
		key: "getAttribLocation",
		value: function getAttribLocation(_name) {
			var it = this;
			var gl = it.gl;

			var location = void 0;
			if (it.currentProgram.locations[_name]) {
				location = it.currentProgram.locations[_name];
			} else {
				location = gl.getAttribLocation(it.currentProgram, _name);
				it.currentProgram.locations[_name] = location;
			}

			return location;
		}
	}, {
		key: "attribute",
		value: function attribute(_name, _buffer, _stride, _div) {
			var it = this;
			var gl = it.gl;

			if (_div) {
				it.getExtension("ANGLE_instanced_arrays", true);
			}

			var location = it.getAttribLocation(_name);

			gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(location, _stride, gl.FLOAT, false, 0, 0);

			var ext = it.getExtension("ANGLE_instanced_arrays");
			if (ext) {
				var div = _div || 0;
				ext.vertexAttribDivisorANGLE(location, div);
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}
	}, {
		key: "getUniformLocation",
		value: function getUniformLocation(_name) {
			var it = this;
			var gl = it.gl;

			var location = void 0;

			if (it.currentProgram.locations[_name]) {
				location = it.currentProgram.locations[_name];
			} else {
				location = gl.getUniformLocation(it.currentProgram, _name);
				it.currentProgram.locations[_name] = location;
			}

			return location;
		}
	}, {
		key: "uniform1i",
		value: function uniform1i(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform1i(location, _value);
		}
	}, {
		key: "uniform1f",
		value: function uniform1f(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform1f(location, _value);
		}
	}, {
		key: "uniform2fv",
		value: function uniform2fv(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform2fv(location, _value);
		}
	}, {
		key: "uniform3fv",
		value: function uniform3fv(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform3fv(location, _value);
		}
	}, {
		key: "uniform4fv",
		value: function uniform4fv(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform4fv(location, _value);
		}
	}, {
		key: "uniformMatrix4fv",
		value: function uniformMatrix4fv(_name, _value, _transpose) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniformMatrix4fv(location, _transpose || false, _value);
		}
	}, {
		key: "uniformCubemap",
		value: function uniformCubemap(_name, _texture, _number) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.activeTexture(gl.TEXTURE0 + _number);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, _texture);
			gl.uniform1i(location, _number);
		}
	}, {
		key: "uniformTexture",
		value: function uniformTexture(_name, _texture, _number) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.activeTexture(gl.TEXTURE0 + _number);
			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.uniform1i(location, _number);
		}
	}, {
		key: "createTexture",
		value: function createTexture() {
			var it = this;
			var gl = it.gl;

			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);

			return texture;
		}
	}, {
		key: "textureFilter",
		value: function textureFilter(_texture, _filter) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _filter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, _filter);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "textureWrap",
		value: function textureWrap(_texture, _wrap) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, _wrap);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, _wrap);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "setTexture",
		value: function setTexture(_texture, _image) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _image);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "setTextureFromArray",
		value: function setTextureFromArray(_texture, _width, _height, _array) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(_array));
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "setTextureFromFloatArray",
		value: function setTextureFromFloatArray(_texture, _width, _height, _array) {
			var it = this;
			var gl = it.gl;

			it.getExtension("OES_texture_float", true);

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, new Float32Array(_array));
			if (!it.getExtension("OES_texture_float_linear")) {
				it.textureFilter(_texture, gl.NEAREST);
			}
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "copyTexture",
		value: function copyTexture(_texture, _width, _height) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, _width, _height, 0);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "createCubemap",
		value: function createCubemap(_arrayOfImage) {
			var it = this;
			var gl = it.gl;

			// order : X+, X-, Y+, Y-, Z+, Z-
			var texture = gl.createTexture();

			gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
			for (var i = 0; i < 6; i++) {
				gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _arrayOfImage[i]);
			}
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

			return texture;
		}
	}, {
		key: "createFramebuffer",
		value: function createFramebuffer(_width, _height) {
			var it = this;
			var gl = it.gl;

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.texture = it.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: "resizeFramebuffer",
		value: function resizeFramebuffer(_framebuffer, _width, _height) {
			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer.framebuffer);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: "createFloatFramebuffer",
		value: function createFloatFramebuffer(_width, _height) {
			var it = this;
			var gl = it.gl;

			it.getExtension("OES_texture_float", true);

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.texture = it.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
			if (!it.getExtension("OES_texture_float_linear")) {
				it.textureFilter(framebuffer.texture, gl.NEAREST);
			}
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: "resizeFloatFramebuffer",
		value: function resizeFloatFramebuffer(_framebuffer, _width, _height) {
			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer.framebuffer);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: "createDrawBuffers",
		value: function createDrawBuffers(_width, _height, _numDrawBuffers) {
			var it = this;
			var gl = it.gl;

			it.getExtension('OES_texture_float', true);
			var ext = it.getExtension('WEBGL_draw_buffers', true);

			if (ext.MAX_DRAW_BUFFERS_WEBGL < _numDrawBuffers) {
				throw "createDrawBuffers: MAX_DRAW_BUFFERS_WEBGL is " + ext.MAX_DRAW_BUFFERS_WEBGL;
			}

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.textures = [];
			for (var i = 0; i < _numDrawBuffers; i++) {
				framebuffer.textures[i] = it.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, framebuffer.textures[i]);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
				if (!it.getExtension("OES_texture_float_linear")) {
					it.textureFilter(framebuffer.textures[i], gl.NEAREST);
				}
				gl.bindTexture(gl.TEXTURE_2D, null);

				gl.framebufferTexture2D(gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT0_WEBGL + i, gl.TEXTURE_2D, framebuffer.textures[i], 0);
			}

			var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			if (status !== gl.FRAMEBUFFER_COMPLETE) {
				throw "createDrawBuffers: gl.checkFramebufferStatus( gl.FRAMEBUFFER ) returns " + status;
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: "drawBuffers",
		value: function drawBuffers(_numDrawBuffers) {
			var it = this;
			var gl = it.gl;

			var ext = it.getExtension("WEBGL_draw_buffers", true);

			var array = [];
			if (typeof _numDrawBuffers === "number") {
				for (var i = 0; i < _numDrawBuffers; i++) {
					array.push(ext.COLOR_ATTACHMENT0_WEBGL + i);
				}
			} else {
				array = array.concat(_numDrawBuffers);
			}
			ext.drawBuffersWEBGL(array);
		}
	}, {
		key: "clear",
		value: function clear(_r, _g, _b, _a, _d) {
			var it = this;
			var gl = it.gl;

			var r = _r || 0.0;
			var g = _g || 0.0;
			var b = _b || 0.0;
			var a = typeof _a === 'number' ? _a : 1.0;
			var d = typeof _d === 'number' ? _d : 1.0;

			gl.clearColor(r, g, b, a);
			gl.clearDepth(d);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}
	}]);

	return GLCat;
}();

exports.default = GLCat;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/step.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var step = function step(_obj) {
  var obj = _obj;
  var count = -1;

  var func = function func() {
    count++;
    if (typeof obj[count] === 'function') {
      obj[count](func);
    }
  };
  func();
};

exports.default = step;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/tweak.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tweak = function () {
  function Tweak(_el) {
    _classCallCheck(this, Tweak);

    var it = this;

    it.parent = _el;
    it.values = {};
    it.elements = {};
  }

  _createClass(Tweak, [{
    key: 'button',
    value: function button(_name, _props) {
      var it = this;

      var props = _props || {};

      if (typeof it.values[_name] === 'undefined') {
        var div = document.createElement('div');
        it.parent.appendChild(div);

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'button';
        input.value = _name;

        input.addEventListener('click', function () {
          it.values[_name] = true;
        });

        it.elements[_name] = {
          div: div,
          input: input
        };
      }

      var tempvalue = it.values[_name];
      it.values[_name] = false;
      if (typeof props.set === 'boolean') {
        it.values[_name] = props.set;
      }

      return tempvalue;
    }
  }, {
    key: 'checkbox',
    value: function checkbox(_name, _props) {
      var it = this;

      var props = _props || {};

      var value = void 0;

      if (typeof it.values[_name] === 'undefined') {
        value = props.value || false;

        var div = document.createElement('div');
        it.parent.appendChild(div);

        var name = document.createElement('span');
        div.appendChild(name);
        name.innerText = _name;

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'checkbox';
        input.checked = value;

        it.elements[_name] = {
          div: div,
          name: name,
          input: input
        };
      } else {
        value = it.elements[_name].input.checked;
      }

      if (typeof props.set === 'boolean') {
        value = props.set;
      }

      it.elements[_name].input.checked = value;
      it.values[_name] = value;

      return it.values[_name];
    }
  }, {
    key: 'range',
    value: function range(_name, _props) {
      var it = this;

      var props = _props || {};

      var value = void 0;

      if (typeof it.values[_name] === 'undefined') {
        var min = props.min || 0.0;
        var max = props.max || 1.0;
        var step = props.step || 0.001;
        value = props.value || min;

        var div = document.createElement('div');
        it.parent.appendChild(div);

        var name = document.createElement('span');
        div.appendChild(name);
        name.innerText = _name;

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'range';
        input.value = value;
        input.min = min;
        input.max = max;
        input.step = step;

        var val = document.createElement('span');
        val.innerText = value.toFixed(3);
        div.appendChild(val);
        input.addEventListener('input', function (_event) {
          var value = parseFloat(input.value);
          val.innerText = value.toFixed(3);
        });

        it.elements[_name] = {
          div: div,
          name: name,
          input: input,
          val: val
        };
      } else {
        value = parseFloat(it.elements[_name].input.value);
      }

      if (typeof props.set === 'number') {
        value = props.set;
      }

      it.values[_name] = value;
      it.elements[_name].input.value = value;

      return it.values[_name];
    }
  }]);

  return Tweak;
}();

exports.default = Tweak;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/xorshift.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var seed = void 0;
var xorshift = function xorshift(_seed) {
  seed = _seed || seed || 1;
  seed = seed ^ seed << 13;
  seed = seed ^ seed >>> 17;
  seed = seed ^ seed << 5;
  return seed / Math.pow(2, 32) + 0.5;
};

exports.default = xorshift;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/main.js":[function(require,module,exports){
'use strict';

var _xorshift = require('./lib/xorshift');

var _xorshift2 = _interopRequireDefault(_xorshift);

var _glcat = require('./lib/glcat');

var _glcat2 = _interopRequireDefault(_glcat);

var _catmath = require('./lib/catmath');

var _catmath2 = _interopRequireDefault(_catmath);

var _automaton = require('./lib/automaton.min');

var _automaton2 = _interopRequireDefault(_automaton);

var _glcatPath = require('./lib/glcat-path');

var _glcatPath2 = _interopRequireDefault(_glcatPath);

var _step = require('./lib/step');

var _step2 = _interopRequireDefault(_step);

var _tweak = require('./lib/tweak');

var _tweak2 = _interopRequireDefault(_tweak);

var _octahedron = require('./octahedron');

var _octahedron2 = _interopRequireDefault(_octahedron);

var _assert = require('assert');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }



// ------

(0, _xorshift2.default)(13487134006);

var clamp = function clamp(_value, _min, _max) {
  return Math.min(Math.max(_value, _min), _max);
};
var saturate = function saturate(_value) {
  return clamp(_value, 0.0, 1.0);
};

// ------

var automaton = new _automaton2.default({
  gui: divAutomaton,
  data: '\n  {"rev":20170418,"length":1,"resolution":1000,"params":{"fillColor":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}],"jpegLofi":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":0,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.7,"value":0.06,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.798311444652908,"value":0.01,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":7.105427357601002e-15,"mode":2,"params":{},"mods":[false,false,false,false]}],"pixelsortThreshold":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":2,"params":{},"mods":[false,false,false,false]}],"jpegHigh":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":0,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.699812382739212,"value":0.3822774578069317,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":2,"params":{},"mods":[false,false,false,false]}],"\u3069\u3046\u3059\u308B\u3088":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]}],"altColor":[{"time":0,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":0,"params":{},"mods":[false,false,false,false]}],"cameraRot":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]}],"loadingScaleX":[{"time":0,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.375,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.5013477088948787,"value":3.3333333333333393,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":0.54177897574124,"value":2.142857142857146,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":0,"params":{},"mods":[false,false,false,false]}],"loadingScaleY":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.375,"value":1,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":0.4690026954177898,"value":-0.5952380952380913,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":0.5390835579514824,"value":-2.499999999999991,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":0.5983827493261457,"value":0,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]}],"blockSize":[{"time":0,"value":8,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":8,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.699812382739212,"value":128,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":64,"mode":0,"params":{},"mods":[false,false,false,false]}],"focus":[{"time":0,"value":45.184023310326175,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":15.612503486709784,"mode":4,"params":{"rate":1000,"damp":1},"mods":[false,false,false,false]},{"time":0.25,"value":42.49425195732287,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":10.512858216828425,"mode":4,"params":{"rate":2000,"damp":1},"mods":[{"velocity":0},false,false,false]},{"time":0.45,"value":42.03241802402827,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":7.4961272303534665,"mode":4,"params":{"rate":2000,"damp":1},"mods":[{"velocity":0},false,false,false]},{"time":0.65,"value":37.547946056960434,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":10,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"charShuffle":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.3427767354596623,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.7,"value":0.4758417038690459,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.800187617260788,"value":0,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]}],"octSize":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":5,"mode":4,"params":{"rate":1000,"damp":1},"mods":[false,false,false,false]}],"morpher":[{"time":0,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.875,"value":1,"mode":4,"params":{"rate":1000,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":-0.2,"mode":4,"params":{"rate":3000,"damp":1},"mods":[false,false,false,false]}],"killer":[{"time":0,"value":1.5,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.09615384615384616,"value":1.5,"mode":4,"params":{"rate":2000,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":2000,"damp":1},"mods":[false,false,false,false]}],"octY":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.8038461538461539,"value":7.105427357601002e-15,"mode":5,"params":{"gravity":70,"bounce":0.3},"mods":[false,false,false,false]},{"time":1,"value":-56.14285714285714,"mode":5,"params":{"gravity":2200.064,"bounce":0.3},"mods":[false,false,false,false]}],"cameraX":[{"time":0,"value":-3.15561710512641,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":0.0847828065756202,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":-1.218801046591798,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":-0.5765251527921276,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":-6.521743885496274,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":-8,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.65,"value":3.22488287569875,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraY":[{"time":0,"value":-1.0390331137454907,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":2.8444638509976965,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":-0.393607129528176,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":-0.7853937257861308,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":4.394546884465176,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":2.9819476092102057,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.65,"value":2.431182298321543,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraZ":[{"time":0,"value":16.876624220900677,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":15.615890575363611,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":5.10768565089596,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":6.065495468417207,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":4.728736601255578,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":6.788999876271241,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.65,"value":15.458457079577887,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":13,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraTX":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":-0.9181377723695601,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":-1.3799717056641612,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":-0.9073979409871815,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":-6.73151026449705,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":-7.305208728071706,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.65,"value":2.472956012920335,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraTY":[{"time":0,"value":1.9287636091368867,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":1.3776565408483261,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":3.8541462050079733,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":3.2248828756987495,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":0.46781771217789286,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":0.21717542458508987,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.65,"value":3.0577880173035474,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraTZ":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseFuji":[{"time":0,"value":0.2956193235435962,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1.5,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseMochi":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.9,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseKadomatsu":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.85,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseHuman":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.85,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseObjects":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.85,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseGay":[{"time":0,"value":0.25,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":0.25,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}]},"gui":{"snap":{"enable":false,"bpm":"60","offset":"0"}}}\n'
});
var auto = automaton.auto;

// ------

var width = 640;
var height = 640;
canvas.width = width;
canvas.height = height;

var gl = canvas.getContext('webgl');
var glCat = new _glcat2.default(gl);
glCat.getExtension("OES_texture_float", true);
glCat.getExtension("OES_texture_float_linear", true);
glCat.getExtension("EXT_frag_depth", true);
glCat.getExtension("WEBGL_draw_buffers", true);

var glCatPath = new _glcatPath2.default(glCat, { drawbuffers: true });

// ------

var tweak = new _tweak2.default(divTweak);

// ------

var totalFrame = 0;
var frame = 0;
var frames = 200;
var time = 0.0;
var init = true;
var secs = 1.0;
var deltaTime = 0.0;

var updateTime = function updateTime() {
  var reset = false;

  totalFrame++;
  frame++;
  if (frames <= frame) {
    frame = 0;
    reset = true;
  }

  var prevTime = time;
  time = secs * frame / frames;
  deltaTime = time + (reset ? secs : 0.0) - prevTime;

  init = false;
};

// ------

var particlePixels = 2;
var particlesSqrt = 64;
var particles = particlesSqrt * particlesSqrt;
var vertsPerParticle = 1;

var vboQuad = glCat.createVertexbuffer([-1, -1, 1, -1, -1, 1, 1, 1]);
var vboQuadUV = glCat.createVertexbuffer([0, 0, 1, 0, 0, 1, 1, 1]);
var vboQuad3 = glCat.createVertexbuffer([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);

var oct = (0, _octahedron2.default)(3);
var vboOctPos = glCat.createVertexbuffer(oct.pos);
var vboOctNor = glCat.createVertexbuffer(oct.nor);

var vboParticle = glCat.createVertexbuffer(function () {
  var ret = [];
  for (var i = 0; i < particlesSqrt * particlesSqrt * vertsPerParticle; i++) {
    var ix = Math.floor(i / vertsPerParticle) % particlesSqrt;
    var iy = Math.floor(i / particlesSqrt / vertsPerParticle);
    var iz = i % vertsPerParticle;

    ret.push(ix * particlePixels);
    ret.push(iy);
    ret.push(iz);
  }
  return ret;
}());

// ------

var textureRandomSize = 256;

var textureRandomUpdate = function textureRandomUpdate(_tex) {
  glCat.setTextureFromArray(_tex, textureRandomSize, textureRandomSize, function () {
    var len = textureRandomSize * textureRandomSize * 4;
    var ret = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      ret[i] = Math.floor((0, _xorshift2.default)() * 256.0);
    }
    return ret;
  }());
};

var textureKadomatsu = glCat.createTexture();
var textureMale = glCat.createTexture();
var textureFemale = glCat.createTexture();
var textureMochi = glCat.createTexture();
var textureFujisan = glCat.createTexture();
var textureGay = glCat.createTexture();

var textureRandomStatic = glCat.createTexture();
glCat.textureWrap(textureRandomStatic, gl.REPEAT);
textureRandomUpdate(textureRandomStatic);

var textureRandom = glCat.createTexture();
glCat.textureWrap(textureRandom, gl.REPEAT);

// ------

var renderA = document.createElement('a');

var saveFrame = function saveFrame() {
  renderA.href = canvas.toDataURL('image/jpeg');
  renderA.download = ('0000' + totalFrame).slice(-5) + '.jpg';
  renderA.click();
};

// ------

var mouseX = 0.0;
var mouseY = 0.0;

// ------

var cameraPos = [0.0, 0.0, 0.0];
var cameraTar = [0.0, 0.0, 0.0];
var cameraRot = 0.0;
var cameraFov = 90.0;

var cameraNear = 0.01;
var cameraFar = 100.0;

var matP = void 0;
var matV = void 0;

var updateMatrices = function updateMatrices() {
  matP = _catmath2.default.mat4Perspective(cameraFov, width / height, cameraNear, cameraFar);
  matV = _catmath2.default.mat4LookAt(cameraPos, cameraTar, [0.0, 1.0, 0.0], cameraRot);
};
updateMatrices();

// ------

var bgColor = [0.51, 0.01, 0.02, 1.0];

// ------

glCatPath.setGlobalFunc(function () {
  glCat.uniform1i('init', init);
  glCat.uniform1f('time', time);
  glCat.uniform1f('deltaTime', deltaTime);
  glCat.uniform3fv('cameraPos', cameraPos);
  glCat.uniform1f('cameraRot', cameraRot);
  glCat.uniform1f('cameraFov', cameraFov);
  glCat.uniform1f('cameraNear', cameraNear);
  glCat.uniform1f('cameraFar', cameraFar);
  glCat.uniform1f('particlesSqrt', particlesSqrt);
  glCat.uniform1f('particlePixels', particlePixels);
  glCat.uniform1f('frame', frame % frames);
  glCat.uniform1f('frames', frames);
  glCat.uniform1f('vertsPerParticle', vertsPerParticle);
  glCat.uniformMatrix4fv('matP', matP);
  glCat.uniformMatrix4fv('matV', matV);
  glCat.uniform4fv('bgColor', bgColor);
});

glCatPath.add({
  return: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( sampler0, uv );\n}\n",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 1.0],
    func: function func(_p, params) {
      gl.viewport(0, 0, params.width, params.height);
      glCat.uniform2fv('resolution', [params.width, params.height]);

      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('sampler0', params.input, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  こんにちは: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#extension GL_EXT_frag_depth : require\n#extension GL_EXT_draw_buffers : require\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec4 bgColor;\n\n// ------\n\nvoid main() {\n  gl_FragData[ 0 ] = bgColor;\n  gl_FragData[ 1 ] = vec4( 9E9, 0.0, 0.0, 1.0 );\n  gl_FragDepthEXT = 1.0;\n}",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 1.0],
    framebuffer: true,
    drawbuffers: 2,
    float: true,
    func: function func() {
      glCat.attribute('p', vboQuad, 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  hny: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\nattribute vec3 pos;\nattribute vec3 nor;\nattribute vec2 uv;\n\nvarying vec3 vPos;\nvarying vec3 vNor;\nvarying vec2 vUv;\n\nuniform float time;\nuniform vec2 resolution;\nuniform vec3 cameraPos;\nuniform float cameraRot;\nuniform float cameraFov;\n\nuniform mat4 matP;\nuniform mat4 matV;\nuniform mat4 matM;\n\n// ------\n\nmat4 inverse( mat4 m ) {\n  float\n    a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],\n    a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],\n    a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],\n    a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],\n\n    b00 = a00 * a11 - a01 * a10,\n    b01 = a00 * a12 - a02 * a10,\n    b02 = a00 * a13 - a03 * a10,\n    b03 = a01 * a12 - a02 * a11,\n    b04 = a01 * a13 - a03 * a11,\n    b05 = a02 * a13 - a03 * a12,\n    b06 = a20 * a31 - a21 * a30,\n    b07 = a20 * a32 - a22 * a30,\n    b08 = a20 * a33 - a23 * a30,\n    b09 = a21 * a32 - a22 * a31,\n    b10 = a21 * a33 - a23 * a31,\n    b11 = a22 * a33 - a23 * a32,\n\n    det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n\n  return mat4(\n    a11 * b11 - a12 * b10 + a13 * b09,\n    a02 * b10 - a01 * b11 - a03 * b09,\n    a31 * b05 - a32 * b04 + a33 * b03,\n    a22 * b04 - a21 * b05 - a23 * b03,\n    a12 * b08 - a10 * b11 - a13 * b07,\n    a00 * b11 - a02 * b08 + a03 * b07,\n    a32 * b02 - a30 * b05 - a33 * b01,\n    a20 * b05 - a22 * b02 + a23 * b01,\n    a10 * b10 - a11 * b08 + a13 * b06,\n    a01 * b08 - a00 * b10 - a03 * b06,\n    a30 * b04 - a31 * b02 + a33 * b00,\n    a21 * b02 - a20 * b04 - a23 * b00,\n    a11 * b07 - a10 * b09 - a12 * b06,\n    a00 * b09 - a01 * b07 + a02 * b06,\n    a31 * b01 - a30 * b03 - a32 * b00,\n    a20 * b03 - a21 * b01 + a22 * b00\n  ) / det;\n}\n\n// ------\n\nvoid main() {\n  vec4 p = matM * vec4( pos, 1.0 );\n  vPos = p.xyz;\n\n  mat4 matN = matM;\n  matN[0] = normalize( matN[0] );\n  matN[1] = normalize( matN[1] );\n  matN[2] = normalize( matN[2] );\n  matN[3] = vec4( 0.0, 0.0, 0.0, 1.0 );\n  vNor = ( matN * vec4( nor, 1.0 ) ).xyz;\n\n  vUv = uv;\n\n  vec4 outPos = matP * matV * p;\n  gl_Position = outPos;\n}",
    frag: "#define HUGE 9E16\n#define EPS 5E-3\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\n#extension GL_EXT_draw_buffers : require\nprecision highp float;\n#define GLSLIFY 1\n\nvarying vec2 vUv;\nvarying vec3 vPos;\n\nuniform vec4 color;\nuniform vec4 bgColor;\nuniform vec3 cameraPos;\nuniform vec3 cameraNear;\nuniform vec3 cameraFar;\nuniform sampler2D sampler0;\nuniform float phase;\n\n// ------\n\nvoid main() {\n  vec2 uv = vec2( 0.0, 1.0 ) + vec2( 1.0, -1.0 ) * vUv;\n  float scan = uv.y - ( 1.0 - phase );\n  if ( scan < 0.0 ) { discard; }\n\n  vec4 tex = texture2D( sampler0, uv );\n  float delta = (\n    length(\n      texture2D( sampler0, uv + vec2( EPS, 0.0 ) ) -\n      texture2D( sampler0, uv - vec2( EPS, 0.0 ) )\n    ) + length(\n      texture2D( sampler0, uv + vec2( 0.0, EPS ) ) -\n      texture2D( sampler0, uv - vec2( 0.0, EPS ) )\n    )\n  );\n  float amp = 2.5 * smoothstep( 0.2, 0.5, delta );\n  amp += 24.0 * ( amp + 0.1 * tex.w ) * exp( -40.0 * scan );\n  if ( amp == 0.0 ) { discard; }\n\n  vec3 col = amp * color.xyz;\n  // col += 0.1 * mix( tex.xyz, vec3( 0.0 ), saturate( amp ) );\n\n  float depth = length( vPos - cameraPos );\n\n  gl_FragData[ 0 ] = vec4( col, 1.0 );\n  gl_FragData[ 1 ] = vec4( depth, 0.0, 0.0, 1.0 );\n}",
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    drawbuffers: 2,
    func: function func(_p, params) {
      glCat.attribute('pos', vboQuad3, 3);
      glCat.attribute('uv', vboQuadUV, 2);

      var matM = _catmath2.default.mat4Identity();
      matM = _catmath2.default.mat4Apply(_catmath2.default.mat4ScaleXYZ(params.scale), matM);
      matM = _catmath2.default.mat4Apply(_catmath2.default.mat4Translate(params.position), matM);
      glCat.uniformMatrix4fv('matM', matM);

      glCat.uniform1f('phase', params.phase);
      glCat.uniform4fv('color', [0.9, 0.6, 0.2, 1.0]);
      glCat.uniformTexture('sampler0', params.texture, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  particlesComputeReturn: {
    width: particlesSqrt * particlePixels,
    height: particlesSqrt,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( sampler0, uv );\n}\n",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func() {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('texture', glCatPath.fb("particlesCompute").texture, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  particlesCompute: {
    width: particlesSqrt * particlePixels,
    height: particlesSqrt,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define PARTICLE_LIFE_SPEED 1.0\n\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n#define lofir(i,m) (floor((i)/(m)+.5)*(m))\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform float particlesSqrt;\nuniform float particlePixels;\nuniform float frame;\nuniform float frames;\nuniform float charShuffle;\nuniform bool init;\nuniform float deltaTime;\nuniform vec2 resolution;\nuniform vec3 cameraPos;\n\nuniform sampler2D textureReturn;\nuniform sampler2D textureRandom;\n\n// ------\n\nvec2 vInvert( vec2 _uv ) {\n  return vec2( 0.0, 1.0 ) + vec2( 1.0, -1.0 ) * _uv;\n}\n\n// ------\n\nmat2 rotate2D( float _t ) {\n  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );\n}\n\nvec4 random( vec2 _uv ) {\n  return texture2D( textureRandom, _uv );\n}\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nfloat mod289(float x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat permute(float x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat taylorInvSqrt(float r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec4 grad4(float j, vec4 ip)\n  {\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;\n\n  return p;\n  }\n\n// (sqrt(5) - 1)/4 = F4, used once below\n#define F4 0.309016994374947451\n\nfloat snoise(vec4 v)\n  {\n  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4\n                        0.276393202250021,  // 2 * G4\n                        0.414589803375032,  // 3 * G4\n                       -0.447213595499958); // -1 + 4 * G4\n\n// First corner\n  vec4 i  = floor(v + dot(v, vec4(F4)) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n// Other corners\n\n// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\n  vec4 i0;\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n//  i0.x = dot( isX, vec3( 1.0 ) );\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  // i0 now contains the unique values 0,1,2,3 in each channel\n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  //  x0 = x0 - 0.0 + 0.0 * C.xxxx\n  //  x1 = x0 - i1  + 1.0 * C.xxxx\n  //  x2 = x0 - i2  + 2.0 * C.xxxx\n  //  x3 = x0 - i3  + 3.0 * C.xxxx\n  //  x4 = x0 - 1.0 + 4.0 * C.xxxx\n  vec4 x1 = x0 - i1 + C.xxxx;\n  vec4 x2 = x0 - i2 + C.yyyy;\n  vec4 x3 = x0 - i3 + C.zzzz;\n  vec4 x4 = x0 + C.wwww;\n\n// Permutations\n  i = mod289(i);\n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope\n// 7*7*6 = 294, which is close to the ring size 17*17 = 289.\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n// Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n// Mix contributions from the five corners\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n  }\n\nfloat GPURnd(inout vec4 n)\n{\n\t// Based on the post http://gpgpu.org/forums/viewtopic.php?t=2591&sid=17051481b9f78fb49fba5b98a5e0f1f3\n\t// (The page no longer exists as of March 17th, 2015. Please let me know if you see why this code works.)\n\tconst vec4 q = vec4(   1225.0,    1585.0,    2457.0,    2098.0);\n\tconst vec4 r = vec4(   1112.0,     367.0,      92.0,     265.0);\n\tconst vec4 a = vec4(   3423.0,    2646.0,    1707.0,    1999.0);\n\tconst vec4 m = vec4(4194287.0, 4194277.0, 4194191.0, 4194167.0);\n\n\tvec4 beta = floor(n / q);\n\tvec4 p = a * (n - beta * q) - beta * r;\n\tbeta = (sign(-p) + vec4(1.0)) * vec4(0.5) * m;\n\tn = (p + beta);\n\n\treturn fract(dot(n / m, vec4(1.0, -1.0, 1.0, -1.0)));\n}\n\nvec3 randomSphere( inout vec4 seed ) {\n  vec3 v;\n  for ( int i = 0; i < 10; i ++ ) {\n    v = vec3(\n      GPURnd( seed ),\n      GPURnd( seed ),\n      GPURnd( seed )\n    ) * 2.0 - 1.0;\n    if ( length( v ) < 1.0 ) { break; }\n  }\n  return v;\n}\n\nvec2 randomCircle( inout vec4 seed ) {\n  vec2 v;\n  for ( int i = 0; i < 10; i ++ ) {\n    v = vec2(\n      GPURnd( seed ),\n      GPURnd( seed )\n    ) * 2.0 - 1.0;\n    if ( length( v ) < 1.0 ) { break; }\n  }\n  return v;\n}\n\nvec3 randomBox( inout vec4 seed ) {\n  vec3 v;\n  v = vec3(\n    GPURnd( seed ),\n    GPURnd( seed ),\n    GPURnd( seed )\n  ) * 2.0 - 1.0;\n  return v;\n}\n\n// ------\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 puv = vec2( ( floor( gl_FragCoord.x / particlePixels ) * particlePixels + 0.5 ) / resolution.x, uv.y );\n  float number = ( ( gl_FragCoord.x - 0.5 ) / particlePixels ) + ( ( gl_FragCoord.y - 0.5 ) * particlesSqrt );\n  float mode = mod( gl_FragCoord.x, particlePixels );\n  vec2 dpix = vec2( 1.0 ) / resolution;\n\n  vec4 seed = texture2D( textureRandom, puv );\n  GPURnd( seed );\n\n  vec4 pos = texture2D( textureReturn, puv );\n  vec4 vel = texture2D( textureReturn, puv + dpix * V.yx );\n\n  float dt = deltaTime;\n    \n  float timing = number / particlesSqrt / particlesSqrt * frames / PARTICLE_LIFE_SPEED;\n  float timingI = floor( timing );\n  float timingF = fract( timing );\n  if ( timingI == mod( frame, frames / PARTICLE_LIFE_SPEED ) ) {\n    vec3 intrv = vec3( 0.2, 0.2, 0.2 );\n    pos.xz = vec2( 20.0, 10.0 ) * randomCircle( seed );\n    pos.y = -10.0;\n    pos.w = 1.0;\n\n    vel.xyz = 3.0 * randomSphere( seed );\n    vel.y += 30.0;\n    vel.w = GPURnd( seed );\n\n    dt = deltaTime * ( 1.0 - timingF );\n  }\n\n  vel.xyz += 1E2 * dt * vec3(\n    snoise( vec4( pos.xyz * 0.37 + 5.51 + 0.1 * sin( 2.0 * PI * time ), 20.04 ) ),\n    snoise( vec4( pos.xyz * 0.37 + 4.31 + 0.1 * sin( 2.0 * PI * time ), 41.21 ) ),\n    snoise( vec4( pos.xyz * 0.37 + 8.79 + 0.1 * sin( 2.0 * PI * time ), 32.95 ) )\n  );\n  vel.xyz *= exp( -1.0 * dt );\n\n  pos.xyz += vel.xyz * dt;\n  pos.w -= dt * PARTICLE_LIFE_SPEED;\n\n  gl_FragColor = (\n    mode < 1.0 ? pos :\n    vel\n  );\n}",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func() {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniform1f('charShuffle', auto('charShuffle'));
      glCat.uniformTexture('textureReturn', glCatPath.fb("particlesComputeReturn").texture, 0);
      glCat.uniformTexture('textureRandom', textureRandom, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  particlesRender: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\nattribute vec3 vuv;\n\nvarying vec3 vPos;\nvarying float vLife;\n\nuniform vec2 resolution;\nuniform vec2 resolutionPcompute;\nuniform vec3 cameraPos;\nuniform float cameraRot;\nuniform float cameraFov;\nuniform float vertsPerParticle;\nuniform mat4 matP;\nuniform mat4 matV;\n\nuniform sampler2D texturePcompute;\n\n// ------\n\nvoid main() {\n  vec2 puv = ( vuv.xy + 0.5 ) / resolutionPcompute;\n  vec2 dppix = vec2( 1.0 ) / resolutionPcompute; \n\n  vec4 pos = texture2D( texturePcompute, puv );\n  vec4 vel = texture2D( texturePcompute, puv + dppix * V.yx );\n\n  vPos = pos.xyz;\n  vLife = pos.w;\n\n  vec4 outPos = matP * matV * vec4( pos.xyz, 1.0 );\n  gl_PointSize = resolution.y / 20.0 * sin( PI * pos.w ) * ( 0.5 + 0.5 * vel.w ) / outPos.z;\n  gl_Position = outPos;\n}",
    frag: "#define PARTICLE_LIFE_SPEED 2.0\n\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\n#extension GL_EXT_draw_buffers : require\nprecision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vPos;\nvarying float vLife;\nvarying vec2 vChar;\nvarying vec2 vUv;\n\nuniform vec3 color;\nuniform vec3 cameraPos;\n\nuniform sampler2D textureWord;\n\n// ------\n\nvoid main() {\n  if ( vLife <= 0.0 ) { discard; }\n\n  float shape = smoothstep( 0.5, 0.4, length( gl_PointCoord.xy - 0.5 ) );\n  if ( shape < 0.5 ) { discard; }\n\n  float depth = length( vPos - cameraPos );\n\n  gl_FragData[ 0 ] = vec4( color * sin( PI * vLife ), 1.0 );\n  gl_FragData[ 1 ] = vec4( depth, 0.0, 0.0, 1.0 );\n}",
    drawbuffers: 2,
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    func: function func() {
      glCat.attribute('vuv', vboParticle, 3);
      glCat.uniform2fv('resolutionPcompute', [particlesSqrt * particlePixels, particlesSqrt]);
      glCat.uniform3fv('color', [5.0, 3.0, 1.0]);
      glCat.uniformTexture('texturePcompute', glCatPath.fb("particlesCompute").texture, 0);
      gl.drawArrays(gl.POINT, 0, particles * vertsPerParticle);
    }
  },

  predof: {
    width: width / 4,
    height: height / 4,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( sampler0, uv );\n}\n",
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('sampler0', params.input, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  dof: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define BOKEH 0.09\n#define BOKEH_MAX 5.0\n#define FOG 0.01\n#define SAMPLES 4\n#define SAMPLE_INTERVAL 4.0\n#define R_SAMPLES 6\n#define R_INTERVAL 1.0\n#define T_SAMPLES 6\n\n#define V vec2(0.,1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,j) floor((i)/(j))*(j)\n#define PI 3.14159265\n#define TAU 6.28318531\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\nuniform sampler2D samplerPredof;\nuniform sampler2D samplerDepth;\nuniform vec4 bgColor;\nuniform float focus;\n\nfloat gaussian( float _x, float _v ) {\n  return 1.0 / sqrt( 2.0 * PI * _v ) * exp( - _x * _x / 2.0 / _v );\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n\n  vec3 sum = V.xxx;\n  for ( int ir = 0; ir < R_SAMPLES; ir ++ ) {\n    for ( int it = 0; it < T_SAMPLES; it ++ ) {\n      float theta = TAU * float( it ) / float( T_SAMPLES );\n      vec2 delta = R_INTERVAL * float( ir ) * vec2( cos( theta ), sin( theta ) );\n      bool center = ir == 0;\n      vec2 v = saturate( uv + SAMPLE_INTERVAL * delta / resolution );\n\n      float len = texture2D( samplerDepth, v ).x;\n      float gauss = min( pow( BOKEH * abs( focus - len ), 2.0 ), BOKEH_MAX );\n      float mul = mix(\n        center ? 1.0 : 0.0,\n        gaussian( abs( delta.x ), gauss ) * gaussian( abs( delta.y ), gauss ),\n        saturate( gauss )\n      );\n\n      vec3 tex = (\n        0.2 < mul ?\n        texture2D( sampler0, v ) :\n        texture2D( samplerPredof, v )\n      ).xyz;\n\n      sum += mix( bgColor.xyz, tex, exp( -len * FOG ) ) * saturate( mul );\n\n      if ( center ) { break; }\n    }\n  }\n\n  gl_FragColor = vec4( sum, 1.0 );\n  // gl_FragColor = texture2D( samplerDepth, uv );\n}\n",
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniform1f('focus', auto('focus'));
      glCat.uniformTexture('sampler0', params.dry, 0);
      glCat.uniformTexture('samplerPredof', params.predof, 1);
      glCat.uniformTexture('samplerDepth', params.depth, 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  prebloom: {
    width: width / 4,
    height: height / 4,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( sampler0, uv );\n}\n",
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('sampler0', params.input, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  "Gowrock - bloom": {
    width: width / 4.0,
    height: height / 4.0,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define V vec2(0.,1.)\n#define saturate(i) clamp(i,0.,1.)\n#define PI 3.14159265\n#define SAMPLES 40\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform bool isVert;\nuniform sampler2D sampler0;\nuniform sampler2D samplerDry;\n\nuniform float gaussVar;\n\nfloat gaussian( float _x, float _v ) {\n  return 1.0 / sqrt( 2.0 * PI * _v ) * exp( - _x * _x / 2.0 / _v );\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) ) / resolution;\n\n  vec3 sum = V.xxx;\n  for ( int i = -SAMPLES; i <= SAMPLES; i ++ ) {\n    vec2 v = saturate( uv + bv * float( i ) );\n    vec3 tex = texture2D( sampler0, v ).xyz;\n    float mul = gaussian( abs( float( i ) ), gaussVar );\n    sum += tex * mul;\n  }\n\n  gl_FragColor = vec4( sum, 1.0 );\n}\n",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    tempFb: glCat.createFloatFramebuffer(width / 4.0, height / 4.0),
    framebuffer: true,
    float: true,
    func: function func(_p, params) {
      for (var i = 0; i < 3; i++) {
        var gaussVar = [5.0, 15.0, 40.0][i];
        gl.bindFramebuffer(gl.FRAMEBUFFER, _p.tempFb.framebuffer);
        glCat.clear.apply(glCat, _toConsumableArray(_p.clear));

        glCat.attribute('p', vboQuad, 2);
        glCat.uniform1i('isVert', false);
        glCat.uniform1f('gaussVar', gaussVar);
        glCat.uniformTexture('sampler0', params.input, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindFramebuffer(gl.FRAMEBUFFER, params.target);

        glCat.attribute('p', vboQuad, 2);
        glCat.uniform1i('isVert', true);
        glCat.uniform1f('gaussVar', gaussVar);
        glCat.uniformTexture('sampler0', _p.tempFb.texture, 0);
        glCat.uniformTexture('samplerDry', params.input, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }
  },

  bloomFinalize: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D samplerDry;\nuniform sampler2D samplerWet;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec3 dry = texture2D( samplerDry, uv ).xyz;\n  vec3 wet = texture2D( samplerWet, uv ).xyz;\n  gl_FragColor.xyz = (\n    dry +\n    max( vec3( 0.0 ), wet / 4.0 - 0.2 )\n  );\n  gl_FragColor.w = 1.0;\n}\n",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('samplerDry', params.dry, 0);
      glCat.uniformTexture('samplerWet', params.wet, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  おたくはすぐポストエフェクトを挿す: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform vec2 resolution;\n\nuniform sampler2D sampler0;\nuniform sampler2D samplerDepth;\nuniform sampler2D samplerBloom;\n\n// ------\n\nvec3 barrel( float amp, vec2 uv ) {\n\tfloat corn = length( vec2( 0.5 ) );\n\tfloat a = min( 3.0 * sqrt( amp ), corn * PI );\n\tfloat zoom = corn / ( tan( corn * a ) + corn );\n\tvec2 p = saturate(\n    ( uv + normalize( uv - 0.5 ) * tan( length( uv - 0.5 ) * a ) ) * zoom +\n    0.5 * ( 1.0 - zoom )\n  );\n\treturn texture2D( sampler0, vec2( p.x, p.y ) ).xyz;\n}\n\n// ------\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution.y;\n  float vig = 1.14 - length( p ) * 0.4;\n\n  vec3 tex = vec3( 0.0 );\n\n  for ( int i = 0; i < 10; i ++ ) {\n    float fi = float( i ) / 9.0;\n    vec3 a = saturate( vec3(\n      fi < 1.0 / 6.0 ? 1.0 : 1.0 - 3.0 * abs( 1.0 / 6.0 - fi ),\n      1.0 - 3.0 * abs( 1.0 / 2.0 - fi ),\n      5.0 / 6.0 < fi ? 1.0 : 1.0 - 3.0 * abs( 5.0 / 6.0 - fi )\n    ) ) / 10.0 * 3.0;\n    tex += a * barrel( 0.0 + 0.07 * fi, uv );\n  }\n\n  tex = mix(\n    vec3( 0.0 ),\n    tex,\n    vig\n  );\n\n  vec3 col = pow( saturate( tex.xyz ), vec3( 1.0 / 2.2 ) );\n  col = vec3(\n    smoothstep( -0.1, 1.1, col.x ),\n    smoothstep( 0.0, 1.0, col.y ),\n    smoothstep( -0.3, 1.3, col.z )\n  );\n\n  gl_FragColor = vec4( col, 1.0 );\n}",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('sampler0', params.input, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }
});

// ------

var updateUI = function updateUI() {
  var now = new Date();
  var deadline = new Date(2018, 0, 5, 0, 0);

  divCountdown.innerText = "Deadline: " + Math.floor((deadline - now) / 1000);

  divFrame.innerText = "Frames: " + totalFrame;
};

// ------

var update = function update() {
  if (frame % frames === 0) {
    (0, _xorshift2.default)(79017846734887343443);
  }

  if (!tweak.checkbox('play', { value: true })) {
    setTimeout(update, 10);
    return;
  }

  textureRandomUpdate(textureRandom);

  updateUI();

  updateTime();
  updateMatrices();

  automaton.update(time);

  cameraPos = [auto("cameraX"), auto("cameraY"), auto("cameraZ")];
  cameraTar = [auto("cameraTX"), auto("cameraTY"), auto("cameraTZ")];
  cameraRot = auto("cameraRot");

  glCatPath.render("こんにちは");

  // glCatPath.render( "monitor", { target: glCatPath.fb( "こんにちは" ).framebuffer } );

  glCatPath.render("particlesComputeReturn");
  glCatPath.render("particlesCompute");
  glCatPath.render("particlesRender", { target: glCatPath.fb("こんにちは").framebuffer });

  glCatPath.render("hny", { target: glCatPath.fb("こんにちは").framebuffer,
    position: [0.0, 0.0, -10.0],
    scale: 40.0,
    phase: auto("phaseFuji"),
    texture: textureFujisan
  });

  glCatPath.render("hny", { target: glCatPath.fb("こんにちは").framebuffer,
    position: [0.0, 6.0, -4.0],
    scale: 6.0,
    phase: auto("phaseObjects"),
    texture: textureMochi
  });

  glCatPath.render("hny", { target: glCatPath.fb("こんにちは").framebuffer,
    position: [-8.0, 0.0, 0.0],
    scale: 5.0,
    phase: auto("phaseObjects"),
    texture: textureKadomatsu
  });

  glCatPath.render("hny", { target: glCatPath.fb("こんにちは").framebuffer,
    position: [8.0, 0.0, 0.0],
    scale: 5.0,
    phase: auto("phaseObjects"),
    texture: textureKadomatsu
  });

  glCatPath.render("hny", { target: glCatPath.fb("こんにちは").framebuffer,
    position: [-3.0, -2.0, 3.0],
    scale: 5.0,
    phase: auto("phaseObjects"),
    texture: textureMale
  });

  glCatPath.render("hny", { target: glCatPath.fb("こんにちは").framebuffer,
    position: [3.0, -2.0, 2.99],
    scale: 5.0,
    phase: auto("phaseObjects"),
    texture: textureFemale
  });

  glCatPath.render("hny", { target: glCatPath.fb("こんにちは").framebuffer,
    position: [-0.3, 4.8, 4.0],
    scale: 6.0,
    phase: auto("phaseGay"),
    texture: textureGay
  });

  glCatPath.render("predof", { input: glCatPath.fb("こんにちは").textures[0] });
  glCatPath.render("dof", { dry: glCatPath.fb("こんにちは").textures[0], predof: glCatPath.fb("predof").texture, depth: glCatPath.fb("こんにちは").textures[1] });
  glCatPath.render("prebloom", { input: glCatPath.fb("dof").texture });
  glCatPath.render("Gowrock - bloom", { input: glCatPath.fb("prebloom").texture });
  glCatPath.render("bloomFinalize", { dry: glCatPath.fb("dof").texture, wet: glCatPath.fb("Gowrock - bloom").texture });
  glCatPath.render("おたくはすぐポストエフェクトを挿す", { input: glCatPath.fb("bloomFinalize").texture, target: null });

  if (tweak.checkbox('save', { value: false })) {
    saveFrame();
  }

  requestAnimationFrame(update);
};

// ------

(0, _step2.default)({
  0: function _(done) {
    var loadTexture = function loadTexture(tex, glCatPath) {
      var img = new Image();
      img.onload = function () {
        glCat.setTexture(tex, img);
        done();
      };
      img.src = glCatPath;
    };

    loadTexture(textureKadomatsu, "images/kadomatsu.png");
    loadTexture(textureMale, "images/male.png");
    loadTexture(textureFemale, "images/female.png");
    loadTexture(textureMochi, "images/mochi.png");
    loadTexture(textureFujisan, "images/fujisan.png");
    loadTexture(textureGay, "images/gay.png");
  },

  6: function _(done) {
    update();
  }
});

window.addEventListener('keydown', function (_e) {
  if (_e.which === 27) {
    tweak.checkbox('play', { set: false });
  }
});

window.addEventListener('mousemove', function (event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

},{"./lib/automaton.min":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/automaton.min.js","./lib/catmath":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/catmath.js","./lib/glcat":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/glcat.js","./lib/glcat-path":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/glcat-path.js","./lib/step":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/step.js","./lib/tweak":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/tweak.js","./lib/xorshift":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/lib/xorshift.js","./octahedron":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/octahedron.js","assert":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/node_modules/assert/assert.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/octahedron.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var octahedron = function octahedron(_div) {
  var pos = [];
  var nor = [];

  for (var ii = 0; ii < 2; ii++) {
    for (var iq = 0; iq < 4; iq++) {
      for (var iy = 0; iy < _div + 1; iy++) {
        for (var ix = 0; ix < iy + 1; ix++) {
          var lat0 = (ii * 2.0 + iy / (_div + 1)) * Math.PI / 2.0;
          var lat1 = (ii * 2.0 + (iy + 1) / (_div + 1)) * Math.PI / 2.0;

          var lon0 = (ii * 2.0 - 1.0) * ((ix - 1) / Math.max(1, iy) + iq) * Math.PI / 2.0;
          var lon1 = (ii * 2.0 - 1.0) * (ix / (iy + 1) + iq) * Math.PI / 2.0;
          var lon2 = (ii * 2.0 - 1.0) * (ix / Math.max(1, iy) + iq) * Math.PI / 2.0;
          var lon3 = (ii * 2.0 - 1.0) * ((ix + 1) / (iy + 1) + iq) * Math.PI / 2.0;

          if (ix !== 0) {
            var x1 = Math.sin(lat0) * Math.cos(lon0);pos.push(x1);
            var y1 = Math.cos(lat0);pos.push(y1);
            var z1 = Math.sin(lat0) * Math.sin(lon0);pos.push(z1);

            var x2 = Math.sin(lat1) * Math.cos(lon1);pos.push(x2);
            var y2 = Math.cos(lat1);pos.push(y2);
            var z2 = Math.sin(lat1) * Math.sin(lon1);pos.push(z2);

            var x3 = Math.sin(lat0) * Math.cos(lon2);pos.push(x3);
            var y3 = Math.cos(lat0);pos.push(y3);
            var z3 = Math.sin(lat0) * Math.sin(lon2);pos.push(z3);

            {
              var x = x1 + x2 + x3;
              var y = y1 + y2 + y3;
              var z = z1 + z2 + z3;
              var l = Math.sqrt(x * x + y * y + z * z);

              for (var i = 0; i < 3; i++) {
                nor.push(x / l);
                nor.push(y / l);
                nor.push(z / l);
              }
            }
          }

          {
            var _x = Math.sin(lat0) * Math.cos(lon2);pos.push(_x);
            var _y = Math.cos(lat0);pos.push(_y);
            var _z = Math.sin(lat0) * Math.sin(lon2);pos.push(_z);

            var _x2 = Math.sin(lat1) * Math.cos(lon1);pos.push(_x2);
            var _y2 = Math.cos(lat1);pos.push(_y2);
            var _z2 = Math.sin(lat1) * Math.sin(lon1);pos.push(_z2);

            var _x3 = Math.sin(lat1) * Math.cos(lon3);pos.push(_x3);
            var _y3 = Math.cos(lat1);pos.push(_y3);
            var _z3 = Math.sin(lat1) * Math.sin(lon3);pos.push(_z3);

            {
              var _x4 = _x + _x2 + _x3;
              var _y4 = _y + _y2 + _y3;
              var _z4 = _z + _z2 + _z3;
              var _l = Math.sqrt(_x4 * _x4 + _y4 * _y4 + _z4 * _z4);

              for (var _i = 0; _i < 3; _i++) {
                nor.push(_x4 / _l);
                nor.push(_y4 / _l);
                nor.push(_z4 / _l);
              }
            }
          }
        }
      }
    }
  }

  return {
    pos: pos,
    nor: nor
  };
};

exports.default = octahedron;

},{}]},{},["/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180105/src/script/main.js"]);
