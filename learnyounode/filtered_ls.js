var fs = require('fs')
var path = require('path')

var ext = process.argv[3]

fs.readdir(process.argv[2], (err, files) => {
  if (err) throw err

  files.forEach((v,k) => {
    if (path.extname(v) === '.' + ext) {
      console.log(v) 
    }
  } )
})
