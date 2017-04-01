import fs from 'fs'
import glob from 'glob'

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
