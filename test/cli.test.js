import test from 'ava'
import CLI from '../dist/cli'

import { getUserArgs, cleanCommas, readFiles, countOccurs, sortByRank, getSpacing, getLongestArgWidth, trim, isValidJSON } from '../src/helpers'


test(`readFiles() should return null if "files" argument is empty string`, t => {
  let res = readFiles("", () => {}, () => {}, () => {})

  t.is(res.length, 0)
})

test.cb(`readFiles() should return  an array of file paths`, t => {
  t.plan(1)

  let count = null

  let res = readFiles(__dirname+'/../data/*.json', (files, file, data, onComplete) => {
    count = (!count) ? files.length : count
    count--
    if(!count){
      onComplete(files, file, count)
    }
  }, t.fail, onDone)

  function onDone(files, file, count){
    t.is(count, 0)
    t.end()
  }
})

test(`getUserArgs() should return an array of args when they exist in the user input`, t => {
  process.argv = [ '/usr/local/Cellar/node/7.5.0/bin/node',
  '/Users/username/dev/apps/node-exam/dist/index.js',
  'ipsum',
  'chicken' ]

  if(getUserArgs().toString() === (process.argv).slice(2).toString()){
    t.pass()
  }
  else {
    t.fail()
  }
})

test(`cleanCommas() should return an array without commas in any of the index values`, t => {
  let arr = ['ipsum,', 'lorem,', 'xteam', 'development,']

  let newArray = cleanCommas(arr)

  newArray.forEach((item) => {
    if(item.indexOf(',') > -1){
      t.fail()
      return
    }
  })

  t.pass()
})

test(`getSpacing() should return a string of spaces`, t => {
  let spacing = getSpacing(10, 'ipsum', 22)
  t.is(spacing.length, 4)
})

test(`getLongestArgWidth() should return a string of spaces`, t => {
  let args = ['ipsum', 'amet', 'automobile', 'silver']
  let longest = getLongestArgWidth(args)
  t.is(longest, 10)
})

test(`countOccurs() should return a number of times the substring showed up in the larger string`, t => {
  let str = "Lorem"
  let inStr = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In aliquam sollicitudin luctus.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In aliquam sollicitudin luctus.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In aliquam sollicitudin luctus.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In aliquam sollicitudin luctus.`
  let count = countOccurs(str, inStr)
  t.is(count, 4)
})

test(`trim() should return a string with any spaces at the beginning and end trimmed off `, t => {
  let str = " Lorem ipsum dolor sit amet  "
  let newStr = trim(str)
  if(newStr.substring(0, 1).indexOf(' ') > -1 || newStr.substring(newStr.length - 1, newStr.length).indexOf(' ') > -1 ){
    t.fail(`\'${newStr}\'`)
    t.end()
  }
  t.pass(`\'${newStr}\'`)
})

test.cb(`isValidJSON() should return true when receives a valid json object `, t => {
  t.plan(1)
  let count = null
  readFiles('valid.json', (files, file, data, onComplete) => {
    console.log(data)
    count = (!count) ? files.length : count
    count--
    if(!count){
      onComplete(data)
    }
  }, t.fail, (data) => {
    t.is(isValidJSON(data.toString()), false)
    t.end()
  })
})

test.cb(`isValidJSON() should return false when receives an invalid json object `, t => {
  t.plan(1)
  let count = null
  readFiles('invalid.json', (files, file, data, onComplete) => {
    console.log(data)
    count = (!count) ? files.length : count
    count--
    if(!count){
      onComplete(data)
    }
  }, t.fail, (data) => {
    t.is(isValidJSON(data.toString()), false)
    t.end()
  })
})
