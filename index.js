require('babel-register');
var argv = require('yargs').argv;

GLOBAL.DEVMODE = argv.dev;

if (argv._[0] == 'initdb') {
    require('./lib/initdb');
} else {
    require('./lib');
}
