var http = require('http')
var ecstatic = require('ecstatic')

var log = global.logger
var sites = {}
var called = false

var server = http.createServer(function (req, res){
  var name = req.headers.host
  if (sites[name]) return sites[name](req, res)
  res.statusCode = 404
  res.end('not found in this server')
})

function addPlace(site){
  site.hostname = site.hostname.split('/').pop()
  site.dir = site.dir.replace('\n','').trim()
  log.debug('new static site: "' + site.hostname + '" for: ' + site.dir)
  sites[site.hostname] = ecstatic(site.dir, {
    autoIndex: true,
    defaultExt: 'html'
  })
}

module.exports = function (cfg){
  if (!called) {
    called = true
    server.listen(+cfg.staticport || 2010, function (){
      log.info('::keixo static createServer running on '
        + (cfg.staticport = this.address().port))
    })
  }
  return addPlace
}
