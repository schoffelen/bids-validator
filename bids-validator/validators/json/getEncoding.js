const utils = require('../../utils')
const fs = require('fs')
const Issue = utils.issues.Issue
/*
*
A helper method for checking JSON files' encoding type against high-probability indicators of Unicode. Mitigates
upload failures  to non-Unicode JSON files by checking for byte order mark (BOM) in the buffer
*
*/

//node fs module check
function unicodeCheckNode(file) {
  let issues = []
  let buffer = new Buffer.alloc(5, [0, 0, 0, 0, 0])
  let fd = fs.openSync(file, 'r')
  fs.readBufferSync(fd, buff, 0, 5, 0)
  fs.closeSync(fd)
  if (buffer.isEncoding('utf8') || buffer.isEncoding('utf16be') || buffer.isEncoding('utf16le') || buffer.isEncoding('ascii')) {
    return true
  } else {
    issues.push(
      new Issue({
        code: 115,
        file: file,
      }),
    )
  } return issues
}


  // let e = false
  // if (!e && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
  //   e = 'utf8'
  //   return
  // }
  // else if (!e && buffer[0] === 0xFE && buffer[1] === 0xFF) {
  //   e = 'utf16be'
  //   return
  // }
  // else if (!e && buffer[0] === 0xFF && buffer[1] === 0xFE) {
  //   e = 'utf16le'
  //   return
  // }
  // else if (e === false) {
  //   issues.push(
  //     new Issue({
  //       code: 115,
  //       file: file,
  //     }),
  //   )
  // }
  // return issues

//browser file api check
function unicodeCheckBrowser(file) {
  let fileByteArray = []
  let blob = new Blob([JSON.stringify(file)], {type : 'application/json'})
  let reader = new FileReader()
  reader.onloadend = function (evt) {
    if (evt.target.readyState == FileReader.DONE) {
      let arrayBuffer = evt.target.result
      array = new Uint8Array(arrayBuffer)
      for (let i = 0; i < array.length; i++) {
        fileByteArray.push(array[i])
      }
      console.log("test", array)
    } 
  }
}

// needs to read BOM or detect encoding

module.exports = {
  unicodeCheckNode,
  unicodeCheckBrowser
}
