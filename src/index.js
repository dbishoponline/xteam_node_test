#! /usr/bin/env node

require("babel-register")
require("babel-polyfill")

import CLI from './cli'

const cli = new CLI()
