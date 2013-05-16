var fs = require('fs')
var http = require('http')
var path = require('path')

var cfg = global.cfg = require('./config')
var logger = require('./logger')('Kaixo')
var monitor = require('watch')
var Proxy = require('http-proxy')
var tasks = require('./tasks')



var port = +process.env.PORT || 80
var home = process.env.HOME
var cfgn = path.join(home, '.kaixo')
var hosts = tasks.loadServices()

monitor.createMonitor(cfgn, function (monitor) {
  monitor.on('created', tasks.createService)
  monitor.on('changed', tasks.restartService)
  monitor.on('removed', tasks.removeService)
  monitor.on('created', function (file){
    hosts = tasks.loadServices()
  })
})

tasks.createService.on('hosts', function (_hosts){
  hosts = _hosts
})

Proxy.createServer(function (req, res, proxy){
  var hostname = req.headers.host
  if (hostname in hosts && hosts[hostname].port) {
    logger.debug('Host: ' + hostname + ' -- Port: ' + hosts[hostname].port)
    return proxy.proxyRequest(req, res, {
       host: 'localhost',
       port: hosts[hostname].port
     })
  }
  res.end('::Kaixo service is ready')
}).listen(port, function (){
  logger.info('::Kaixo server is ready')
})

function log(){
  process.stdout.write.apply(process.stdout, arguments)
  process.stdout.write('\n')
}
