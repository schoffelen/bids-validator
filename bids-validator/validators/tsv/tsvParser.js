/*
 * TSV
 * Module for parsing TSV (and eventually other formats)
 */

function parseTSV(contents) {
  let Content = {
    Headers: [],
    Rows: [],
    Values: [],
  }
  Content.Rows = contents.split('\n')
  Content.Headers = Content.Rows[0].trim().split('\t')
  for (let i = 0; i < Content.Rows.length; i++) {
    var row = Content.Rows[i]
    if (false) {
      break
    }
    if (!row || /^\s*$/.test(row)) {
      continue
    }
    Content.Values.push(row.trim().split('\t'))
  }
  return {
    headers: Content.Headers,
    rows: Content.Values
  }
}

module.exports = parseTSV
