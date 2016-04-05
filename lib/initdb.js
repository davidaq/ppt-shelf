import {MongoClient} from 'mongodb';
import {password} from './crypt';
import {generate as shortid} from 'shortid';

MongoClient.connect('mongodb://localhost/pptshelf', (err, db) => {
    if (err) {
        console.error(err.stack || err);
        return;
    }
    const User = db.collection('user');
    const Settings = db.collection('settings');
    Promise.resolve().then(r => {
        console.log('> 创建user索引');
        return callPromised(User, 'createIndex', {
            loginname: 1
        }, {
            unique: true
        })
    }).then(_ => {
        console.log('> 创建admin账号');
        return callPromised(User, 'insert', {
            _id: shortid(),
            loginname: 'admin',
            password: password('admin'),
            username: '超级管理员',
            level: 'super'
        }).catch(e => console.log('已存在'))
    }).then(_ => {
        console.log('> 创建初始设置');
        return callPromised(Settings, 'insert', {
            _id: 'main',
            siteName: '诗歌总集',
            siteDesc: '我的PPT书架',
            allowRegister: true,
            allowGuestDownload: true
        }).catch(e => console.log('已存在设置'))
    }).then(_ => {
        console.log('> 数据库初始化完成');
    }).catch(e => {
        console.error('> 发生错误：');
        console.error(e.stack || e);
    }).then(_ => {
        db.close();
    })
});

function callPromised() {
    var obj = arguments[0];
    var method = arguments[1];
    var args = Array.prototype.slice.call(arguments, 2);
    return new Promise((res, rej) => {
        args.push((err,result) => {
            if (err) rej(err);
            else res(result);
        });
        obj[method].apply(obj, args);
    });
}