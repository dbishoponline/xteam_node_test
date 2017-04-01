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

    this.counts = {};
    this.files = null;
    this.filesSearched = 0;
    this.defaultSpacing = 5;

    this.args = this.stripCommas(this.getUserArgs());

    this.exec(this.args);
  }

  _createClass(CLI, [{
    key: 'getUserArgs',
    value: function getUserArgs() {
      return process.argv.length ? process.argv.slice(2) : null;
    }
  }, {
    key: 'stripCommas',
    value: function stripCommas(args) {
      return args.map(function (arg) {
        return arg.replace(',', '');
      });
    }
  }, {
    key: 'exec',
    value: function exec() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!args) {
        args = this.args;
      }

      var files = './data/*.json';

      (0, _helpers.readFiles)(files, this.onReadFile.bind(this), this.onError.bind(this), this.onComplete.bind(this));
    }
  }, {
    key: 'onReadFile',
    value: function onReadFile(files, file, data, callback) {
      var _this = this;

      // var obj = JSON.parse(data)
      this.files = files;

      this.args.forEach(function (arg) {
        if (typeof _this.counts[arg] == 'undefined') {
          _this.counts[arg] = (0, _helpers.countOccurs)(arg, data);
        } else {
          _this.counts[arg] += (0, _helpers.countOccurs)(arg, data);
        }
      });

      callback.call(this);
    }
  }, {
    key: 'onError',
    value: function onError(err) {
      throw 'Failed to read files ' + err;
    }
  }, {
    key: 'onComplete',
    value: function onComplete() {
      this.filesSearched++;

      if (this.filesSearched == this.files.length) {
        this.echo.call(this);
      }
      return;
    }
  }, {
    key: 'echo',
    value: function echo() {
      var _this2 = this;

      var sorted = (0, _helpers.sortByRank)(this.counts);
      console.log('SORTED:', sorted);
      console.log('args:', this.args);

      var argWidth = (0, _helpers.getLongestArgWidth)(this.args);

      var str = sorted.reduce(function (acc, val) {
        console.log('val' + val[0], 'val' + val[1]);
        var spacing = (0, _helpers.getSpacing)(argWidth + _this2.defaultSpacing, val[0], val[1]);
        return acc + '\n' + val[0] + spacing + val[1];
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