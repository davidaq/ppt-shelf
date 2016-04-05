import Hapi from 'hapi';
import path from 'path';
import route from './route';

import './widgets';
import './db';

GLOBAL.Lrequire = function(name) {
    return require('../' + name);
};

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: path.join(__dirname, '..')
            }
        }
    }
});
server.connection({port: 8000});

server.register(require('inert'), e => {});
server.register({register:require('yar'), options:{
    storeBlank: false,
    cookieOptions: {
        password: 'something long and boring, just to meet the minimum requirements',
        isSecure: false
    }
}});

route(server);

server.start(err => {
    if (err) throw err;
    console.log('Server started as: ' + server.info.uri);
});