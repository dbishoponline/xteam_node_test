'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.readFiles = readFiles;
exports.sortByRank = sortByRank;
exports.traverse = traverse;
exports.countOccurs = countOccurs;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function readFiles(files, onFileContent, onError, callback) {
  return (0, _glob2.default)(files, function (err, files) {
    if (err) {
      console.log('Oops, cannot read ' + files, err);
    }

    files.forEach(function (file) {
      _fs2.default.readFile(file, 'utf-8', function (err, data) {
        if (err) {
          onError(err);
          return;
        }

        onFileContent(file, data, function () {
          return data;
        });
      });
    });

    return files;
  });
}

function sortByRank(arr) {
  // var sortable = []
  // var new = {
  //   ...obj
  // }
  //
  // for(var prop in obj) {
  //   sortable[property] = prop
  // }

  var newArr = arr.concat([]);

  return newArr.sort();
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

// //that's all... no magic, no bloated framework
// traverse(o,process)


function countOccurs(str, inStr) {
  return (inStr.match(str) || []).length;
}
//
//
// glob("data/*.json", function(err, files) { // read the folder or folders if you want: example json/**/*.json
//   if(err) {
//     console.log("cannot read the folder, something goes wrong with glob", err)
//   }
//   var matters = []
//   files.forEach(function(file) {
//     fs.readFile(file, 'utf8', function (err, data) { // Read each file
//       if(err) {
//         console.log("cannot read the file, something goes wrong with the file", err)
//       }
//       var obj = JSON.parse(data)
//       obj.action.forEach(function(crud) {
//         for(var k in crud) {
//           if(_inArray(crud[k].providedAction, matters)) {
//             // do your magic HERE
//             console.log("duplicate founded!")
//             // you want to return here and cut the flow, there is no point in keep reading files.
//             break
//           }
//           matters.push(crud[k].providedAction)
//         }
//       })
//     })
//   })
// })
//
//
//
// var findObjectByLabel = function(obj, label) {
//     if(obj.label === label) { return obj }
//     for(var i in obj) {
//         if(obj.hasOwnProperty(i)){
//             var foundLabel = findObjectByLabel(obj[i], label)
//             if(foundLabel) { return foundLabel }
//         }
//     }
//     return null
// }