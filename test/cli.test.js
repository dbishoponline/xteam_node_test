import test from 'ava'

import { getUserArgs, cleanCommas, readFiles, countOccurs, sortByRank, getSpacing, getLongestArgWidth } from '../src/helpers'

test(`readFiles() should return null if "files" argument is empty string`, t => {
  let res = readFiles("", () => {}, () => {}, () => {})

  t.is(res.length, 0)
})

test(`readFiles() should return an array of file paths`, t => {
  let res = readFiles('../data/*.json', () => {}, () => {}, () => {})

  t.is(res.length, 0)
})

// test('bar', async t => {
// 	const bar = Promise.resolve('bar');
//
// 	t.is(await bar, 'bar');
// });
