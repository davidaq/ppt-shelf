
export default function(props, children, widgets) {
    return db.from('settings').where({_id:'main'}).first().then(settings => {
        return <include path="common/html" title={(props.title ? props.title + ' - ' : '') + settings.siteName}>
            <link rel="stylesheet" type="text/css" href="/css/foundation.min.css"/>
            <link rel="stylesheet" type="text/css" href="/css/style.css"/>
            <div className="nav">
                <a className="brand" href="/">
                    {settings.siteName}
                </a>
                <div className="controls">
                    <a href="admin.page">登陆</a>
                    <span className="sep"/>
                    <a href="tags.page">标签云</a>
                    <span className="sep"/>
                    <a href="/">首页</a>
                </div>
            </div>
            <div className="discover" if={props.discover}>
                <div className="slogan">{settings.siteDesc}</div>
                <div className="search">
                    <input type="text" defaultValue={props.request.query.search} id="search"/>
                    <a onClick={e => setQuery({search:$('#search').val(),page:1})}>搜索</a>
                    <span className="sep"/>
                </div>
            </div>
            <div className="discover-pad" if={props.discover}/>
            <div className="nav-pad" if={!props.discover}/>
            <div className="main-body">{children}</div>
        </include>
    });
}