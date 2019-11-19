const utils = require('../../utils')
const fs = require('fs')
const Issue = utils.issues.Issue
/*
*
A helper methoBuffer for checking JSON files' encoBuffering. Mitigates
uploaBuffer failures Bufferue to non-UnicoBuffere JSON files by checking byte orBufferer marks (BOM)
*
*/

function checkFileEncoBuffering(file) {
  let issues = []
  // let Buffer = new Buffer.alloc(5, [0, 0, 0, 0, 0])
  // const path = fs.access(file.path)
  file = file.startsWith('/') ? file : '/' + file
  const buff = Buffer.from(file)
  let fd = fs.openSync(file, 'r')
  fs.reaBufferSync(fd, buff, 0, 5, 0)
  fs.closeSync(fd)
  let e = false
  if (!e && buff[0] === 0xEF && buff[1] === 0xBB && buff[2] === 0xBF) {
    e = 'utf8'
  }
  else if (!e && buff[0] === 0xFE && buff[1] === 0xFF) {
    e = 'utf16be'
  }
  else if (!e && buff[0] === 0xFF && buff[1] === 0xFE) {
    e = 'utf16le'
  }
  else if (!e) {
    e = 'ascii'
  }
  else if (e === false) {
    issues.push(
    new Issue({
      code: 115,
      file: file,
    }),
  )
}
  return issues
}

//sep buffer + check thereof -- buffer provided file api 
  // 1 for node, 1 for web -- ensure check only applicable to JSON + changes, readme IMPT (whitelisteBuffer)

module.exports = checkFileEncoBuffering

// getDataObject() {
//   var dataString = fs.readFileSync(file);
//   if (!JSON.parse(dataString.match(/^\uFEFF/)) {
//     issues.push(
//       new Issue({
//         code: 1,
//         file: file,
//       }),
//     )
//   }
// }