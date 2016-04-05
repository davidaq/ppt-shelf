import auth from './-auth';

export default function(props, children, widgets) {
    return auth(props.request).then(user => {
        var {Icon, Card, Table} = widgets.get('ReactMaterialize');
        var {NavBar} = widgets.get('admin');
        return <include path="./nav" user={user} title="仪表盘">
            <h2><Icon left medium>trending_up</Icon>仪表盘</h2>
            <Table>
                <thead>
                    <tr>
                        <th>项目</th>
                        <th>今日</th>
                        <th>昨日</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>PPT上传新增数量</td>
                    </tr>
                    <tr>
                        <td>PPT总量</td>
                    </tr>
                </tbody>
            </Table>
        </include>
    });
};