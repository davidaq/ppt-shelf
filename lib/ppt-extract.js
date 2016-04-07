import cp from 'child_process';
import fs from 'fs';
import rmdir from 'rmdir-recursive';

var extracting, statusText;

export function current() {
    return {
        id: extracting,
        status: statusText
    };
}

function nextFile() {
    if (extracting) return;
    fs.readdir('uploads', (err,list) => {
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var match = item.match(/([a-zA-Z0-9\-_]+)\.upl/);
            if (match) {
                extracting = match[1];
                statusText = '提取幻灯片内容';
                processFile();
                break;
            }
        }
    });
}

function processFile() {
    var p = cp.spawn('java', ['-jar', 'ppt-extract/ppt-extract.jar', 'uploads/' + extracting + '.upl', 'contents/' + extracting], {stdio:'inherit'});
    p.on('close', _ => {
        fs.readFile('contents/' + extracting + '/info.json', (err, content) => {
            if (!err && content) {
                try {
                    content = JSON.parse(content);
                } catch(e) {
                    content = null;
                }
            } 
            if (content) {
                getResults(content);
            } else {
                fs.unlink('uploads/' + extracting + '.upl', _ => {
                    extracting = null;
                    rmdir('contents/' + extracting, _ => {});
                });
            }
        });
    });
}

function getResults(info) {
    fs.rename('uploads/' + extracting + '.upl', 'contents/' + extracting + '/slideshow.pptx', err => {
        if (!err) {
            info._id = extracting;
            info.uploadTime = new Date();
            info.status = 'draft';
            db.from('contents').insert(info).then(_ => {
                extracting = null;
            });
        } else {
            extracting = null;
        }
    });
}

nextFile();
setInterval(nextFile, 3000);
