import auth from './-auth';

var {password} = Lrequire('lib/crypt');

export default function(props, children, widgets) {
    return auth(props.request).then(user => {
        if (props.request.method == 'post') {
            var pdata = props.request.payload || {};
            switch(pdata.target) {
            case 'userInfo':
                if (!pdata.data.loginname)
                    return {error:'登录名不得为空'};
                if (!pdata.data.username)
                    return {error:'昵称不得为空'};
                return db.from('user').where({
                    _id: user._id
                }).update({$set:pdata.data}).then(r => {
                    user.loginname = pdata.data.loginname;
                    user.username = pdata.data.username;
                    props.request.yar.set('login-user', user);
                    return {ok:true};
                });
            case 'siteInfo':
                ['allowRegister','allowGuestDownload','allowNonAdminUpload','showNotValidated'].map(k => {
                    pdata.data[k] = !!pdata.data[k];
                });
                return db.from('settings').where({
                    _id: 'main'
                }).update({$set:pdata.data}).then(r => {
                    return {ok:true};
                });
            case 'password':
                pdata = pdata.data;
                if (!pdata.newPassword)
                    return {error:'新密码不得为空'};
                return db.from('user').where({
                    _id: user._id,
                    password: password(pdata.oldPassword)
                }).update({$set:{
                    password: password(pdata.newPassword)
                }}).then(r => {
                    if (r)
                        return {ok:true};
                    return {error:'原密码错误'};
                });
            }
            return {error:'未知操作'};
        } else {
            var {Settings} = widgets.get('admin');
            return db.from('settings').where({_id:'main'}).first().then(settings => {
                return <include path="./nav" title="设置" user={user} active="settings">
                    <Settings user={user} siteSettings={settings}/>
                </include>
            });
        }
    });
};