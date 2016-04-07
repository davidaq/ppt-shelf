import auth from './-auth';

var pageLimit = 20;

export default function(props, children, widgets) {
    return auth(props.request).then(user => {
        if (props.request.method == 'post') {
            console.log(props.request.payload);
            if (props.request.payload.remove) {
                return db.from('contents').where({_id:props.request.payload.remove}).update({
                    $set:{status:'removed'}
                }).then(v => ({ok:true}));
            }
        }
        var page = props.request.query.page - 1 || 0;
        var res = {};
        var where = {status:'ready'};
        if (props.request.query.user)
            where.user = props.request.query.user;
        return db.from('contents')
            .where(where)
            .skip(page * pageLimit)
            .limit(pageLimit)
            .sort({uploadTime:-1})
            .then(list => {
                res.list = list;
                return db.from('contents').where(where).count();
            }).then(count => {
                res.count = count;
                var {ContentList} = widgets.get('admin');
                var {Pagination,Icon} = widgets.get('ReactMaterialize');
                return <include path="./nav" user={user} title="内容列表" active="contents">
                    <Pagination items={Math.ceil(res.count / pageLimit)} activePage={page + 1} maxButtons={8}
                        onSelect={p => setQuery({page:p})}/>
                    <ContentList list={res.list}/>
                    <div className="fixed-action-btn">
                        <a className="btn-floating btn-large waves-effect waves-light red horizontal" href='addcontent.page'>
                            <Icon>add</Icon>
                        </a>
                    </div>
                </include>
            })
    });
};