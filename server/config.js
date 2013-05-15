var fs = require('fs')
var path = require('path')

var home = process.env.HOME

var locations = [
  path.join(home, '.kaixo', '.kaixorc'),
  path.join(home, '.kaixorc')
]

function parseCfg(){
  var file, cfg
  if (fs.existsSync(locations[0])) file = locations[0]
  else if (fs.existsSync(locations[1])) file = locations[1]
  else cfg = {
    staticport: 8082,
    notfoundmsg: '::Kaixo server not found',
    hostsfile: '/etc/hosts'
  }
  cfg = file ? fs.readFileSync(file, 'utf8') : cfg
  if (typeof cfg === 'string') {
    var lines = cfg.split('\n')
    cfg = {}
    lines.forEach(function (line){
      line = line.split(/\:/)
      line = line.filter(function(t){
        if (t == '' || t == ' ') return false
        return true
      })
      if (line.length) cfg[line[0]] = line[1].trim()
    }) 
  }
  return cfg
}

module.exports = parseCfg()
