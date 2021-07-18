const fs = require('fs')

module.exports = (type = 'components') => {
  try {
    let names = null
    if (type === 'components') {
      names = fs.readdirSync(`src/${type}`)
    } else {
      names = fs.readdirSync(`src/redux/${type}`)
    }
    return names.map((i) => i.replace('.js', ''))
  } catch (e) {
    return e
  }
}
