'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getUserArgs = getUserArgs;
exports.cleanCommas = cleanCommas;
exports.readFiles = readFiles;
exports.writeFile = writeFile;
exports.sortByRank = sortByRank;
exports.getSpacing = getSpacing;
exports.getLongestArgWidth = getLongestArgWidth;
exports.countOccurs = countOccurs;
exports.trim = trim;
exports.isValidJSON = isValidJSON;
exports.didUserRetryCommand = didUserRetryCommand;
exports.countTagsInFileContent = countTagsInFileContent;
exports.format = format;
exports.onError = onError;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  * getUserArgs
  *
  * returns an array of arguments from the CLI command
  *
  * @return {array}          returns an array of strings
  */
function getUserArgs() {
  return process.argv.length ? process.argv.slice(2) : null;
}

/**
  * cleanCommas
  *
  * removes the commas from an array values and returns a new array
  *
  * @param  {array}   arr   array of string values which will be cleaned
  * @return {array}           new array with commas removed
  */
function cleanCommas(arr) {
  if (!Array.isArray(arr)) {
    throw 'cleanCommas() requires an array.';
  }
  return arr.map(function (item) {
    return item.replace(',', '');
  });
}

/**
  * readFiles
  *
  * reads all files in a dir based on a glob string and triggers callback functions
  *
  * @param  {string}     files        path of the files which will be read
  * @param  {function}   onRead       callback function when a file is read
  * @param  {function}   onError      callback function when an error occurs
  * @param  {function}   onDone   callback function when reading the file is complete
  * @return {array}                   new array of files from a glob
  */
function readFiles(files, onRead, onError, onDone) {
  var filesArr = [];

  (0, _glob2.default)(files, function (err, files) {
    if (err) {
      console.log('Oops, cannot read ' + files, err);
    }

    filesArr = files.concat([]);

    if (!filesArr.length) {
      onDone('');
      return files;
    }

    filesArr.forEach(function (file) {
      _fs2.default.readFile(file, 'utf8', function (err, content) {
        if (err) {
          onError(err, file, 'read');
          return;
        }

        return onRead(filesArr, file, content, onDone);
      });
    });

    return files;
  });

  return filesArr;
}

/**
  * writeFile
  *
  * writes a file to disk
  *
  * @param  {string}     file         path to the file that will be created
  * @param  {string}     content      callback function when a file is read
  * @param  {function}   onError      callback function when an error occurs
  * @param  {function}   onDone       callback function when reading the file is complete
  */
function writeFile(file, content, onError, onDone) {
  _fs2.default.writeFile(file, content, function (err) {
    if (err) {
      onError(err, file, 'write');
    }
    onDone(content);
  });
}

/**
  * sortByRank
  *
  * sort object properties keys by value amount descending
  *
  * @param  {obj}     obj        the object who's props will be sorted
  * @return {array}                 new array which has been sorted
  */
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

/**
  * getSpacing
  *
  * returns the spacing between a row's label and value
  *
  * @param  {number}      max          max number of spaces (default is 10)
  * @param  {string}      label        the label in the row
  * @param  {number}      num          the integer in the row
  * @return {string}                a string of spaces
  */
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

/**
  * getLongestArgWidth
  *
  * returns the longest arg (string) of all the args in an array
  *
  * @param  {array}      args      array of arguments (strings)
  * @return {string}               returns the longest string's char width in the array
  */
function getLongestArgWidth(args) {
  return args.reduce(function (acc, arg) {
    var accLength = acc;
    var argLength = arg.length;
    return argLength > accLength ? argLength : accLength;
  }, '');
}

/**
  * countOccurs
  *
  * counts the number of times a string exists in another string
  *
  * @param  {string}      str      a string to search for
  * @param  {string}      inStr    a string to search in
  * @return {number}               returns the num of times
  */
function countOccurs(str, inStr) {
  return inStr.toLowerCase().split(str.toLowerCase()).length - 1;
}

/**
  * trim
  *
  * trims extra spaces at the beginning and end of string
  *
  * @param  {string}      str      a string that will be trimmed
  * @return {string}               returns the new string
  */
function trim(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

/**
  * isValidJSON
  *
  * validates a json string
  *
  * @param  {string}      json      a string that will be validated
  * @return {boolean}                returns a true if is valid JSON
  */
function isValidJSON(json) {
  try {
    var obj = JSON.parse(json);

    if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object") {
      return true;
    }
  } catch (err) {}

  return false;
}

/**
* didUserRetryCommand
*
* returns a boolean if the user retried the CLI command with the same arguments
*
* @param  {array}   args       the args
* @param  {array}   cached     the cached args
*
* @return {bool}           returns true if the new arguments match the cached arguments
*/
function didUserRetryCommand(args, cached) {
  if (typeof cached == 'undefined') return false;
  return args.toString() === cached.toString();
}

/**
  * countTagsInFileContent
  *
  * counts the tags in the file content
  *
  * @param  {array}   tags         the tags
  * @param  {object}   tagCounts   containing counted tags name/values
  * @param  {string}   content     the content string
  */
function countTagsInFileContent(tags, tagCounts, content) {
  tags.forEach(function (arg) {
    if (typeof tagCounts[arg] == 'undefined') {
      tagCounts[arg] = countOccurs(arg, content);
    } else {
      tagCounts[arg] += countOccurs(arg, content);
    }
  });

  return tagCounts;
}

/**
  * format
  *
  * formats the total counts of each tag with correct spacing
  *
  * @param  {array}   tags             the tags
  * @param  {object}   counts           containing counted tags name/values
  * @param  {number}   defaultSpacing   default number of spaces
  */
function format(tags, counts, defaultSpacing) {
  var sorted = sortByRank(counts);
  var argWidth = getLongestArgWidth(tags);

  return sorted.reduce(function (acc, val) {
    var spacing = getSpacing(argWidth + defaultSpacing, val[0], val[1]);

    return acc + '\n' + val[0] + spacing + val[1];
  }, '');
}

/**
  * onError
  *
  * handles file read and write errors
  *
  * @param  {array}   err         the error message
  * @param  {array}   file        the file pathname which failed
  * @param  {string}  action      the type of action which failed
  */
function onError(err, file, action) {
  throw 'Something went wrong trying to ' + action + ' the file: ' + file + '. \n Error Message: ' + err;
}