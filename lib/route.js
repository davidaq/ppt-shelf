import * as page from './page';

export default function(server) {
    var vdoms = {};
    server.route({
        method: 'GET',
        path: '/page-vdom/{uuid}',
        handler(req, rep) {
            rep('window.initialVDom=' + page.vdom(req.params.uuid));
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
                return page.run(path, req, rep);
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
                return page.run(path, req, rep);
            }
            return rep('Not found').code(404);
        }
    });
}