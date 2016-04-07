import React from 'react';

var {Card, Icon} = widgets.get('ReactMaterialize');

var levelMap = {
    super: '超级管理员',
    admin: '管理员',
    power: '特权用户',
    plain: '普通用户'
};

export class UserCard extends React.Component {
    render() {
        return <Card title={this.props.user.username} actions={[
            <a href={"contents.page?user=" + this.props.user._id} key={1}>内容列表</a>,
            <a href={"users.page?id=" + this.props.user._id} key={3} className="tooltipped right" data-tooltip="设置"><Icon>settings</Icon></a>,
        ]}>
            身份：{levelMap[this.props.user.level]}
        </Card>
    }
}