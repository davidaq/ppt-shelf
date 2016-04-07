
export default function(props, children, widgets) {
    var {NavBar} = widgets.get('admin');
    return <include path="common/html" materialize title={props.title}>
        <link rel="stylesheet" type="text/css" href="/css/admin.css"/>
        <NavBar user={props.user} brand={props.title} active={props.active}/>
        <div className="container">
            {children}
        </div>
    </include>
}