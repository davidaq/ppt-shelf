function ajax(url, params, cb1, cb2) {
    var onShowLoading, onDone;
    if (cb2) {
        onShowLoading = cb1;
        onDone = cb2;
    } else {
        onDone = cb1;
    }
    $.ajax({
        url: url,
        method: 'post',
        contentType: 'application/json',
        data: JSON.stringify(params),
        dataType: 'json',
        success: end,
        error: function(xhr, txtStatus, err) {
            end({error:err, status:txtStatus});
        }
    });
    var loadingShown = false, loadingTimeout;
    if (onShowLoading) {
        loadingTimeout = setTimeout(function() {
            loadingShown = true;
            onShowLoading();
        }, 300);
    }
    function end(result) {
        if (loadingShown) {
            loadingShown = false;
            setTimeout(function() {
                end(result);
            }, 1000);
        } else if (onDone) {
            if (loadingTimeout)
                clearTimeout(loadingTimeout);
            onDone(result);
        }
    }
}
function setQuery(params) {
    var search = document.location.search;
    if (search[0] == '?')
        search = search.substr(1);
    search = search.split('&');
    var query = {};
    search.map(function(v) {
        v = v.split('=');
        if (v[0])
            query[decodeURIComponent(v[0])] = v[1];
    });
    for (var k in params) {
        query[k] = encodeURIComponent(params[k]);
    }
    params = [];
    for (var k in query) {
        params.push(encodeURIComponent(k) + '=' + query[k]);
    }
    document.location.href = '?' + params.join('&');
}