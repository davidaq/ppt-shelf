import React from 'react';

import {Pagination} from './pagination';

export class SlidePreview extends React.Component {
    componentWillMount() {
        this.state = {current:1};
    }
    render() {
        return <div className="slide-preview">
            <div className="large" style={{backgroundImage:'url(ppt/' + this.props.id + '/slide-' + this.state.current + '.png)'}}/>
            <div style={{textAlign:'center',padding:'10px 0'}}>
                <Pagination total={this.props.count} current={this.state.current} onChange={i => this.setState({current:i})}/>
            </div>
        </div>
    }
}

export class AudioPlayer extends React.Component {
    componentDidMount() {
        var src = this.props.src;
        $(ReactDOM.findDOMNode(this.refs.hook)).jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    title: "",
                    mp3: src
                });
            },
            swfPath: "/jplayer",
            supplied: "mp3",
            wmode: "window",
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true
        });
    }
    render() {
        return <div>
            <link href="/jplayer/blue.monday/css/jplayer.blue.monday.min.css" rel="stylesheet" type="text/css"/>
            <script type="text/javascript" src="/jplayer/jquery.jplayer.min.js"/>
            <div ref="hook"/>
            <div id="jp_container_1" className="jp-audio" role="application" aria-label="media player" style={{margin:'0 auto'}}>
                <div className="jp-type-single">
                    <div className="jp-gui jp-interface">
                        <div className="jp-controls">
                            <button className="jp-play" role="button" tabIndex="0">play</button>
                            <button className="jp-stop" role="button" tabIndex="0">stop</button>
                        </div>
                        <div className="jp-progress">
                            <div className="jp-seek-bar">
                                <div className="jp-play-bar"></div>
                            </div>
                        </div>
                        <div className="jp-volume-controls">
                            <button className="jp-mute" role="button" tabIndex="0">mute</button>
                            <button className="jp-volume-max" role="button" tabIndex="0">max volume</button>
                            <div className="jp-volume-bar">
                                <div className="jp-volume-bar-value"></div>
                            </div>
                        </div>
                        <div className="jp-time-holder">
                            <div className="jp-current-time" role="timer" aria-label="time">&nbsp;</div>
                            <div className="jp-duration" role="timer" aria-label="duration">&nbsp;</div>
                            <div className="jp-toggles">
                                <button className="jp-repeat" role="button" tabIndex="0">repeat</button>
                            </div>
                        </div>
                    </div>
                    <div className="jp-details">
                        <div className="jp-title" aria-label="title">&nbsp;</div>
                    </div>
                    <div className="jp-no-solution">
                        <span>Update Required</span>
                        To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
                    </div>
                </div>
            </div>
        </div>
    }
}