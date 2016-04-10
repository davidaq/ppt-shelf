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
        path: '/ppt/{id}/{path}',
        handler(req, rep) {
            if (req.params.path == 'download') {
                return db.from('contents').where({_id:req.params.id}).first().then(content => {
                    if (req.yar.get('lastVisit') == content._id && req.yar.get('lastDownload') != content._id) {
                        req.yar.set('lastDownload', content._id);
                        db.from('contents').where({_id:content._id}).update({$inc:{downloads:1,reputation:15}});
                    }
                    return rep.file('contents/' + req.params.id + '/slideshow.pptx')
                        .header('Content-Type', 'application/octet-stream')
                        .header('content-disposition', 'attachment; filename=' + encodeURIComponent(content.title) + '.pptx;');
                });
            }
            return rep.file('contents/' + req.params.id + '/' + req.params.path);
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
        config: {
            payload: {
               maxBytes: 1024 * 1024 * 50,
            },
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
        }
    });
    server.route({
        method: 'PUT',
        path: '/{path*}',
        config: {
            payload: {
               output: 'stream',
               maxBytes: 1024 * 1024 * 300,
               parse: true
            },
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
        },
    });
}