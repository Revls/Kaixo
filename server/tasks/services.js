var shelljs = require('shelljs')
var fs = require('fs')
var service = require('./service')

module.exports = function (){
  var path = process.env.HOME + '/.kaixo'
  var hosts = fs.readdirSync(path)
  var h = {}
  hosts.forEach(function(file){
    h[file] = {
      hostname: 'localhost',
      port: fs.readFileSync(path + '/' + file, 'utf8').replace('\n','')
    }
  })
  return h
}
