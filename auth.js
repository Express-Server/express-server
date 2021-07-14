const sha256 = require('crypto-js/sha256')

const hashPassword = (password, salt) => 
  sha256(password + salt).toString()

module.exports = {hashPassword}