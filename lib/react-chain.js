import ReactDOMServer from 'react-dom/server';
import ReactX from 'react';
import {v4 as UUID} from 'uuid';
import Path from 'path';
import {widgetsContext} from './widgets';

export default function ReactChain(vdom) {
    var widgetCache = {};
    var widgets = widgetsContext();
    return processVdom(vdom, widgets).then(vdom => {
        if (isVDom(vdom)) {
            var uuid = UUID();
            var head = <head/>, body = <body/>;
            if (vdom[1] == 'html') {
                for (var i = 3; i < vdom.length; i++) {
                    var child = vdom[i];
                    if (child[1] == 'head')
                        head = child;
                    else if(child[1] == 'body')
                        body = child;
                }
            } else {
                body = vdom;
            }
            head.splice(3, 0, <script type="text/javascript" src={"/page-vdom/" + uuid}/>);
            widgets.used().map(v => {
                head.push(<script type="text/javascript" src={"/widgets/" + v}/>);
            });
            body[1] = 'div';
            body[2] = body[2] || {};
            body[2].id = '$ROOT$';
            var ret = {
                uuid,
                html: '<!DOCTYPE html>\n<html>' 
                    + toHeadHTML(head)
                    + '<body><div id="$MOUNT$">' + ReactDOMServer.renderToString(toReact(body))
                    + '</div></body></html>',
                vdom: JSON.stringify(body || 'null'),
            };
            widgets.recycle();
            return ret;
        }
        widgets.recycle();
        return vdom;
    }).catch(e => {
        widgets.recycle();
        throw e;
    })
}

GLOBAL.React = {
    createElement() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(React);
        return args;
    },
    toJSON() {
        return "$VDOM$";
    }
};

function processVdom(vdom, widgets, fromPath='') {
    if (isVDom(vdom)) {
        var source = '<' + vdom[1] + '>';
        if (vdom[2]) {
            for (var k in vdom[2]) {
                if (typeof vdom[2][k] == 'function') {
                    var uuid = UUID().replace(/-/g, '');
                    vdom[2][k] = {$func:vdom[2][k].toString()
                        .replace(/^function\s+.*?\(/, 'window.handleFunc$' + uuid + '=function(')
                        .replace(/[\n\r]+\s+/g, ''), uuid};
                }
            }
        }
        return Promise.resolve().then(function() {
            var queue = [];
            for (var i = 3; i < vdom.length; i++) {
                queue.push({
                    obj: vdom,
                    key: i
                });
            }
            var props = vdom[2];
            if (props) {
                for (var k in props) {
                    var prop = props[k];
                    if (!prop) continue;
                    if (isVDom(prop)) {
                        queue.push({
                            obj: props,
                            key: k
                        });
                    } else {
                        for (var pk in prop) {
                            if (isVDom(prop[pk])) {
                                queue.push({
                                    obj: prop,
                                    key: pk
                                });
                            }
                        }
                    }
                }
            }
            if (queue.length > 0) {
                return Promise.all(queue.map(item => processVdom(item.obj[item.key], widgets, fromPath)
                    .then(function(child) {
                        item.obj[item.key] = child;
                    })
                ))
            }
        }).then(function() {
            for (var i = 3; i < vdom.length; i++) {
                if (Array.isArray(vdom[i]) && vdom[i].flaten)
                    Array.prototype.splice.apply(vdom, [i, 1].concat(vdom[i]));
            }
        }).then(function() {
            if (vdom[1] == 'include') {
                var props = vdom[2];
                var path = resolvePage(props.path, fromPath);
                source = path + '\n\t@ ' + source;
                var comp = require(path);
                if (DEVMODE) delete require.cache[path];
                if (comp && typeof comp == 'object' && comp.__esModule && comp.default) comp = comp.default;
                var children = vdom.slice(3);
                children.flaten = true;
                return Promise.resolve(typeof comp == 'function' ? comp(props, children, widgets) : comp).then(function(comp) {
                    return processVdom(comp, widgets, path);
                });
            }
            return vdom;
        }).catch(e => {
            if (e && typeof e == 'object') {
                e.stack = (e.stack || '') + '\n\t@ ' + source;
            } else if (typeof e == 'string') {
                e += '\n\t@ ' + source;
            }
            throw e;
        });
    } else {
        return Promise.resolve(vdom);
    }
}

const basePath = Path.resolve(__dirname, '..');
function resolvePage(path, fromPath = '') {
    if (!path)
        throw 'Error, can not include empty path';
    var opath = path;
    path = path.split(/[\/\\]/);
    if (path[0] == '.' || path[0] == '..') {
        fromPath = Path.relative(basePath, fromPath || basePath).split(/[\/\\]/);
        fromPath.pop();
        path = fromPath.concat(path);
    }
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
    try {
        return require.resolve('../' + path.join('/'));
    } catch(e) {
    }
    path.push('-' + path.pop());
    try {
        return require.resolve('../' + path.join('/'));
    } catch(e) {
        throw 'Error, Not Found: ' + opath;
    }
}

function toReact(vdom) {
    if (Array.isArray(vdom)) {
        if (vdom[0] == React) {
            var args = vdom.slice(1, 3);
            for (var i = 3; i < vdom.length; i++) {
                args[i] = toReact(vdom[i]);
            }
            var props = {}, oprops = args[1];
            if (oprops) {
                for (var k in oprops) {
                    var prop = oprops[k];
                    props[k] = prop;
                    if (!prop) continue;
                    if (isVDom(prop)) props[k] = toReact(prop);
                    else if (Array.isArray(prop)) {
                        props[k] = prop.map(v => isVDom(v) ? toReact(v) : v);
                    } else if (typeof prop == 'object') {
                        var obj = {};
                        for (var pk in prop) {
                            obj[pk] = isVDom(prop[pk]) ? toReact(prop[pk]) : prop[pk];
                        }
                        props[k] = obj;
                    }
                }
            } else {
                props = undefined;
            }
            args[1] = props;
            if (typeof vdom[1] == 'function') {
                var widget = vdom[1].widgetInfo;
                if (widget) {
                    vdom[1] = {$class: widget.browserPath};
                } else {
                    vdom[1] = 'unknown';
                }
            }
            return ReactX.createElement.apply(ReactX, args);
        } else {
            return vdom.map(v => toReact(v));
        }
    } else {
        return vdom;
    }
}

function toHeadHTML(vdom) {
    if (Array.isArray(vdom)) {
        if (vdom[0] == React) {
            if (typeof vdom[1] == 'function') {
                throw 'Components are not supported in <head>';
            }
            var children = [];
            for (var i = 3; i < vdom.length; i++) {
                children.push(toHeadHTML(vdom[i]));
            }
            children = children.join('');
            var ret = '<' + vdom[1];
            var props = vdom[2];
            for (var k in props) {
                var prop = props[k];
                if (prop === true) {
                    prop = k;
                } else {
                    prop = prop + '';
                }
                ret += ' ' + k + '=' + JSON.stringify(prop);
            }
            ret += '>';
            if (children) {
                ret += children + '</' + vdom[1] + '>';
            } else if(vdom[1] in {script:1,title:1}) {
                ret += '</' + vdom[1] + '>';
            }
            return ret;
        } else {
            var ret = [];
            for (var i = 0; i < vdom.length; i++) {
                ret[i] = toHeadHTML(vdom[i]);
            }
            return vdom.join('');
        }
    } else if(typeof vdom === 'undefined' || vdom === null) {
        return '';
    } else {
        return vdom + "";
    }
}

function isVDom(v) {
    return Array.isArray(v) && v[0] == React;
}
