#! /usr/bin/env node
"use strict";

var _cli = require("./cli");

var _cli2 = _interopRequireDefault(_cli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-register");
require("babel-polyfill");

var cli = new _cli2.default();