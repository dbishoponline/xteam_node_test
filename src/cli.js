import { readFiles, countOccurs, sortByRank } from './helpers'

let instance = null

class CLI {

  constructor(options = {}) {

    if(!instance){
      instance = this
    }

    this.counts = []
    this.files = null
    this.filesSearched = 0

    this.args = this.stripCommas(this.getUserArgs())

    this.exec(this.args)
    //
    // return instance
  }

  getUserArgs() {
    return process.argv.length ? process.argv.slice(2) : null
  }

  stripCommas(args) {
    return args.map((arg) => {
      return arg.replace(',', '')
    })
  }

  exec(args = null) {
    if (!args){
      args = this.args
    }

    let files = './data/*.json'

    this.files = readFiles(files, this.onReadFile.bind(this), this.onError.bind(this), this.onComplete.bind(this))
  }



  onReadFile(file, data, callback) {
    // var obj = JSON.parse(data)
    this.args.forEach((arg) => {
      if(typeof this.counts[arg] == 'undefined' ) {
        this.counts[arg] = countOccurs(arg, data)
      }
      else {
        this.counts[arg] += countOccurs(arg, data)
      }
    })

    console.log(this.filesSearched, this.args.length, this.counts)

    callback.call(this)
  }



  onError(err) {
    throw(`Failed to read files ${err}`)
  }




  onComplete(){
    this.filesSearched++
    if(this.filesSearched == this.files.length){
      console.log(this.filesSearched, this.args.length, this.counts)
      this.echo.call(this)
      return
    }
    return
  }




  echo(){
    console.log('COUNTS:', this.counts)
    // var sorted = sortByRank(this.counts)
    //
    // var str = sorted.reduce((acc, val) => {
    //   return `
    //     ${acc}
    //     - ${val.name}       ${val.count}
    //   `
    // }, '')
    //
    // console.log(`
    //   ${str}
    // `)

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
