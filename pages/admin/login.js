import {Button, Card, Row, Col, Navbar, NavItem, Icon, Input} from 'react-materialize';

export default function(props, children) {
    return <include path="common/html" title="管理终端登录" materialize>
        <div style={{height:'100%',background:'#EEE'}}>
            <div className="valign-wrapper" style={{height:'80%'}}>
                <div className="card" style={{margin:'0 auto'}}>
                    <div className="card-content center-align">
                        <Icon large>account_circle</Icon>
                        <Input label="用户名"/>
                        <Input label="密码" type="password"/>
                        <Button waves="light">登录</Button>
                    </div>
                </div>
            </div>
        </div>
    </include>
}