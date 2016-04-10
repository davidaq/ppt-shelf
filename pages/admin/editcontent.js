import auth from './-auth';

export default function(props, children, widgets) {
    return auth(props.request).then(user => {
        if (props.request.method == 'post') {
            var pdata = props.request.payload;
            if (!pdata.id || !pdata.data) {
                return {error:'错误的请求'};
            }
            pdata.data.status = 'ready';
            if (pdata.data.tags) {
                pdata.data.tags = pdata.data.tags.split(/\s+/).filter(v => !!v);
            } else {
                pdata.data.tags = [];
            }
            pdata.data.user = user._id;
            return db.from('contents').where({_id:pdata.id}).update({
                $set: pdata.data
            }).then(r => {
                if (r > 0)
                    return {ok:true};
                return {error:'保存失败'};
            }).catch(e => ({error:e.stack || e}));
        }
        return db.from('contents').where({
            _id: props.request.query.id
        }).first().then(content => {
            if (!content.lyric) {
                content.lyric = content.text.join('\n\n');
            }
            if (!content.cover) {
                content.cover = 0;
            }
            if (content.tags) {
                content.tags = content.tags.join(' ');
            } else {
                content.tags = '';
            }
            var {Row,Col,Card,Icon} = widgets.get('ReactMaterialize');
            var {ContentEditor} = widgets.get('admin');
            return <include path="./nav" user={user} title="编辑文件" active="contents">
                <div if={props.request.query.isnew}>
                    <h4 style={{color:'#AAA'}}>Step 1. 上传文件</h4>
                    <h4 style={{color:'#AAA'}}>Step 2. 等候系统检查</h4>
                    <h2><Icon left medium>label</Icon>Step 3. 编辑信息</h2>
                </div>
                <ContentEditor content={content}/>
            </include>
        }).catch(e => {
            throw e;
            var {Row,Col,Card,Icon} = widgets.get('ReactMaterialize');
            if (props.request.query.isnew) {
                return <include path="./nav" user={user} title="上传新文件" active="contents">
                    <h4 style={{color:'#AAA'}}>Step 1. 上传文件</h4>
                    <h2><Icon left medium>label</Icon>Step 2. 等候系统检查</h2>
                    <Row>
                        <Col s={4} m={2}>&nbsp;</Col>
                        <Col s={8} m={10}>
                            <p style={{color:'#F00'}}>
                                抱歉，无法识别您所上传的文件，请<a href="addcontent.page">重新尝试</a>。<br/>
                                注意：必须上传由较新版本的MS Powerpoint或其他办公软件保存的<u>pptx</u>文件。
                            </p>
                        </Col>
                    </Row>
                    <h4 style={{color:'#AAA'}}>Step 3. 编辑信息</h4>
                </include>              
            } else {
                return <include path="./nav" user={user} title="编辑文件" active="contents">
                    <br/><br/><br/><br/>
                    <Row>
                        <Col s={1} m={2} l={3}>&nbsp;</Col>
                        <Col s={10} m={8} l={6}>
                            <Card title="您所要编辑的文件不存在" actions={[<a href="contents.page">返回内容列表</a>,<a href="addcontent.page">上传新文件</a>]}>
                                这可能是因为文件已删除或已转移到别处
                            </Card>
                        </Col>
                    </Row>
                </include>
            }
        });
    });
}