var http = require('http')
  , ecstatic = require('ecstatic')
  , sites = {}

var server = http.createServer(function (req, res){
  var name = req.headers.host
  if (sites[name]) return sites[name](req, res)
  res.statusCode = 404
  res.end('not found in this server')
})



function addPlace(site){
  site.hostname = site.hostname.split('/').pop()
  site.dir = site.dir.replace('\n','').trim()
  sites[site.hostname] = ecstatic(site.dir, {
    autoIndex: true,
    defaultExt: 'html'
  })
}

module.exports = function (cfg){
  server.listen(+cfg.staticport || 2010, function (){
    console.log('::keixo static createServer running on %d', cfg.staticport = this.address().port)
  })
  return addPlace
}
