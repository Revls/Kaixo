var http = require('http')

module.exports = http.createServer(function (req, res){
  res.end('Kaixo_test')
})
