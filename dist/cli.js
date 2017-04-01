'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('./helpers');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var CLI = function () {
  function CLI() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CLI);

    if (!instance) {
      instance = this;
    }

    this.counts = [];

    var args = this.getUserArgs();

    this.exec(args);

    return instance;
  }

  _createClass(CLI, [{
    key: 'getUserArgs',
    value: function getUserArgs() {
      return process.argv.length ? process.argv.slice(2) : null;
    }
  }, {
    key: 'exec',
    value: function exec(args) {
      var _this = this;

      var output = '';

      args.forEach(function (arg) {
        var name = arg.replace(',', '');
        var files = './data/*.json';

        (0, _helpers.readFiles)(files, name, _this.onReadFile.bind(_this), _this.onError.bind(_this), function () {
          _this.echo();
        });
      });

      return output;
    }
  }, {
    key: 'onReadFile',
    value: function onReadFile(file, str, data) {
      // var obj = JSON.parse(data)
      if (typeof this.counts[str] == 'undefined') {
        this.counts[str] = (0, _helpers.countOccurs)(str, data);
      } else {
        this.counts[str] += (0, _helpers.countOccurs)(str, data);
      }
    }
  }, {
    key: 'onError',
    value: function onError(err) {
      throw 'Failed to read files ' + err;
    }
  }, {
    key: 'echo',
    value: function echo() {
      console.log('COUNTS:', this.counts);
      var sorted = (0, _helpers.sortByRank)(this.counts);

      var str = sorted.reduce(function (acc, val) {
        return '\n        ' + acc + '\n        - ' + val.name + '       ' + val.count + '\n      ';
      }, '');

      console.log('\n      ' + str + '\n    ');

      //
      // pizza     15
      // spoon     2
      // umbrella  0
      // cats      0
      //
    }
  }, {
    key: 'onError',
    value: function onError() {}
  }]);

  return CLI;
}();

exports.default = CLI;