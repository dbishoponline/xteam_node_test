'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.readFiles = readFiles;
exports.sortByRank = sortByRank;
exports.getSpacing = getSpacing;
exports.traverse = traverse;
exports.getLongestArgWidth = getLongestArgWidth;
exports.countOccurs = countOccurs;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function readFiles(files, onRead, onError, onComplete) {
  var filesArr = [];

  (0, _glob2.default)(files, function (err, files) {
    if (err) {
      console.log('Oops, cannot read ' + files, err);
    }

    files.forEach(function (file) {
      _fs2.default.readFile(file, 'utf-8', function (err, data) {
        if (err) {
          onError(err);
          return;
        }

        onRead(files, file, data, onComplete);
      });
    });
  });
}

function sortByRank(obj) {

  var arr = [];

  for (var i in obj) {
    arr.push([i, obj[i]]);
  }return arr.sort(function (a, b) {
    a = a[1];
    b = b[1];

    return a > b ? -1 : a < b ? 1 : 0;
  });
}

function getSpacing() {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var label = arguments[1];
  var num = arguments[2];

  var spacing = '';
  var numSpaces = 0;

  var labelLength = label.length;
  var numLength = num.toString().length;
  var charWidth = labelLength + numLength;

  if (charWidth <= max) {
    numSpaces = max - charWidth;
  }
  for (var i = 0; i <= numSpaces; i++) {
    spacing += ' ';
  }
  return spacing;
}

// //called with every property and its value
// function process(key,value) {
//     console.log(key + " : "+value)
// }

function traverse(obj, func) {
  for (var i in obj) {
    func.apply(this, [i, obj[i]]);
    if (obj[i] !== null && _typeof(obj[i]) == "object") {
      //going one step down in the object tree!!
      traverse(obj[i], func);
    }
  }
}

function getLongestArgWidth(args) {
  return args.reduce(function (acc, arg) {
    var accLength = acc;
    var argLength = arg.length;
    return argLength > accLength ? argLength : accLength;
  }, '');
}

function countOccurs(str, inStr) {
  return (inStr.match(str) || []).length;
}