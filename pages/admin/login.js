export default function(props, children, widgets) {
    if (props.request.method == 'post') {
        return Promise.resolve(props.request.payload || {})
            .then(pdata => {
                if (!pdata.username) throw '必须填写用户名';
                return db.from('admin').where({
                    login_name: pdata.username,
                }).then(r => {
                    r = r[0];
                    if (!r) throw '没有这个用户';
                    if (r.password !== pdata.password) throw '密码错误';
                    return {ok:true};
                })
            })
            .catch(e => {
                return {error:e.stack || e};
            });
    } else {
        var {Login} = widgets.get('admin');
        return <include path="common/html" title="管理终端登录" materialize>
            <Login/>
        </include>;
    }
}