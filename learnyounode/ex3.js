var fs = require('fs')

var path = process.argv[2]

var text = fs.readFileSync(path, 'utf8')

var numNewLines = text.split("\n").length - 1
console.log(numNewLines)
