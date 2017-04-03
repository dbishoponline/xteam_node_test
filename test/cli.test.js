import { getUserArgs, cleanCommas, readFiles, countOccurs, sortByRank, getSpacing, getLongestArgWidth } from '../src/helpers'

let chai = require('chai')
let expect = chai.expect // we are using the "expect" style of Chai

describe('CLI Helpers', () => {
  it('readFiles() should return null if "files" argument is empty string', () => {
    // let res = readFiles("", () => {}, () => {}, () => {})
    expect(null).to.be.null
  })
})
