import escape from 'escape-string-regexp';

var pageLimit = 20;

export default function(props, children, widgets) {
    var {Pagination} = widgets.get('home');
    
    var page = props.request.query.page - 1 || 0;
    var sort = props.request.query.sort || 'uploadTime';
    var res = {};
    var where = {status:'ready'};
    if (props.request.query.user)
        where.user = props.request.query.user;
    if (props.request.query.search) {
        var search = props.request.query.search;
        if (search[0] == '#') {
            where.tags = search.substr(1);
        } else {
            var regex = {$regex:'.*' + escape(search) + '.*'};
            console.log(search, regex);
            where.$or = [{
                title: regex
            },{
                text: regex
            },{
                lyric: regex
            },{
                tags: search
            }];
        }
    }
    return db.from('contents')
        .where(where)
        .skip(page * pageLimit)
        .limit(pageLimit)
        .sort({[sort]:-1})
        .then(list => {
            res.list = list;
            return db.from('contents').where(where).count();
        }).then(count => {
            res.count = count;
            return <include path="./nav" discover request={props.request}>
                <div className="sort-n-filters">
                    <div className="row">
                        <div className="pager">
                            <Pagination total={Math.ceil(res.count / pageLimit)} current={page + 1}/>
                        </div>
                        <div className="controls">
                            <a href="#" onClick={_ => setQuery({sort:'uploadTime'})} className={sort == 'uploadTime' ? "active" : ''}>最新上传</a>
                            <a href="#" onClick={_ => setQuery({sort:'reputation'})} className={sort == 'reputation' ? "active" : ''}>最受欢迎</a>
                        </div>
                    </div>
                </div>
                <div className="content-thumbs row">
                    <For each="item" of={res.list}>
                        <a href={"content.page?id=" + item._id} className="columns small-6 medium-4 large-3" key={item._id}>
                            <div className="item">
                                <div className="thumb" style={{backgroundImage:'url(ppt/' + item._id + '/thumb-' + (item.cover + 1) + '.png)'}}/>
                                <div className="desc">
                                    <div className="title">{shorten(item.title)}</div>
                                    <div className="downloads">{item.downloads || 0}</div>
                                    <div className="views">{item.views || 0}</div>
                                </div>
                            </div>
                        </a>
                    </For>
                    <div className="columns small-6 medium-4 large-3"/>
                </div>
            </include>
        });
}

function shorten(str) {
    if (str.length > 10)
        str = str.substr(0, 8) + '……';
    return str;
}