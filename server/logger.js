var Minilog = require('minilog'),
    consoleBackend = Minilog.backends.nodeConsole;

Minilog.pipe(consoleBackend).format(consoleBackend.formatColor);

module.exports = function (){
  var logger = global.logger = Minilog('Kaixo')
  return logger
}

