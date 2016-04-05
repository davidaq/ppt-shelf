import React from 'react';
var {Button,Input,Preloader,Icon,Toast} = widgets.get('ReactMaterialize');

export class Login extends React.Component {
    componentWillMount() {
        this.state = {};
    }
    render() {
        return <form id="loginForm" style={{height:'100%',background:'#EEE'}} onSubmit={this.login.bind(this)}>
            <div className="valign-wrapper" style={{height:'80%'}}>
                <div className="card" style={{margin:'0 auto',minHeight:'350px'}}>
                    <div className="card-content center-align">
                        <Icon large>account_circle</Icon>
                        <Input name="username" label="用户名"/>
                        <Input name="password" label="密码" type="password"/>
                        <Cases>
                            <Preloader flashing if={this.state.loading}/>
                            <Button waves="light" onClick={this.login.bind(this)}>登录</Button>
                        </Cases>
                    </div>
                </div>
            </div>
        </form>;
    }
    login(e) {
        e.preventDefault();
        var fdata = $(ReactDOM.findDOMNode(this)).formData();
        ajax('/admin/login.page', fdata, _ => this.setState({loading:true}), r => {
            this.setState({loading:false});
            if (r.ok) {
                document.location.replace('/admin.page');
            } else {
                Materialize.toast(r.error, 3000);
            }
        });
    }
}