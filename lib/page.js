
import ReactChain from './react-chain';

var vdoms = {};

export function run(path, req, rep) {
    return Promise.resolve()
        .then(_ => {
            var parts = path.substr(0, path.length - 5).split(/[\/\\]/);
            if ((parts[parts.length - 1]||'')[0] == '-')
                throw 'Not accessible';
            path = './pages/' + parts.join('/');
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

export function vdom(uuid) {
    var ret = vdoms[uuid] || 'null';
    delete vdoms[uuid];
    return ret;
}