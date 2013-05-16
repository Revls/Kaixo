var shell = require('shelljs')
var parser = require('./parser')

module.exports = function (file, stats){
  var hosts = shell.cat(global.cfg.hostsfile)
  var port = shell.cat(file)
  var hostname = file.split('/').pop()
  hosts = parser.parse(hosts)
  if (hostname in hosts) delete hosts[hostname]
  parser.write(hosts)
}

