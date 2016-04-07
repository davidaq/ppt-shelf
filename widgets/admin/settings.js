import React from 'react';

var {Row,Col,Input,Button,Preloader} = widgets.get('ReactMaterialize');

export class Settings extends React.Component {
    componentWillMount() {
        this.state = {};
    }
    render() {
        return <div>
            <h4>网站信息</h4>
            <Row ref="siteinfo">
                <Input label="网站名称" name="siteName" s={12} m={4} defaultValue={this.props.siteSettings.siteName}/>
                <Input label="网站描述" name="siteDesc" s={12} m={6} defaultValue={this.props.siteSettings.siteDesc}/>
                <Col s={12}>
                    <Input label="允许自由注册" name="allowRegister" defaultChecked={this.props.siteSettings.allowRegister} type="checkbox"/>
                    <Input label="允许非注册用户下载" name="allowGuestDownload" defaultChecked={this.props.siteSettings.allowGuestDownload} type="checkbox"/>
                    <Input label="允许非管理员用户上传" name="allowNonAdminUpload" defaultChecked={this.props.siteSettings.allowNonAdminUpload} type="checkbox"/>
                    <Input label="允许展示未审核的内容" name="showNotValidated" defaultChecked={this.props.siteSettings.showNotValidated} type="checkbox"/>
                </Col>
            </Row>
            <SubmitBtn loading={this.state.savingSiteInfo} onClick={this.saveSiteInfo.bind(this)}>保存</SubmitBtn>
            <h4>我的账户信息</h4>
            <Row ref="userinfo">
                <Input label="登录名" name="loginname" defaultValue={this.props.user.loginname}/>
                <Input label="昵称" name="username" defaultValue={this.props.user.username}/>
            </Row>
            <SubmitBtn loading={this.state.savingUserInfo} onClick={this.saveUserInfo.bind(this)}>保存</SubmitBtn>
            <h4>修改密码</h4>
            <Row ref="password">
                <Input label="原始密码" name="oldPassword" type="password"/>
                <Input label="新密码" name="newPassword" type="password"/>
                <Input label="确认密码" name="confirmPassword" type="password"/>
            </Row>
            <SubmitBtn loading={this.state.savingPassword} onClick={this.savePassword.bind(this)}>保存</SubmitBtn>
        </div>
    }
    saveSiteInfo(event) {
        var postData = $(ReactDOM.findDOMNode(this.refs.siteinfo)).formData();
        ajax('settings.page', {target:'siteInfo', data:postData}, _ => this.setState({savingSiteInfo:true}), r => {
            this.setState({savingSiteInfo:false});
            if (r.error) {
                Materialize.toast(r.error, 3000);
            } else if(r.ok) {
                Materialize.toast('保存成功', 3000);
            }
        });
    }
    saveUserInfo(event) {
        var postData = $(ReactDOM.findDOMNode(this.refs.userinfo)).formData();
        ajax('settings.page', {target:'userInfo', data:postData}, _ => this.setState({savingUserInfo:true}), r => {
            this.setState({savingUserInfo:false});
            if (r.error) {
                Materialize.toast(r.error, 3000);
            } else if(r.ok) {
                Materialize.toast('保存成功', 3000);
            }
        });
    }
    savePassword(event) {
        var postData = $(ReactDOM.findDOMNode(this.refs.password)).formData();
        if (postData.confirmPassword != postData.newPassword)
            return Materialize.toast('新密码确认错误', 3000);
        if (postData.oldPassword == postData.newPassword)
            return Materialize.toast('新密与原密码一样', 3000);
        ajax('settings.page', {target:'password', data:postData}, _ => this.setState({savingPassword:true}), r => {
            this.setState({savingPassword:false});
            if (r.error) {
                Materialize.toast(r.error, 3000);
            } else if(r.ok) {
                Materialize.toast('保存成功', 3000);
            }
        });
    }
}

class SubmitBtn extends React.Component {
    render() {
        return <div style={{height:70}}>
            <Cases>
                <Preloader if={this.props.loading} flashing/>
                <Button onClick={this.props.onClick}>{this.props.children}</Button>
            </Cases>
        </div>
    }
}