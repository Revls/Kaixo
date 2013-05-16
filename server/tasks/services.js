var shelljs = require('shelljs')
var fs = require('fs')
var service = require('./service')
var cfg = global.cfg

module.exports = function (){
  var addService = require('./static')()
  var path = cfg.services
  var hosts = fs.readdirSync(path)
  var h = {}
  hosts.forEach(function(file){
    if (file.indexOf('.') == 0) return
    h[file] = {
      hostname: 'localhost',
      port: fs.readFileSync(path + '/' + file, 'utf8').replace('\n','')
    }
    if (isNaN(+h[file].port)) {
      addService({ hostname: file, dir: h[file].port })
      h[file].port = cfg.staticport
    }
  })
  return h
}
