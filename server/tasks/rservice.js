var shell = require('shelljs')
var parser = require('./parser')

module.exports = function(hosts){
  return function (file, stats){
    hosts = shell.cat('/etc/hosts')
    var port = shell.cat(file)
    var hostname = file.split('/').pop()
    hosts = parser.parse(hosts)
    if (hostname in hosts) delete hosts[hostname]
    parser.write(hosts)
  }
}
