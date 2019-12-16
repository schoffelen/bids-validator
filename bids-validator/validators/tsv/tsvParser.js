/*
 * TSV
 * Module for parsing TSV (and eventually other formats)
 */

function parseTSV(contents) {
  let content = {
    headers: [],
    rows: [],
  }
  var trimSplit = separator => str => str.trim().split(separator)
  var isContentfulRow = row => row && !/^\s*$/.test(row)
  content.rows = trimSplit('\n')(contents)
    .filter(isContentfulRow)
    .map(trimSplit('\t'))
  content.headers = content.rows.length ? content.rows[0] : [] 
  return {
    headers: content.headers,
    rows: content.rows,
  }
}
module.exports = parseTSV
