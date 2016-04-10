
export default function(props, children, widgets) {
    return db.from('contents').where({_id:props.request.query.id}).first().then(content => {
        if (props.request.yar.get('lastVisit') != content._id) {
            props.request.yar.set('lastVisit', content._id);
            db.from('contents').where({_id:content._id}).update({
                $inc: {views:1,reputation:1}
            }).then(_ => _);
        }
        var {SlidePreview, AudioPlayer} = widgets.get('home');
        return <include path="./nav" request={props.request} title={content.title}>
            <br/>
            <div className="row">
                <div className="columns small-12 medium-8">
                    <div className="heading">
                        <div className="left">
                            <h4 style={{fontWeight:'bold'}}>{content.title}</h4>
                            <div style={{color:'#777',fontSize:15,padding:'5px 0'}}>
                                <span if={content.pptAuthor}>制作者: <a>{content.pptAuthor}</a> &nbsp;&nbsp;&nbsp; </span>
                                下载次数: {content.downloads || 0} &nbsp;&nbsp;&nbsp; 浏览次数：{content.views || 1}
                            </div>
                        </div>
                        <div className="right">
                            <a href={"/ppt/" + content._id + '/download'}>下载原始PPT</a>
                        </div>
                    </div>
                    <SlidePreview id={content._id} count={content.slideCount}/>
                    <AudioPlayer src={"/ppt/" + content._id + "/bgm.mp3"} if={content.haveBgm}/>
                    <div if={content.tags && content.tags.length > 0}>
                        <br/><br/>
                        <div className="tags">
                            <label className="label info">标签</label><br/>
                            <For each="tag" of={content.tags}>
                                <a className="tag" href={'/?search=' + encodeURIComponent('#' + tag)}>{tag}</a>
                            </For>
                        </div>
                    </div>
                </div>
                <div className="columns small-12 medium-4">
                    <h4>歌词</h4>
                    <div className="lyric" dangerouslySetInnerHTML={{__html:content.lyric.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')}}/>
                </div>
            </div>
            <br/><br/><br/><br/><br/>
        </include>
    }).catch(e => {
        throw e;
    });
}