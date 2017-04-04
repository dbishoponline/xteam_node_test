import { getUserArgs, cleanCommas, readFiles, countOccurs, sortByRank, getSpacing, getLongestArgWidth, trim, validateJSON } from './helpers'

let instance = null

class CLI {

  /**
    * CLI.constructor
    *
    * constructs the CLI and triggers the finduted command
    *
    * @return {object}           returns an instance of self
    */
  constructor() {
    this.output = ''

    // an array of files that will be searched
    this.files = {}

    // an array of files that were invalid json
    this.filesInvalid = []

    // an object of counts for each tag
    this.tagCounts = {}

    // the default amount of spaces between each row's label (left) and count (right)
    this.defaultSpacing = 5

    // file with default tags that will be searched if user does not specific any arguments
    this.tagsFile = '**/tags.txt'

    // the path to files that will be searched
    this.dataFiles = './data/*.json'

    // gets an array of tags either from args or default tags file
    this.getTags((tags) => {
      this.tags = tags

      // searches and counts tags in the data files, then displays count to screen
      this.find(() => {
        this.echo(this.tagCounts)
      })
    })

    // returns an instance of self
    return this
  }

  getTags(callback){
    this.args = cleanCommas(getUserArgs())

    // if user args exist, use as the tags
    if(this.args.length){
      callback(this.args)
    }

    // else load tags from ../tags.txt
    else {
      this.loadTagsFile((content) => {
        callback(trim(content).split('\n'))
      })
    }
  }

  loadTagsFile(callback){
    readFiles(this.tagsFile, (files, file, content, onDone) => {
      onDone(content)
    }, this.onError, (content) => {
      callback(content)
    })
  }

  /**
    * find
    *
    * runs the saga of finding and counting tags in an array json files and searching for a specific string
    *
    * @return {object}                returns a glob object
    */
  find(callback) {
    readFiles(this.dataFiles, this.onReadDataFile.bind(this), this.onError.bind(this), () => {
      callback()
    })
  }

  onReadDataFile(files, file, content, callback) {
    this.files[file] = content

    if(!validateJSON(content)) {
      this.filesInvalid.push(file)
      console.error(`Cannot parse invalid JSON in file: ${file}`)
    }
    else {
      this.countTagsInFileContent(content)
    }

    if(Object.keys(this.files).length == files.length){
      callback(this)
    }
  }


  onError(err, file) {
    throw(`Failed to read files ${err}: ${file}`)
  }

  countTagsInFileContent(content){
    this.tags.forEach((arg) => {
      if(typeof this.tagCounts[arg] == 'undefined' ) {
        this.tagCounts[arg] = countOccurs(arg, content)
      }
      else {
        this.tagCounts[arg] += countOccurs(arg, content)
      }
    })

    return this.tagCounts
  }

  echo(counts){
    let sorted = sortByRank(counts)
    let argWidth = getLongestArgWidth(this.tags)

    this.output = sorted.reduce((acc, val) => {
      let spacing = getSpacing(argWidth + this.defaultSpacing, val[0], val[1])

      return `${acc}\n${val[0]}${spacing}${val[1]}`
    }, '')

    console.log(`
      ${this.output}
    `)
  }

  onError(err, file) {
    throw `Something went wrong trying to read the file: ${file}. \n Error Message: ${err}`
  }
}

export default CLI
