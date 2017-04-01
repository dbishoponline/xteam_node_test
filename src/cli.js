import { readFiles, countOccurs, sortByRank } from './helpers'

let instance = null

class CLI {

  constructor(options = {}) {

    if(!instance){
      instance = this
    }

    this.counts = []

    let args = this.getUserArgs()

    this.exec(args)

    return instance
  }

  getUserArgs() {
    return process.argv.length ? process.argv.slice(2) : null
  }

  exec(args) {

    let output = ``

    args.forEach((arg) => {
      let name = arg.replace(',', '')
      let files = './data/*.json'

      readFiles(files, name, this.onReadFile.bind(this), this.onError.bind(this), () => {
        this.echo()
      })
    })

    return output
  }

  onReadFile(file, str, data) {
    // var obj = JSON.parse(data)
    if(typeof this.counts[str] == 'undefined' ) {
      this.counts[str] = countOccurs(str, data)
    }
    else {
      this.counts[str] += countOccurs(str, data)
    }
  }

  onError(err) {
    throw(`Failed to read files ${err}`)
  }

  echo(){
    console.log('COUNTS:', this.counts)
    var sorted = sortByRank(this.counts)

    var str = sorted.reduce((acc, val) => {
      return `
        ${acc}
        - ${val.name}       ${val.count}
      `
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
