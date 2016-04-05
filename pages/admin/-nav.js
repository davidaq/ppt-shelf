
export default function(props, children, widgets) {
    var {NavBar} = widgets.get('admin');
    return <include path="common/html" materialize title={props.title}>
        <NavBar user={props.user} brand={props.title}/>
        <div className="container">
            {children}
        </div>
    </include>
}