import React from 'react';

var {Row, Col, Card, CardTitle, Icon, Button, Modal, Input} = widgets.get('ReactMaterialize');

export class ContentList extends React.Component {
    render() {
        return <div className="content-list">
            <Row>
                <For each="item" of={this.props.list}>
                    <Col key={item._id} s={12} m={4} l={3}>
                        <Card 
                            header={<div className="thumb" style={{backgroundImage:"url(/ppt/" + item._id + "/thumb-" + (item.cover + 1) + '.png)'}}/>}
                            actions={[
                                <a key={0} href={"/admin/editcontent.page?id=" + item._id}>编辑</a>,
                                <Modal key={1}
                                  header='确认删除'
                                  trigger={
                                    <a href="#">删除</a>
                                  }
                                  btn1={<Button onClick={() => this.del(item._id)} waves="light" flat={true}>确认</Button>}
                                  btn2={<Button waves="light" modal="close" flat={true}>取消</Button>}>
                                  <p>是否真的要删除“{item.title}”？这个操作将不可挽回</p>
                                </Modal>,
                            ]}>
                            {item.title}
                        </Card>
                    </Col>
                </For>
            </Row>
        </div>
    }
    del(id) {
        ajax('contents.page', {remove:id}, r => {
            document.location.reload();
        });
    }
}

var searchTimeout;
export class ContentSearch extends React.Component {
    render() {
        return <Input type="text" label="搜索" s={12} onKeyDown={this.key.bind(this)} defaultValue={this.props.search}/>
    }
    key(e) {
        if (e.keyCode == 13) {
            var val = e.target.value;
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                document.location.replace('?search=' + val);
            }, 200);
        }
    }
}