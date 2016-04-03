import {Button, Card, Row, Col, Navbar, NavItem, Icon} from 'react-materialize';

export default function(props, children) {
    if (!props.request.yar.get('admin-login')) {
        throw {$redirect:'admin/login.page'};
    }
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