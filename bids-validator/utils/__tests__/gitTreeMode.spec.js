const { assert } = require('chai')
const { readLsTreeLines } = require('../files/readDir')

describe('gitTreeMode functions', () => {
  describe('readLsTreeLines', () => {
    it('will handle regular files', () => {
      const lsTreeLines = [
        '100644 blob 1a06300a935e009fadcf37f040f6108fe0dd25c7    8196\tsub-01/ses-01/.DS_Store',
        '100644 blob 5a947f0b20716f7f617423a01e1e10bd01387f87     352\tsub-01/ses-01/anat/sub-01_ses-01_T1w.nii',
      ]
      const expected = {
        files: [
          {
            path: 'sub-01/ses-01/.DS_Store',
            size: 8196,
            id: '597b563708ec180199eb18e129a0ddf759b9128d',
            key: '1a06300a935e009fadcf37f040f6108fe0dd25c7',
          },
          {
            path: 'sub-01/ses-01/anat/sub-01_ses-01_T1w.nii',
            size: 352,
            id: 'ce05ee22099234e1c21a267b5d13cc1cc3da23ef',
            key: '5a947f0b20716f7f617423a01e1e10bd01387f87',
          },
        ],
        symlinkFilenames: [],
        symlinkObjects: [],
      }
      assert.deepEqual(readLsTreeLines(lsTreeLines), expected)
    })

    it('will handle symlinked files', () => {
      const lsTreeLines = [
        '120000 blob e886cd8566b5e97db1fc41bb9364fc22cbe81426     199\tsub-01/ses-01/anat/sub-01_ses-01_T1w.nii',
        '120000 blob e2cd091677489a0377d9062347c32d3efebf4322     199\tsub-01/ses-01/func/sub-01_ses-01_task-nback_run-01_bold.nii',
      ]
      const expected = {
        files: [],
        symlinkFilenames: [
          'sub-01/ses-01/anat/sub-01_ses-01_T1w.nii',
          'sub-01/ses-01/func/sub-01_ses-01_task-nback_run-01_bold.nii',
        ],
        symlinkObjects: [
          'e886cd8566b5e97db1fc41bb9364fc22cbe81426',
          'e2cd091677489a0377d9062347c32d3efebf4322',
        ],
      }
      assert.deepEqual(readLsTreeLines(lsTreeLines), expected)
    })
  })
})
