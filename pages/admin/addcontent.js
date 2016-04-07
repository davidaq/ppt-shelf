import auth from './-auth';
import fs from 'fs';
import {generate as shortid} from 'shortid';

var extract = Lrequire('lib/ppt-extract');

export default function(props, children, widgets) {
    return auth(props.request).then(user => {
        if (props.request.method == 'put') {
            var thefile = props.request.payload.thefile;
            if (thefile && typeof thefile.pipe == 'function') {
                var id = shortid();
                return new Promise(resolve => {
                    fs.mkdir('uploads', err => {
                        var ostream = fs.createWriteStream('uploads/' + id + '.upl');
                        ostream.once('finish', err => {
                            resolve();
                        });
                        thefile.pipe(ostream);
                    });
                }).then(_ => {
                    return {id};
                });
            } else {
                return '';
            }
        } else if(props.request.method == 'post' && props.request.payload.status) {
            var id = props.request.payload.status;
            if (extract.current().id == id) {
                return {text:extract.current().status};
            } else {
                return new Promise(resolve => {
                    fs.exists('uploads/' + id + '.upl', resolve);
                }).then(exists => {
                    if (exists) {
                        return {text:'检查文件安全性'};
                    } else {
                        return {redirect:true};
                    }
                });
            }
            return {text:'处理中'};
        } else if(props.request.query.file) {
            var {Icon, Preloader, Row, Col} = widgets.get('ReactMaterialize');
            var {PPTStatus} = widgets.get('admin');
            return <include path="./nav" user={user} title="上传新文件" active="contents">
                <h4 style={{color:'#AAA'}}>Step 1. 上传文件</h4>
                <h2><Icon left medium>label</Icon>Step 2. 等候系统检查</h2>
                <Row>
                    <Col s={4} m={2}><Preloader flashing/></Col>
                    <Col s={8} m={10}>
                        <p style={{color:'#777'}}>
                            系统将检查已上传文件的正确性，并尝试进行优化处理。
                            这个过程将自动完成，请耐心等候。
                        </p>
                        <PPTStatus id={props.request.query.file}/>
                    </Col>
                </Row>
                <h4 style={{color:'#AAA'}}>Step 3. 编辑信息</h4>
            </include>
        } else {
            var {Icon} = widgets.get('ReactMaterialize');
            var {FileArea} = widgets.get('admin');
            return <include path="./nav" user={user} title="上传新文件" active="contents">
                <h2><Icon left medium>label</Icon>Step 1. 上传文件</h2>
                <FileArea postTo="addcontent.page" onDone={result => document.location.replace('addcontent.page?file=' + JSON.parse(result).id)} pattern="\.pptx$" patternTip="只允许上传.pptx文件"/>
                <h4 style={{color:'#AAA'}}>Step 2. 等候系统检查</h4>
                <h4 style={{color:'#AAA'}}>Step 3. 编辑信息</h4>
            </include>
        }
    })
}