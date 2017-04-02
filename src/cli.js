import { getUserArgs, cleanCommas, readFiles, countOccurs, sortByRank, getSpacing, getLongestArgWidth } from './helpers'

let instance = null

class CLI {

  /**
    * CLI.constructor
    *
    * constructs the CLI and triggers the executed command
    *
    * @return {object}           returns an instance of self
    */
  constructor() {

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
        this.args = data
      }, () => {}, ()=> {})
    }

    this.args = cleanCommas(getUserArgs())

    this.exec(this.args)

    return this
  }

  /**
    * exec
    *
    * runs the saga of reading json files and searching for a specific string
    *
    * @param  {array}     args        array of arguments
    * @return {object}                returns a glob object
    */
  exec(args = null) {
    if (!args){
      args = this.args
    }

    let files = './data/*.json'

    return readFiles(files, this.onReadFile.bind(this), this.onError.bind(this), this.onComplete.bind(this))
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
    let argWidth = getLongestArgWidth(this.args)

    let str = sorted.reduce((acc, val) => {
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
