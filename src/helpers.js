import fs from 'fs'
import glob from 'glob'

/**
  * getUserArgs
  *
  * returns an array of arguments from the CLI command
  *
  * @return {array}          returns an array of strings
  */
export function getUserArgs() {
  return process.argv.length ? process.argv.slice(2) : null
}

/**
  * cleanCommas
  *
  * removes the commas from an array values and returns a new array
  *
  * @param  {array}   arr   array of string values which will be cleaned
  * @return {array}           new array with commas removed
  */
export function cleanCommas(arr) {
  if(!Array.isArray(arr)){
    throw 'cleanCommas() requires an array.'
  }
  return arr.map((item) => {
    return item.replace(',', '')
  })
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
export function readFiles(files, onRead, onError, onDone) {
  let filesArr = []

  glob(files, (err, files) => {
    if(err) {
      console.log(`Oops, cannot read ${files}`, err)
    }

    files.forEach((file) => {
      fs.readFile(file, 'utf8', (err, content) => {
        if (err) {
          onError(err, file)
          return
        }

        return onRead(files, file, content, onDone)
      })
    })

    filesArr = files.concat([])

    return files
  })

  return filesArr
}

/**
  * sortByRank
  *
  * sort object properties keys by value amount descending
  *
  * @param  {object}     obj        the object who's props will be sorted
  * @return {array}                 new array which has been sorted
  */
export function sortByRank(obj){

  var arr = []

  for(var i in obj) arr.push([i, obj[i]])

  return arr.sort((a, b) => {
    a = a[1]
    b = b[1]

    return a > b ? -1 : (a < b ? 1 : 0)
  })
}

/**
  * getSpacing
  *
  * returns the spacing between a row's label and value
  *
  * @param  {int}      max          max number of spaces
  * @param  {string}   label        the label of the row
  * @param  {int}      num          the number of the row
  * @return {string}                a string of spaces
  */
export function getSpacing(max = 10, label, num){
  let spacing = ``
  let numSpaces = 0

  let labelLength = label.length
  let numLength = (num.toString()).length
  let charWidth = labelLength + numLength

  if(charWidth <= max){
    numSpaces = max - charWidth
  }
  for(var i = 0; i <= numSpaces; i++ ){
    spacing += ` `
  }
  return spacing
}

/**
  * getLongestArgWidth
  *
  * returns the longest arg (string) of all the args in an array
  *
  * @param  {array}      args      array of arguments (strings)
  * @return {string}               returns the longest string's char width in the array
  */
export function getLongestArgWidth(args){
  return args.reduce((acc, arg) => {
    let accLength = acc
    let argLength = arg.length
    return (argLength > accLength) ? argLength : accLength
  }, '')
}

/**
  * countOccurs
  *
  * counts the number of times a string exists in another string
  *
  * @param  {string}      str      a string to search for
  * @param  {string}      inStr    a string to search in
  * @return {string}               returns the num of times
  */
export function countOccurs(str, inStr){
  return (inStr.match(str) || []).length
}

export function trim(str){
  return str.replace(/^\s+|\s+$/g,'')
}

export function validateJSON(json){
  try {
    let obj = JSON.parse(json)

    if (obj && typeof obj === "object") {
      return true
    }
  }
  catch (err) {}

  return false
}
