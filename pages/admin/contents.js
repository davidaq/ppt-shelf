import auth from './-auth';
import escape from 'escape-string-regexp';

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
        if (props.request.query.search) {
            var search = props.request.query.search;
            if (search[0] == '#') {
                where.tags = search.substr(1);
            } else {
                var regex = {$regex:'.*' + escape(search) + '.*'};
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
            .sort({uploadTime:-1})
            .then(list => {
                res.list = list;
                return db.from('contents').where(where).count();
            }).then(count => {
                res.count = count;
                var {ContentList,ContentSearch} = widgets.get('admin');
                var {Pagination,Icon,Row,Col} = widgets.get('ReactMaterialize');
                return <include path="./nav" user={user} title="内容列表" active="contents">
                    <Row>
                        <Col s={12} m={7} l={8}>
                            <Pagination items={Math.ceil(res.count / pageLimit)} activePage={page + 1} maxButtons={8}
                                onSelect={p => setQuery({page:p})}/>
                        </Col>
                        <Col s={12} m={5} l={4}>
                            <ContentSearch search={props.request.query.search}/>
                        </Col>
                    </Row>
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

import rmdir from 'rmdir-recursive';

var removing;
setInterval(_ => {
    if (removing) return;
    db.from('contents').where({status:'removed'}).first().then(content => {
        removing = true;
        rmdir('contents/' + content._id, _ => {
            db.from('contents').where({_id:content._id}).remove().then(_ => {
                removing = false;
            });
        });
    });
    db.from('contents').where({status:'draft',uploadTime:{$lt:new Date(Date.now() - 3600000)}}).update({
        $set:{status:'removed'}
    });
}, 3000);