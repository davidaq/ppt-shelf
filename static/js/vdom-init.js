
setTimeout(function() {
    ReactDOM.render(toReact(window.initialVDom), document.getElementById('$MOUNT$'));
    function toReact(vdom) {
        if (Array.isArray(vdom)) {
            if (vdom[0] == '$VDOM$') {
                var args = vdom.slice(1, 3);
                for (var i = 3; i < vdom.length; i++) {
                    args[i] = toReact(vdom[i]);
                }
                var props = vdom[2];
                if (props) {
                    for (var k in props) {
                        var prop = props[k];
                        if (prop && typeof prop == 'object') {
                            if (typeof prop.$func == 'string') {
                                eval(prop.$func);
                                props[k] = window['handleFunc$' + prop.uuid];
                            } else if (isVDom(prop)) {
                                props[k] = toReact(prop);
                            } else {
                                for (var pk in prop) {
                                    prop[pk] = isVDom(prop[pk]) ? toReact(prop[pk]) : prop[pk];
                                }
                            }
                        }
                    }
                }
                if (typeof args[0] == 'object' && args[0].$class) {
                    var $class = args[0].$class;
                    $class = Array.isArray($class) ? $class : [$class];
                    args[0] = $class.reduce(function(obj, key) {return obj[key]}, window.Widgets);
                }
                return React.createElement.apply(React, args);
            } else {
                var ret = [];
                for (var i = 0; i < vdom.length; i++) {
                    ret[i] = toReact(vdom[i]);
                }
                return vdom;
            }
        } else {
            return vdom;
        }
    }
    
    function isVDom(v) {
        return Array.isArray(v) && v[0] == '$VDOM$';
    }
}, 5);