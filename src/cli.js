import { getUserArgs, stripCommas, readFiles, countOccurs, sortByRank, getSpacing, getLongestArgWidth } from './helpers'

let instance = null

class CLI {

  constructor(options = {}) {

    if(!instance){
      instance = this
    }

    this.counts = {}
    this.files = null
    this.filesSearched = 0
    this.defaultSpacing = 5

    if(!getUserArgs().length){
      let tags = '../tags.txt'
      readFiles(tags, (files, file, data) => {
        console.log(files, file, data)
        this.args = data
      }, () => {}, ()=> {})
    }

    this.args = stripCommas(getUserArgs())

    this.exec(this.args)
  }

  exec(args = null) {
    if (!args){
      args = this.args
    }

    let files = './data/*.json'

    readFiles(files, this.onReadFile.bind(this), this.onError.bind(this), this.onComplete.bind(this))
  }

  onReadFile(files, file, data, callback) {
    // var obj = JSON.parse(data)
    this.files = files

    this.args.forEach((arg) => {
      if(typeof this.counts[arg] == 'undefined' ) {
        this.counts[arg] = countOccurs(arg, data)
      }
      else {
        this.counts[arg] += countOccurs(arg, data)
      }
    })

    callback.call(this)
  }

  onError(err) {
    throw(`Failed to read files ${err}`)
  }

  onComplete(){
    this.filesSearched++

    if(this.filesSearched == this.files.length){
      this.echo.call(this)
    }
    return
  }

  echo(){
    let sorted = sortByRank(this.counts)
    console.log('SORTED:', sorted)
    console.log('args:', this.args)

    let argWidth = getLongestArgWidth(this.args)

    let str = sorted.reduce((acc, val) => {
      console.log('val'+val[0], 'val'+val[1])
      let spacing = getSpacing(argWidth + this.defaultSpacing, val[0], val[1])
      return `${acc}\n${val[0]}${spacing}${val[1]}`
    }, '')

    console.log(`
      ${str}
    `)

    //
    // pizza     15
    // spoon     2
    // umbrella  0
    // cats      0
    //
  }

  onError() {

  }
}

export default CLI
