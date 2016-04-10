import React from 'react';

export class Pagination extends React.Component {
    render() {
        var r = range(this.props.current, 7, this.props.total);
        return <ul className="pagination" role="navigation" aria-label="Pagination">
            <Cases>
                <li className="pagination-previous disabled" if={this.props.current <= 1}>上页</li>
                <li className="pagination-previous"><a href="#" onClick={e => this.click(this.props.current - 1)}>上页</a></li>
            </Cases>
            <For each="i" of={r}>
                {this.pbtn(i)}
            </For>
            <Cases>
                <li className="pagination-next disabled" if={this.props.current >= this.props.total}>下页</li>
                <li className="pagination-next"><a href="#" onClick={e => this.click(this.props.current + 1)}>下页</a></li>
            </Cases>
        </ul>
    }
    pbtn(i) {
        if (this.props.current == i) {
            return <li key={i} className="current">{i}</li>
        } else {
            return <li key={i}><a href="#" onClick={e => this.click(i)}>{i}</a></li>
        }
    }
    click(i) {
        if (this.props.onChange) {
            this.props.onChange(i);
        } else {
            setQuery({page:i});
        }
    }
}

function range(cur, width, total) {
    var min, max;
    if (total <= width) {
        min = 1;
        max = total;
    } else {
        max = cur - 0 + Math.floor(width / 2);
        if (max > total) {
            max = total;
        }
        min = max + 1 - width;
        if (min < 1) {
            min = 1;
            max = min + width - 1;
        }
    }
    var ret = [];
    for (var i = min; i <= max; i++)
        ret.push(i);
    return ret;
}