/*eslint no-console: ["error", {allow: ["log"]}] */

var validate = require('./index.js')
var colors = require('colors/safe')
var fs = require('fs')
const remoteFiles = require('./utils/files/remoteFiles')

module.exports = function(dir, options) {
  if (fs.existsSync(dir)) {
    validate.BIDS(dir, options, function(issues, summary) {
      if (options.json) {
        console.log(JSON.stringify({ issues, summary }))
      } else {
        console.log(validate.consoleFormat.issues(issues, options) + '\n')
        console.log(validate.consoleFormat.summary(summary, options))
      }
      if (issues.errors.length >= 1) {
        process.exit(1)
      }
    })
  } else {
    console.log(colors.red(dir + ' does not exist'))
    process.exit(2)
  }
}
