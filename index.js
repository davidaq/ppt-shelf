import Hapi from 'hapi';
import {argv} from 'yargs';
import Path from 'path';
import Inert from 'inert';

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'static')
            }
        }
    }
});
server.connection({port: 8000});

server.register(Inert, () => {});

//= route active pages

server.route({
    method: 'GET',
    path: '/',
    handler(req, rep) {
        req.params.path = 'index';
        handleGet(req, rep);
    }
});

server.route({
    method: 'GET',
    path: '/p/{path*}',
    handler: handleGet
});

function handleGet(req, rep) {
    var path = req.params.path.split(/[\/\\]/);
    for (var i = 0; i < path.length; i++) {
        var c = path[i];
        if (c == '.' || !c) {
            path.splice(i, 1);
            i--;
        } else if (c == '..') {
            path.splice(i - 1, 2);
            i -= 2;
        }
    }
    path = path.join('/')
    try {
        path = require.resolve('./pages/' + path);
    } catch(e) {
        return rep('Not found: ' + path).code(404);
    }
    delete require.cache[path];
    var page = require(path);
    rep(Promise.resolve()
        .then(_ => typeof page == 'function' ? page(req) : page));
}

//= route static resources

server.route({
    method: 'GET',
    path: '/favicon.ico',
    handler: {file:'favicon.ico'}
});

server.route({
    method: 'GET',
    path: '/s/{path*}',
    handler: {
        file(req) {
            return req.params.path;
        }
    }
});

server.start(err => {
    if (err) throw err;
    console.log('Server started as: ' + server.info.uri);
});