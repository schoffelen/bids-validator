/*
 * TSV
 * Module for parsing TSV (and eventually other formats)
 */

function parseTSV(contents) {
  let content = {
    headers: [],
    rows: [],
  }
  content.rows = contents
    .trim()
    .split('\n')
    .filter(row => row && !/^\s*$/.test(row))
    .map(row => row.trim().split('\t'))
  content.headers = content.rows.length ? content.rows[0] : []

  return {
    headers: content.headers,
    rows: content.rows,
  }
}
module.exports = parseTSV
