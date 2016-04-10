
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
        this.usage = [];
        this.isServer = true;
    }
    recycle() {
        if (DEVMODE) return;
        this.inited = {};
        this.usage = [];
        pool.push(this);
    }
    get(name) {
        var ret = this.widgetCache[name];
        if (!ret)
            ret = this.widgetCache[name] = this._get(name);
        if (!this.inited[name]) {
            this.inited[name] = true;
            var usage = {name, order:0};
            this.usage.push(usage);
            if(typeof ret.initState == 'function') {
                usage.order = ret.initState(this) || 0;
            }
        }
        return ret;
    }
    used() {
        this.usage.sort((a,b) => a.order - b.order);
        return this.usage.map(v => v.name);
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
