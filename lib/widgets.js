
var ids = 0;

var pool = [];

export function widgetsContext() {
    if (pool.length) {
        return pool.pop();
    } else {
        return new WidgetsContext();
    }
}

class WidgetsContext {
    constructor() {
        this.widgetCache = {};
        this.inited = {};
        this.isServer = true;
    }
    recycle() {
        if (DEVMODE) return;
        this.inited = {};
        pool.push(this);
    }
    get(name) {
        var ret = this.widgetCache[name];
        if (!ret)
            ret = this.widgetCache[name] = this._get(name);
        if (!this.inited[name]) {
            this.inited[name] = true;
            if(typeof ret.initState == 'function') {
                ret.initState(this);
            }
        }
        return ret;
    }
    used() {
        return Object.keys(this.inited);
    }
    _get(setName) {
        var fpath = require.resolve('../widgets/' + setName + '.js');
        var ret = require(fpath);
        delete require.cache[fpath];
        ret = ret(this);
        ids++;
        var id = ids;
        for (var k in ret) {
            if (typeof ret[k] == 'function' && ret[k].prototype.render) {
                ret[k].widgetInfo = {
                    browserPath: [setName, k],
                    widgetContext: this
                };
            }
        }
        ret.widgetSetName = setName;
        return ret;
    }
}
