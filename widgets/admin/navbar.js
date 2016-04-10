import React from 'react';

var {Navbar,Icon,NavItem,Tooltip} = widgets.get('ReactMaterialize');

export class NavBar extends React.Component {
    render() {
        return <Navbar brand={this.props.brand} left>
            <NavItem href="/"><Icon left>home</Icon>首页</NavItem>
            {this.item('contents', 'view_list', '内容列表')}
            {this.item('users', 'supervisor_account', '用户列表')}
            {this.item('settings', 'settings', '设置')}
            {this.item('login', 'power_settings_new', '退出')}
        </Navbar>;
    }
    item(name, icon, title) {
        return <NavItem className={name == this.props.active ? 'active':''} href={name + '.page'}><Icon left>{icon}</Icon>{title}</NavItem>
    }
}
