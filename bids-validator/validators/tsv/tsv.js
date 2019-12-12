import utils from '../../utils'
const Issue = utils.issues.Issue
import checkAcqTimeFormat from './checkAcqTimeFormat'
import checkAge89 from './checkAge89'
import ParseTSV from './tsvParser'


/**
 * TSV
 *
 * Takes a TSV file as a string and a callback
 * as arguments. And callsback with any issues
 * it finds while validating against the BIDS
 * specification.
 */
const TSV = (file, contents, fileList, callback) => {
  const issues = []
  const stimPaths = []
  if (contents.includes('\r') && !contents.includes('\n')) {
    issues.push(
      new Issue({
        file: file,
        evidence: contents,
        code: 70,
      }),
    )
    callback(issues, null)
    return
  }

  const { Headers, Rows } = ParseTSV(contents)

  // const Rows = contents.split('\n')
  // const Headers = Rows[0].trim().split('\t')


  // generic checks -----------------------------------------------------------
 
  let columnMismatch = false
  let emptyCells = false
  let NACells = false

  // iterate Rows
  for (let i = 0; i < Rows.length; i++) {
    const row = Rows[i]
    if (columnMismatch && emptyCells && NACells) {
      break
    }

    // skip empty Rows
    if (!row || /^\s*$/.test(row)) {
      continue
    }

    const values = row.trim().split('\t')

    // check for different length Rows
    if (values.length !== Headers.length && !columnMismatch) {
      columnMismatch = true
      issues.push(
        new Issue({
          file: file,
          evidence: row,
          line: i + 1,
          code: 22,
        }),
      )
    }
    
    // iterate values
    for (let j = 0; j < values.length; j++) {
      const value = values[j]
      if (columnMismatch && emptyCells && NACells) {
        break
      }

      if (value === '' && !emptyCells) {
        emptyCells = true
        // empty cell should raise an error
        issues.push(
          new Issue({
            file: file,
            evidence: row,
            line: i + 1,
            reason: 'Missing value at column # ' + (j + 1),
            code: 23,
          }),
        )
      } else if (
        (value === 'NA' ||
          value === 'na' ||
          value === 'nan' ||
          value === 'NaN') &&
        !NACells
      ) {
        NACells = true
        // check if missing value is properly labeled as 'n/a'
        issues.push(
          new Issue({
            file: file,
            evidence: row,
            line: i + 1,
            reason: 'Missing value at column # ' + (j + 1),
            code: 24,
          }),
        )
      }
    }
  }

  // specific file checks -----------------------------------------------------
  const checkheader = function checkheader(headername, idx, file, code) {
    if (Headers[idx] !== headername) {
      issues.push(
        new Issue({
          file: file,
          evidence: Headers,
          line: 1,
          character: Rows[0].indexOf(Headers[idx]),
          code: code,
        }),
      )
    }
  }

  // events.tsv
  if (file.name.endsWith('_events.tsv')) {
    if (Headers.length == 0 || Headers[0] !== 'onset') {
      issues.push(
        new Issue({
          file: file,
          evidence: Headers,
          line: 1,
          code: 20,
        }),
      )
    }
    if (Headers.length == 1 || Headers[1].trim() !== 'duration') {
      issues.push(
        new Issue({
          file: file,
          evidence: Headers,
          line: 1,
          code: 21,
        }),
      )
    }

    // create full dataset path list
    const pathList = []
    for (let f in fileList) {
      pathList.push(fileList[f].relativePath)
    }

    // check for stimuli file
    const stimFiles = []
    if (Headers.indexOf('stim_file') > -1) {
      for (let k = 0; k < Rows.length; k++) {
        const stimFile = Rows[k].trim().split('\t')[
          Headers.indexOf('stim_file')
        ]
        const stimPath = '/stimuli/' + stimFile
        if (
          stimFile &&
          stimFile !== 'n/a' &&
          stimFile !== 'stim_file' &&
          stimFiles.indexOf(stimFile) == -1
        ) {
          stimFiles.push(stimFile)
          stimPaths.push(stimPath)
          if (pathList.indexOf(stimPath) == -1) {
            issues.push(
              new Issue({
                file: file,
                evidence: stimFile,
                reason:
                  'A stimulus file (' +
                  stimFile +
                  ') was declared but not found in /stimuli.',
                line: k + 1,
                character: Rows[k].indexOf(stimFile),
                code: 52,
              }),
            )
          }
        }
      }
    }
  }

  // participants.tsv
  let participants = null
  if (
    file.name === 'participants.tsv' ||
    file.relativePath.includes('phenotype/')
  ) {
    const participantIdColumn = Headers.indexOf('participant_id')
    if (participantIdColumn === -1) {
      issues.push(
        new Issue({
          file: file,
          evidence: Headers.join('\t'),
          line: 1,
          code: 48,
        }),
      )
    } else {
      participants = []
      for (let l = 1; l < Rows.length; l++) {
        const row = Rows[l].trim().split('\t')
        // skip empty Rows
        if (!row || /^\s*$/.test(row)) {
          continue
        }
        const participant = row[participantIdColumn].replace('sub-', '')
        if (participant == 'emptyroom') {
          continue
        }
        participants.push(participant)
      }
    }
  }

  // channels.tsv
  if (
    file.relativePath.includes('/meg/') &&
    file.name.endsWith('_channels.tsv')
  ) {
    checkheader('name', 0, file, 71)
    checkheader('type', 1, file, 71)
    checkheader('units', 2, file, 71)
  }

  if (
    file.relativePath.includes('/eeg/') &&
    file.name.endsWith('_channels.tsv')
  ) {
    checkheader('name', 0, file, 71)
    checkheader('type', 1, file, 71)
    checkheader('units', 2, file, 71)
  }

  if (
    file.relativePath.includes('/ieeg/') &&
    file.name.endsWith('_channels.tsv')
  ) {
    checkheader('name', 0, file, 72)
    checkheader('type', 1, file, 72)
    checkheader('units', 2, file, 72)
    checkheader('low_cutoff', 3, file, 72)
    checkheader('high_cutoff', 4, file, 72)
  }

  // electrodes.tsv
  if (
    file.relativePath.includes('/eeg/') &&
    file.name.endsWith('_electrodes.tsv')
  ) {
    checkheader('name', 0, file, 96)
    checkheader('x', 1, file, 96)
    checkheader('y', 2, file, 96)
    checkheader('z', 3, file, 96)
  }

  if (
    file.relativePath.includes('/ieeg/') &&
    file.name.endsWith('_electrodes.tsv')
  ) {
    checkheader('name', 0, file, 73)
    checkheader('x', 1, file, 73)
    checkheader('y', 2, file, 73)
    checkheader('z', 3, file, 73)
    checkheader('size', 4, file, 73)
  }

  // check partcipants.tsv for age 89+

  if (file.name === 'participants.tsv') {
    checkAge89(Rows, file, issues)
  }

  if (file.name.endsWith('_scans.tsv')) {
    // check _scans.tsv for column filename
    if (!(Headers.indexOf('filename') > -1)) {
      issues.push(
        new Issue({
          line: 1,
          file: file,
          evidence: Headers.join('\t'),
          code: 68,
        }),
      )
    }

    // if _scans.tsv has the acq_time header, check datetime format
    if (Headers.indexOf('acq_time') > -1) {
      checkAcqTimeFormat(Rows, file, issues)
    }
  }

  callback(issues, participants, stimPaths)
}

export default TSV