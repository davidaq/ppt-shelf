
export default function(props, children, widgets) {
    var {Button, Card, Row, Col, Navbar, NavItem, Icon} = widgets.get('ReactMaterialize');
    return <include path="common/html" materialize>
        <Navbar brand="PPT-Shelf" left>
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