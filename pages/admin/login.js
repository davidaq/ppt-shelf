
export default function(props, children, widgets) {
    var {Login} = widgets.get('admin');
    return Promise.resolve().then(_ => {
        if (props.request.method == 'post') {
            return props.request.payload;
        } else {
            return {};
        }
    }).then(_ => <include path="common/html" title="管理终端登录" materialize>
        <Login/>
    </include>)
}