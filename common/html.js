export default function(props={}, children, widgets) {
    return <html>
        <head>
            <meta charset="utf-8"/>
            <meta name="renderer" content="webkit"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1"/>
            <meta http-equiv="Cache-Control" content="no-siteapp"/>
            <meta http-equiv="Content-type" content="text/html;charset=utf-8"/>
            <meta content="width=device-width, initial-scale=1, maximum-scale=1.2, user-scalable=0" name="viewport"/>
            <title>{props.title}</title>
            <script type="text/javascript" src="http://cdn.bootcss.com/jquery/2.2.1/jquery.min.js"/>
            <script type="text/javascript" src="/js/jq-ext.js"/>
            <script type="text/javascript" src="/js/ajax.js"/>
            <script type="text/javascript" src="http://cdn.bootcss.com/react/0.14.7/react.js"/>
            <script type="text/javascript" src="http://cdn.bootcss.com/react/0.14.7/react-dom.min.js"/>
            <script if={props.materialize} type="text/javascript" src="http://cdn.bootcss.com/materialize/0.97.5/js/materialize.min.js"/>
            <link if={props.materialize} type="text/javascript" rel="stylesheet" href="http://cdn.bootcss.com/materialize/0.97.5/css/materialize.min.css"/>
            <link if={props.materialize} type="text/javascript" rel="stylesheet" href="/css/materialicons.css"/>
        </head>
        <body>
            {children}
            <script type="text/javascript" src="/js/vdom-init.js"/>
        </body>
    </html>
}