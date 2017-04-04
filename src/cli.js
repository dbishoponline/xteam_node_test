import { getUserArgs, cleanCommas, readFiles, writeFile, countOccurs, sortByRank, getSpacing, getLongestArgWidth, trim, validateJSON, didUserRetryCommand, countTagsInFileContent, format, onError} from './helpers'

let instance = null

class CLI {

  /**
    * CLI - Command Line Interface
    * @constructor
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
    this.cached = {}
    this.cached.args = []

    this.userRetry = false

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
      if(didUserRetryCommand(this.args, this.cached.args)){
        this.userRetry = true
        this.retryCommand()
      }
      else {
        this.userRetry = false
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
  * @param  {function}   callback     triggered after the file(s) were read
  */
  getCached(callback){
    readFiles(this.cacheFile, (files, file, content, onDone) => {
      onDone(content)
    }, onError, callback)
  }

  /**
  * cacheOutput
  *
  * caches args and output by writing to a file
  *
  * @param  {function}   args       the args to be cached
  * @param  {function}   output     the output to be cached
  * @param  {function}   callback     callback triggered after the stuff is cached
  */
  cacheOutput(args, output, callback){
    let json = {
      args,
      output
    }

    writeFile(this.cacheFile, JSON.stringify(json), onError, callback)
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
        this.output = format(this.tags, this.tagCounts, this.defaultSpacing)

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
    * @param  {function}   callback   triggered when done getting the tags (either from args, or tags.txt)
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
    * @param  {function}   callback   triggered when done reading the tags from a file
    */
  loadTagsFile(callback){
    readFiles(this.tagsFile, (files, file, content, onDone) => {
      onDone(content)
    }, onError, (content) => {
      callback(content)
    })
  }

  /**
    * find
    *
    * runs the saga of finding and counting tags in an array json files and searching for a specific string
    *
    * @param  {function}   callback   triggered when done reading the data files
    */
  find(callback) {
    readFiles(this.dataFiles, this.onReadDataFile.bind(this), onError.bind(this), () => {
      callback()
    })
  }

  /**
    * onReadDataFile
    *
    * handles reading each data file and fires a callback when reading all the data files is finished
    *
    * @param  {array}      files       array of pathnames to data files
    * @param  {string}     file        the filename and path
    * @param  {string}     content     the unparsed text content in the file
    * @param  {function}   callback    triggered when done reading the tags from a file
    */
  onReadDataFile(files, file, content, callback) {
    this.files[file] = content

    if(!validateJSON(content)) {
      console.error(`Cannot parse invalid JSON in file: ${file} \n`)
    }
    else {
      countTagsInFileContent(this.tags, this.tagCounts, content)
    }

    if(Object.keys(this.files).length == files.length){
      callback(this)
    }
  }

  /**
    * echo
    *
    * displays the output to the console
    *
    */
  echo(){
    let cached = this.userRetry ? '(Cached)' : ''
    console.log(`Totals ${cached} \n${this.output}\n`)
  }
}

export default CLI
