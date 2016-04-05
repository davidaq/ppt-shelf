var {password} = Lrequire('lib/crypt');

export default function(props, children, widgets) {
    if (props.request.method == 'post') {
        return Promise.resolve(props.request.payload || {})
            .then(pdata => {
                if (!pdata.username) throw '必须填写用户名';
                return db.from('user').where({
                    loginname: pdata.username,
                }).firstOrDefault().then(r => {
                    if (!r) throw '没有这个用户';
                    if (r.password !== password(pdata.password)) throw '密码错误';
                    delete r.password;
                    props.request.yar.set('login-user', r);
                    return {ok:true};
                })
            })
            .catch(e => {
                return {error:e.stack || e};
            });
    } else {
        props.request.yar.clear('login-user');
        var {Login} = widgets.get('admin');
        return <include path="common/html" title="管理终端登录" materialize>
            <Login/>
        </include>;
    }
}