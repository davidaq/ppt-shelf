import React from 'react';

export class PPTStatus extends React.Component {
    componentWillMount() {
        this.state = {text:'获取进度'};
        if (!widgets.isServer) {
            this.refresh();
            this.interval = setInterval(this.refresh.bind(this), 3500);
        }
    }
    componentWillUnmount() {
        if (!widgets.isServer)
            clearInterval(this.interval);
    }
    render() {
        return <div>正在{this.state.text}</div>
    }
    refresh() {
        ajax('addcontent.page', {status:this.props.id}, r => {
            if (r.redirect)
                document.location.replace('editcontent.page?isnew=1&id=' + this.props.id);
            else
                this.setState({text:r.text});
        });
    }
}