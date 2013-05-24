var fs = require('fs')
var EventEmitter = require('events').EventEmitter

var shell = require('shelljs')
var parser = require('./parser')
var cfg = global.cfg
var addStaticServer = require('./static')(cfg)

module.exports = function (file, stats){
  var port = shell.cat(file)
  if (!port) return
  var hostname = file.split('/').pop()
  var hosts = shell.cat(cfg.hostsfile)
  hosts = parser.parse(hosts)
  if (isNaN(+port) && fs.existsSync(port.replace('\n','').trim())) {
    addStaticServer({ hostname: file, dir: port })
    port = cfg.staticport
  }
  hosts[hostname] = { hostname: '127.0.0.1', port: port }
  evnts.emit('hosts', hosts)
  global.hosts = hosts
  parser.write(hosts)
}


var evnts = module.exports.ev = new EventEmitter

module.exports.on = function (){
  evnts.on.apply(evnts, arguments)
}
