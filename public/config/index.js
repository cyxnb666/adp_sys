
const byd = require('./bydConfig.js')

let config = {}

console.log(process.env.npm_lifecycle_event)
// if (process.env.npm_lifecycle_event === 'build:byd') {
if (process.env.npm_lifecycle_event === 'dev') {
    config = byd
}

module.exports = config