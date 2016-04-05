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