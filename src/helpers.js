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
  * @param  {array}   args   array of string values which will be cleaned
  * @return {array}           new array with commas removed
  */
export function cleanCommas(args) {
  return args.map((arg) => {
    return arg.replace(',', '')
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
  * @param  {function}   onComplete   callback function when reading the file is complete
  * @return {array}                   new array of files from a glob
  */
export function readFiles(files, onRead, onError, onComplete) {
  let filesArr = []

  glob(files, (err, files) => {
    if(err) {
      console.log(`Oops, cannot read ${files}`, err)
    }

    files.forEach((file) => {
      fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
          onError(err)
          return
        }

        onRead(files, file, data, onComplete)
      })
    })

    return files
  })
}

export function sortByRank(obj){

  var arr = []

  for(var i in obj) arr.push([i, obj[i]])

  return arr.sort((a, b) => {
    a = a[1]
    b = b[1]

    return a > b ? -1 : (a < b ? 1 : 0)
  })
}

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

// //called with every property and its value
// function process(key,value) {
//     console.log(key + " : "+value)
// }

export function traverse(obj, func) {
    for (var i in obj) {
        func.apply(this,[i,obj[i]])
        if (obj[i] !== null && typeof(obj[i])=="object") {
            //going one step down in the object tree!!
            traverse(obj[i],func)
        }
    }
}

export function getLongestArgWidth(args){
  return args.reduce((acc, arg) => {
    let accLength = acc
    let argLength = arg.length
    return (argLength > accLength) ? argLength : accLength
  }, '')
}

export function countOccurs(str, inStr){
  return (inStr.match(str) || []).length
}
