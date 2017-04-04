import test from 'ava'
import CLI from '../dist/cli'

import { getUserArgs, cleanCommas, readFiles, countOccurs, sortByRank, getSpacing, getLongestArgWidth } from '../src/helpers'


test(`readFiles() should return null if "files" argument is empty string`, t => {
  let res = readFiles("", () => {}, () => {}, () => {})

  t.is(res.length, 0)
})

test(`readFiles() should return  an array of file paths`, t => {
  let count = null

  let res = readFiles(__dirname+'/../data/*.json', (files, file, data, onComplete) => {
    count = files
    onComplete(files, file)
  }, t.fail, onDone)

  function onDone(files, file){
    count = files.length--
    if(!count){
      t.pass()
    }
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
