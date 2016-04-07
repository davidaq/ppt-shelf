import React from 'react';

var {Row,Col,Input,Button,Preloader} = widgets.get('ReactMaterialize');

export class ContentEditor extends React.Component {
    render() {
        return <div>
            <br/>
            <Button style={{width:'100%'}} onClick={this.save.bind(this)}>保存</Button>
            <br/><br/><br/><br/>
            <Row>
                <Col s={12} m={6} l={7}>
                    <Input label="标题" name="title" s={12} defaultValue={this.props.content.title}/>
                    <Input label="制作者" name="pptAuthor" s={12} defaultValue={this.props.content.pptAuthor}/>
                    <Input label="标签（用空格分隔）" name="tags" s={12} defaultValue={this.props.content.tags}/>
                    <Col s={12}>
                        <label>封面</label>
                        <div className="cover-select">
                            <For each="_" index="i" of={(new Array(this.props.content.slideCount)).fill(1)}>
                                <a onClick={() => this.setCover(i)} key={i} className="thumb" style={{backgroundImage:"url(/ppt/" + this.props.content._id + "/thumb-" + (i + 1) + ".png)"}}>
                                    <span className="selected" if={this.props.content.cover == i}/>
                                </a>
                            </For>
                        </div>
                    </Col>
                </Col>
                <Input type="textarea" label="歌词" name="lyric" s={12} m={6} l={5} defaultValue={this.props.content.lyric}/>
            </Row>
            <Button style={{width:'100%'}} onClick={this.save.bind(this)}>保存</Button>
            <br/><br/><br/><br/>
        </div>
    }
    setCover(i) {
        this.props.content.cover = i;
        this.forceUpdate();
    }
    save() {
        var fdata = $(ReactDOM.findDOMNode(this)).formData();
        fdata.cover = this.props.content.cover;
        ajax('editcontent.page', {id:this.props.content._id, data:fdata}, () => this.setState({saving:true}), r => {
            this.setState({saving:false});
            if (r.ok) {
                document.location.replace('contents.page');
            } else {
                Materialize.toast(r.error, 3000);
            }
        });
    }
}