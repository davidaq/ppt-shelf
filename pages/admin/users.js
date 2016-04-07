import auth from './-auth';

export default function(props, children, widgets) {
    return auth(props.request).then(user => {
        var {Row, Col, Card, Icon, Button} = widgets.get('ReactMaterialize');
        var {UserCard} = widgets.get('admin');
        return db.from('user').sort('username').select({password:false,loginname:false}).then(function(users) {
            return <include path="./nav" title="用户列表" user={user} active="users">
                <Row>
                    <For each="user" of={users}>
                        <Col key={user._id} s={12} m={6} l={4}>
                            <UserCard user={user}/>
                        </Col>
                    </For>
                </Row>
                <div className="fixed-action-btn">
                    <a className="btn-floating btn-large waves-effect waves-light red horizontal" href='adduser.page'>
                        <Icon>add</Icon>
                    </a>
                </div>
            </include>
        });
    });
}