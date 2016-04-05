import React from 'react';

var {Navbar,Icon,NavItem,Tooltip} = widgets.get('ReactMaterialize');

export class NavBar extends React.Component {
    render() {
        return <Navbar brand={this.props.brand} left href="">
            <NavItem href='dashboard.page'><Icon left>trending_up</Icon>仪表盘</NavItem>
            <NavItem href='contents.page'><Icon left>view_list</Icon>内容列表</NavItem>
            <NavItem href="users.page"><Icon left>supervisor_account</Icon>用户列表</NavItem>
            <NavItem href='settings.page'><Icon left>settings</Icon>设置</NavItem>
            <NavItem href="login.page"><Icon left>power_settings_new</Icon>退出</NavItem>
        </Navbar>;
    }
}