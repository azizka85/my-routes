const { createHash } = require("crypto");

/**
 * @param {string} text 
 * @returns {string}
 */
function generateMD5Hash(text) {
  return createHash('md5')
    .update(text)
    .digest('base64');
}

module.exports = {
  generateMD5Hash
};
