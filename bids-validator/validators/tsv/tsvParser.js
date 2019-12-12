/*
 * TSV
 * Module for parsing TSV (and eventually other formats)
 */

// remove falsy val from content arr
// for (var i = 0; i < rows.length; i++) {
//   if (rows[i].trim().split('\t') == 0) {
//     rows[i] = ''
//   }
// }

function ParseTSV(contents) {
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
  // const values = row.trim().split('\t')
  return Content
}

module.exports = ParseTSV
