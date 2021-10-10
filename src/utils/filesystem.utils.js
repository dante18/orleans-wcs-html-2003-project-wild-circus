'use strict'
const fs = require('fs')

/**
 * Returns all files whose extension matches the extension sought
 * @param path
 * @param fileExtension
 * @returns {*[]}
 */
exports.getFileListInFolder = (path, fileExtension) => {
  const contentPath = fs.readdirSync(path)
  const Files = []

  for (let i = 0; i < contentPath.length; i++) {
    const parts = contentPath[i].split('.')
    const name = parts[0]
    const extension = parts[1]

    if (extension === fileExtension) {
      Files.push(name + '.' + extension)
    }
  }

  return Files
}
