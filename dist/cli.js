'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('./helpers');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var CLI = function () {

  /**
    * CLI - Command Line Interface
    * @constructor
    *
    * constructs the CLI and triggers the finduted command
    *
    * @return {object}           returns an instance of self
    */
  function CLI() {
    _classCallCheck(this, CLI);

    // the user input arguments
    this.args = (0, _helpers.getUserArgs)();

    // the formatted output which will be logged to console
    this.output = '';

    // an array of files that will be searched
    this.files = {};

    // an object of counts for each tag
    this.tagCounts = {};

    // the default amount of spaces between each row's label (left) and count (right)
    this.defaultSpacing = 5;

    // file with default tags that will be searched if user does not specific any arguments
    this.tagsFile = '**/tags.txt';

    // the path to files that will be searched
    this.dataFiles = './data/*.json';

    // the path to the cache file
    this.cacheFile = './cached.json';

    // object to store the cacheFile content
    this.cached = {};
    this.cached.args = [];

    // boolean which will be true when the user reenters the same input
    this.userRetry = false;

    // initialize the utility
    return this.init();
  }

  /**
    * init
    *
    * initializes the utility and begins the Find workflow
    *
    * @return {object}           returns an instance of self
    */


  _createClass(CLI, [{
    key: 'init',
    value: function init() {
      var _this = this;

      // get the cached data
      this.getCached(function (content) {

        _this.cached = content.length ? JSON.parse(content) : {};

        // check to see if the same command was rerun by the user
        if ((0, _helpers.didUserRetryCommand)(_this.args, _this.cached.args)) {
          _this.userRetry = true;
          _this.retryCommand();
        } else {
          _this.userRetry = false;
          _this.newCommand();
        }
      });

      return this;
    }

    /**
    * getCached
    *
    * loads the data from the cache file
    *
    * @param  {function}   callback     triggered after the file(s) were read
    */

  }, {
    key: 'getCached',
    value: function getCached(callback) {
      (0, _helpers.readFiles)(this.cacheFile, function (files, file, content, onDone) {
        onDone(content);
      }, _helpers.onError, callback);
    }

    /**
    * cacheOutput
    *
    * caches args and output by writing to a file
    *
    * @param  {function}   args       the args to be cached
    * @param  {function}   output     the output to be cached
    * @param  {function}   callback     callback triggered after the stuff is cached
    */

  }, {
    key: 'cacheOutput',
    value: function cacheOutput(args, output, callback) {
      var json = {
        args: args,
        output: output
      };

      (0, _helpers.writeFile)(this.cacheFile, JSON.stringify(json), _helpers.onError, callback);
    }

    /**
      * newCommand
      *
      * gets the tags, counts how many times they show up in files, then output to screen
      *
      */

  }, {
    key: 'newCommand',
    value: function newCommand() {
      var _this2 = this;

      // gets an array of tags either from args or default tags file
      this.getTags(function (tags) {
        _this2.tags = tags;

        // searches and counts tags in the data files
        _this2.find(function () {

          // parses the tagCounts into formatted string
          _this2.output = (0, _helpers.format)(_this2.tags, _this2.tagCounts, _this2.defaultSpacing);

          // cache the args and output
          _this2.cacheOutput(_this2.args, _this2.output, function () {
            // then display the counts to screen
            _this2.echo();
          });
        });
      });
    }

    /**
      * retryCommand
      *
      * displays the cached output
      *
      */

  }, {
    key: 'retryCommand',
    value: function retryCommand() {
      this.output = this.cached.output;
      this.echo();
    }

    /**
      * getTags
      *
      * gets the defaults tags
      *
      * @param  {function}   callback   triggered when done getting the tags (either from args, or tags.txt)
      */

  }, {
    key: 'getTags',
    value: function getTags(callback) {
      // if user args exist, use as the tags
      if (this.args.length) {
        callback((0, _helpers.cleanCommas)(this.args));
        return;
      }

      // else load tags from ../tags.txt
      this.loadTagsFile(function (content) {
        callback((0, _helpers.trim)(content).split('\n'));
        return;
      });
    }

    /**
      * loadTagsFile
      *
      * loads the data from the tags file
      *
      * @param  {function}   callback   triggered when done reading the tags from a file
      */

  }, {
    key: 'loadTagsFile',
    value: function loadTagsFile(callback) {
      (0, _helpers.readFiles)(this.tagsFile, function (files, file, content, onDone) {
        onDone(content);
      }, _helpers.onError, function (content) {
        callback(content);
      });
    }

    /**
      * find
      *
      * runs the saga of finding and counting tags in an array json files and searching for a specific string
      *
      * @param  {function}   callback   triggered when done reading the data files
      */

  }, {
    key: 'find',
    value: function find(callback) {
      (0, _helpers.readFiles)(this.dataFiles, this.onReadDataFile.bind(this), _helpers.onError.bind(this), function () {
        callback();
      });
    }

    /**
      * onReadDataFile
      *
      * handles reading each data file and fires a callback when reading all the data files is finished
      *
      * @param  {array}      files       array of pathnames to data files
      * @param  {string}     file        the filename and path
      * @param  {string}     content     the unparsed text content in the file
      * @param  {function}   callback    triggered when done reading the tags from a file
      */

  }, {
    key: 'onReadDataFile',
    value: function onReadDataFile(files, file, content, callback) {
      this.files[file] = content;

      if (!(0, _helpers.isValidJSON)(content)) {
        console.error('Cannot parse invalid JSON in file: ' + file + ' \n');
      } else {
        (0, _helpers.countTagsInFileContent)(this.tags, this.tagCounts, content);
      }

      if (Object.keys(this.files).length == files.length) {
        callback(this);
      }
    }

    /**
      * echo
      *
      * displays the output to the console
      *
      */

  }, {
    key: 'echo',
    value: function echo() {
      var cached = this.userRetry ? '(Cached)' : '';
      console.log('Totals ' + cached + ' \n' + this.output + '\n');
    }
  }]);

  return CLI;
}();

exports.default = CLI;