if (process.getuid() != 0) {
  console.error('Kaixo Test runner is expected to run as root')
  process.exit(1)
}

require('shelljs/global')

var tap = require('tap')
var fs = require('fs')
var request = require('request')
var test = tap.test
var home = process.env.HOME + '/.kaixo/'
var parser = require('../server/tasks/parser')

fs.writeFileSync(__dirname + '/Fixtures/hosts/kaixo.local', __dirname + '/Fixtures/kaixo.local', 'utf8')
var servert = require('./Fixtures/kaixo.dev')

test('Kaixo test runner', function (t){
  var kaixo = require('../')
  t.test('setting up test server', function (t){
    servert.listen(3020, function (){
      t.equal(this.address().port, 3020, 'ports should match')
    })
    t.end()
  })
  mkdir('-p', process.env.HOME + '/.kaixo')
  cp('-f', __dirname + '/Fixtures/hosts/*', home)
  
  t.test('hosts files are propetly copied', function (t){
    var _home = fs.readdirSync(home)
    t.ok(!!~_home.indexOf('kaixo.local'), 'kaixo.local must be in ~/.kaixo')
    t.ok(!!~_home.indexOf('kaixo.dev'), 'kaixo.dev must be in ~/.kaixo')
    t.end()
  })
  t.test('hosts files are propertly added to /etc/hosts', function (t){
    var hosts = parser.parse(fs.readFileSync(global.cfg.hostsfile, 'utf8'))
    t.ok('kaixo.local' in hosts, 'kaixo.local must be in  /etc/hosts')
    t.ok('kaixo.dev' in hosts, 'kaixo.dev must be in /etc/hosts')
    t.end()
  })
  t.test('testing kaixo.local', function (t){
    request('http://kaixo.local/', function (err, res){
      t.equal(res.body, '<h1>Kaixo Test</h1>', 'Response should be html')
      t.equal(res.headers['content-type'].indexOf('text/html'), 0, 'response should have text/html as mime')
      t.end()
    })  
  })
  kaixo.on('hosts:new', console.log)
  t.test('testing kaixo.dev', function (t){
    request('http://kaixo.dev/', function (err, res){
      t.equal('Kaixo_test', res.body, 'response should be equal')
      t.end()
    })  
  })
  
  setTimeout(function (){
    rm('-f', process.env.HOME + '/.kaixo/kaixo.*')
    kaixo.close()
    t.end()
  }, 5*1000)
})


