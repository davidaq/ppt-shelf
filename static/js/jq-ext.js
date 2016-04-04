(function () {
    function pathOf(key) {
        return key.match(/[^\[\]]+/g);
    }
    function set(obj, path, value) {
        var last = path.pop();
        for(var k in path) {
            k = path[k];
            if(!obj[k]) {
                obj[k] = {};
            }
            obj = obj[k];
        }
        obj[last] = value;
    }
    function get(obj, path) {
        for(var k in path) {
            k = path[k];
            if(!(k in obj)) {
                return null;
            }
            obj = obj[k];
        }
        return obj;
    }
    var $ext = {};
    $ext.formDataClear = function() {
        $('input,textarea,select', this).each(function() {
            var type = $(this).attr('type');
            if(type == 'checkbox') {
                $(this)[0].checked = false;
            } else if(type == 'radio') {
                $(this)[0].checked = false;
            } else {
                $(this).val('');
            }
        });
        return this;
    };
    $ext.formData = function(data) {
        if(!data) {
            var data = {};
            $('input,textarea,select', this).each(function() {
                var key = $(this).attr('name');
                if(key) {
                    var type = $(this).attr('type');
                    if(type == 'radio' || type == 'checkbox') {
                        if($(this)[0].checked) {
                            set(data, pathOf(key), $(this).val() || true);
                        }
                    } else {
                        set(data, pathOf(key), $(this).val());
                    }
                }
            });
            return data;
        } else {
            $('input,textarea,select', this).each(function() {
                var key = $(this).attr('name');
                if(key) {
                    var type = $(this).attr('type');
                    var val = get(data, pathOf(key));
                    if (val === null) return;
                    if(type == 'checkbox') {
                        $(this)[0].checked = !!val;
                    } else if(type == 'radio') {
                        $(this)[0].checked = val == $(this).attr('value');
                    } else {
                        $(this).val(val);
                    }
                }
            });
            return this;
        }
    };
    $.fn.extend($ext);
})();