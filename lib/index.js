import Hapi from 'hapi';
import {argv} from 'yargs';
import Path from 'path';
import ReactChain from './react-chain';
import './widgets';

GLOBAL.DEVMODE = argv.dev;

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '..')
            }
        }
    }
});
server.connection({port: 8000});

server.register(require('inert'), e => {});
server.register({register:require('yar'), options:{
    storeBlank: false,
    cookieOptions: {
        password: '',
        isSecure: false
    }
}});

//= route GET

var vdoms = {};
server.route({
    method: 'GET',
    path: '/page-vdom/{uuid}',
    handler(req, rep) {
        rep('window.initialVDom=' + (vdoms[req.params.uuid] || 'null'));
        delete vdoms[req.params.uuid];
    }
});
server.route({
    method: 'GET',
    path: '/widgets/{path}',
    handler(req, rep) {
        return rep.file('widgets/' + req.params.path + '.js');
    }
});
server.route({
    method: 'GET',
    path: '/{path*}',
    handler(req, rep) {
        var path = req.params.path || 'index.page';
        var ext = path.match(/\.([a-z]*?)$/);
        ext = ext ? ext[1] : '';
        switch(ext) {
        case 'page':
            return runPage(path, req, rep);
        case 'ico':
        case 'jpg':
        case 'png':
        case 'js':
        case 'css':
        case 'html':
        case 'ttf':
            return rep.file('static/' + path);
        }
        return rep('Not found').code(404);
    }
});
server.route({
    method: 'POST',
    path: '/{path*}',
    handler(req, rep) {
        var path = req.params.path || 'index.page';
        var ext = path.match(/\.([a-z]*?)$/);
        ext = ext ? ext[1] : '';
        switch(ext) {
        case 'page':
            return runPage(path, req, rep);
        }
        return rep('Not found').code(404);
    }
});

function runPage(path, req, rep) {
    return Promise.resolve()
        .then(_ => {
            path = './pages/' + path.substr(0, path.length - 5).split(/[\/\\]/).join('/');
            return ReactChain(<include path={path} request={req}/>);
        }).then(result => {
            if (result && typeof result == 'object' && typeof result.vdom == 'string' && typeof result.html == 'string') {
                vdoms[result.uuid] = result.vdom;
                setTimeout(() => delete vdoms[result.uuid], 30000);
                rep(result.html);
            } else {
                rep(result);
            }
        }).catch(e => {
            if (e && typeof e == 'object') {
                if (e.$redirect) {
                    return rep.redirect(e.$redirect);
                }
            }
            e = e.stack || e;
            console.error(e);
            rep('<pre>' + e.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>').code(500);
        });
}

server.start(err => {
    if (err) throw err;
    console.log('Server started as: ' + server.info.uri);
});