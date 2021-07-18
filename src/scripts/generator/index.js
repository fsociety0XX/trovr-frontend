const config = require('./config')

/*
eslint func-names: ["error", "never"]
*/
module.exports = function (plop) {
  plop.setGenerator('component', config)
}
