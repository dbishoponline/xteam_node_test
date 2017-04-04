import { getUserArgs, cleanCommas, readFiles, writeFile, countOccurs, sortByRank, getSpacing, getLongestArgWidth, trim, validateJSON } from './helpers'

let instance = null

class CLI {

  /**
    * constructor
    *
    * constructs the CLI and triggers the finduted command
    *
    * @return {object}           returns an instance of self
    */
  constructor() {

    // the user input arguments
    this.args = getUserArgs()

    // the formatted output which will be logged to console
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

    // the path to the cache file
    this.cacheFile = './cached.json'

    // object to store the cacheFile content
    this.cached = {
      args: null,
      output: null,
    }

    // initialize the utility
    return this.init()
  }

  /**
    * init
    *
    * initializes the utility and begins the Find workflow
    *
    * @return {object}           returns an instance of self
    */
  init(){

    // get the cached data
    this.getCached((content) => {

      this.cached = content.length ? JSON.parse(content) : {}

      // check to see if the same command was rerun by the user
      if(this.didUserRetryCommand()){
        this.retryCommand()
      }
      else {
        this.newCommand()
      }
    })

    return this
  }

  /**
  * getCached
  *
  * loads the data from the cache file
  *
  */
  getCached(callback){
    readFiles(this.cacheFile, (files, file, content, onDone) => {
      onDone(content)
    }, this.onError, callback)
  }

  /**
  * cacheOutput
  *
  * caches args and output by writing to a file
  *
  */
  cacheOutput(args, output, callback){
    let json = {
      args,
      output
    }

    writeFile(this.cacheFile, JSON.stringify(json), this.onError, callback)
  }

  /**
  * didUserRetryCommand
  *
  * returns a boolean if the user retried the CLI command with the same arguments
  *
  * @return {boolean}           returns true if the new arguments match the cache arguments
  */
  didUserRetryCommand(){
    return this.args.toString() === this.cached.args.toString()
  }

  /**
    * newCommand
    *
    * gets the tags, counts how many times they show up in files, then output to screen
    *
    */
  newCommand(){

    // gets an array of tags either from args or default tags file
    this.getTags((tags) => {
      this.tags = tags

      // searches and counts tags in the data files
      this.find(() => {

        // parses the tagCounts into formatted string
        this.output = this.format(this.tagCounts)

        // cache the args and output
        this.cacheOutput(this.args, this.output, () => {
          // then display the counts to screen
          this.echo()
        })
      })
    })
  }

  /**
    * retryCommand
    *
    * displays the cached output
    *
    */
  retryCommand(){
    this.output = this.cached.output
    this.echo()
  }

  /**
    * getTags
    *
    * gets the defaults tags
    *
    */
  getTags(callback){
    // if user args exist, use as the tags
    if(this.args.length){
      callback(cleanCommas(this.args))
      return
    }

    // else load tags from ../tags.txt
    this.loadTagsFile((content) => {
      callback(trim(content).split('\n'))
      return
    })
  }

  /**
    * loadTagsFile
    *
    * loads the data from the tags file
    *
    */
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
    */
  find(callback) {
    readFiles(this.dataFiles, this.onReadDataFile.bind(this), this.onError.bind(this), () => {
      callback()
    })
  }

  /**
    * onReadDataFile
    *
    * runs the saga of finding and counting tags in an array json files and searching for a specific string
    *
    */
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

  /**
    * onError
    *
    * runs the saga of finding and counting tags in an array json files and searching for a specific string
    *
    */
  onError(err, file) {
    throw `Something went wrong trying to read the file: ${file}. \n Error Message: ${err}`
  }

  /**
    * find
    *
    * runs the saga of finding and counting tags in an array json files and searching for a specific string
    *
    */
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

  /**
    * find
    *
    * runs the saga of finding and counting tags in an array json files and searching for a specific string
    *
    */
  format(counts){
    let sorted = sortByRank(counts)
    let argWidth = getLongestArgWidth(this.tags)

    return sorted.reduce((acc, val) => {
      let spacing = getSpacing(argWidth + this.defaultSpacing, val[0], val[1])

      return `${acc}\n${val[0]}${spacing}${val[1]}`
    }, '')
  }

  /**
    * find
    *
    * runs the saga of finding and counting tags in an array json files and searching for a specific string
    *
    */
  echo(){
    console.log(`
      ${this.output}
    `)
  }
}

export default CLI
