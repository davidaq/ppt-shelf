import React from 'react';

var labelStyle = {
    display:'block',
    border:'3px dashed #CCC',
    height:250,
    lineHeight:'250px',
    fontSize:30,
    textAlign:'center',
    cursor:'pointer'
};

var fileStyle = {
    background:'#ccc',
    width:'100%',
    height:'100%',
    position:'absolute',
    top:0,
    left:0,
    opacity: 0.01
};

var counter = 0;

var {ProgressBar,Preloader} = widgets.get('ReactMaterialize');

export class FileArea extends React.Component {
    componentWillMount() {
        counter++;
        this.id = "FileArea" + counter;
        this.state = {progress:0,fname:''};
    }
    render() {
        return <div>
            <label style={labelStyle} if={this.state.progress}>
                <div style={{lineHeight:'30px'}}>
                    <div style={{height:'110px',width:'100%',display:'table',fontSize:25}}>
                        <div style={{display:'table-cell',verticalAlign:'bottom',textAlign:'center'}}>
                            正在上传“{this.state.fname}”，请稍候
                        </div>
                    </div>
                    <ProgressBar progress={this.state.progress}/>
                    <Preloader flashing/>
                </div>
            </label>
            <form style={this.state.progress ? {position:'absolute',left:-9999,top:-9999} : {position:'relative'}}>
                <label style={labelStyle} htmlFor={this.id}>
                    点击这里选择文件，或者将文件拖拽进来
                </label>
                <input ref="file" type="file" id={this.id} name="fileInput" style={fileStyle} onChange={this.onPicked.bind(this)}/>
            </form>
        </div>
    }
    onPicked() {
        var file = ReactDOM.findDOMNode(this.refs.file).files[0];
        if (!file) return;
        var fname = file.name;
        if (this.props.pattern && !fname.match(new RegExp(this.props.pattern, 'i'))) {
            Materialize.toast(this.props.patternTip);
            return;
        }
        if (fname.length > 15)
            fname = fname.substr(0, 13) + '……';
        this.setState({progress: 1,fname});
        var xhr = new XMLHttpRequest();
        xhr.upload.onprogress = e => {
            console.log(e.loaded, e.total);
            this.setState({progress:1 + Math.ceil((e.loaded / e.total) * 98)});
        };
        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                this.props.onDone ? this.props.onDone(xhr.responseText) : this.setState({progress:0});
            }
        };
        xhr.open('PUT', this.props.postTo, true);
        var formData = new FormData();
        formData.append(this.props.postField || "thefile", file);
        xhr.send(formData);
    }
}

export function resetFileAreaId() {
    counter = 0;
}