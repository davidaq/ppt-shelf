

export default function(props, children, widgets) {
    if (!props.request.yar.get('admin-login')) {
        throw {$redirect:'admin/login.page'};
    }
    var {Button, Card, Row, Col, Navbar, NavItem, Icon} = widgets.get('ReactMaterialize');
    return <include path="./admin-auth" request={props.request}>
        <Navbar brand="控制台" left>
            <NavItem href='get-started.html'><Icon>search</Icon></NavItem>
            <NavItem href='get-started.html'><Icon>view_module</Icon></NavItem>
            <NavItem href='get-started.html'><Icon>refresh</Icon></NavItem>
            <NavItem href='get-started.html'><Icon>more_vert</Icon></NavItem>
        </Navbar>
        <Row>
            <Col s={1}>
                hi
            </Col>
            <Col s={1}>
                hi
            </Col>
        </Row>
    </include>
}