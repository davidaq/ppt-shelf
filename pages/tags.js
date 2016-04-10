var tags;
var prevTagsTime;

var sizes = ['0.9em', '1.1em', '1.3em','1.5em','1.7em', '1.9em'];
var colors = ['#779','D21','#D41','#F61'];

function getTags() {
    return Promise.resolve(tags).then(tags => {
        var query;
        if (true || !tags || Date.now() - prevTagsTime > 60000) {
            prevTagsTime = Date.now();
            query = db.from('contents').aggregate([
                {$unwind:'$tags'},
                {$group:{
                    _id:"$tags",
                    count:{$sum:1},
                    reputation:{$sum:'$reputation'}
                }}
            ]).then(r => {
                if (r.length) {
                    var maxSize = 0, minSize, maxColor = 0, minColor;
                    r.map(v => {
                        v.size = v.count * 5000 + v.reputation;
                        v.color = v.reputation;
                        if (!minSize || v.size < minSize)
                            minSize = v.size;
                        else if (v.size > maxSize)
                            maxSize = v.size;
                        if (!minColor || v.color < minColor)
                            minColor = v.color;
                        else if (v.color > maxColor)
                            maxColor = v.color;
                    });
                    if (maxSize <= minSize)
                        maxSize = minSize +1;
                    if (maxColor <= minColor)
                        maxColor = minColor + 1;
                    tags = r.map(v => {
                        return {
                            name: v._id,
                            size: sizes[Math.floor(sizes.length * (v.size - minSize) / (1 + maxSize - minSize))],
                            color: colors[Math.floor(colors.length * (v.color - minColor) / (1 + maxColor - minColor))]
                        }
                    });
                } else {
                    tags = r;
                }
                return tags;
            });
        }
        if (tags) {
            return tags;
        } else {
            return query;
        }
    });
}

export default function(props, children, widgets) {
    return getTags().then(tags => {
        return <include path="./nav" title="标签云">
            <div className="row">
                <br/>
                <label className="label warning">标签云</label>
                <span style={{fontSize:'0.9em',color:'#777'}}>&nbsp;&nbsp;- 点击标签查看相关内容</span>
                <br/><br/>
                <div className="tags">
                    <For each="tag" of={tags}>
                        <a href={'/?search=' + encodeURIComponent('#' + tag.name)} className="tag" style={{fontSize:tag.size,color:tag.color}}>{tag.name}</a>
                    </For>
                </div>
            </div>
        </include>
    });
}