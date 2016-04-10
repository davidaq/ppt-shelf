var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var newer = require('gulp-newer');
var filter = require('gulp-filter');
var print = require('gulp-print');
var foreach = require('gulp-foreach');
var browserify = require('browserify');
var concat = require('concat-stream');
var cp = require('child_process');
var fs = require('fs');
var path = require('path');

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return file[0] != '_' && fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('build-widgets', function() {
    var babelConfig = JSON.parse(fs.readFileSync('.babelrc'));
    var existing = {};
    return gulp.src('widgets/**/*.js', {read:false})
        .pipe(filter(function(file) {
            var fpath = path.relative('.', file.path).split(/[\\\/]/);
            return fpath.length > 2 && fpath[1][0] != '_';
        }))
        .pipe(newer({
            dest: 'widgets',
            map: function(f) {
                return f.split(/[\\\/]/)[0] + '.js';
            }
        }))
        .pipe(filter(function(file) {
            var mod = path.relative('.', file.path).split(/[\\\/]/)[1];
            if (existing[mod])
                return false;
            existing[mod] = true;
            gutil.log('Update widgets set:', mod);
            return true;
        }))
        .pipe(foreach(function(stream, file) {
            var mod = path.relative('.', file.path).split(/[\\\/]/)[1];
            var tmpFile = path.join('widgets', mod, '__prepared__index.jsx'), fileContent;
            fs.readFile(path.join('widgets', mod, 'index.js'), function(err, fileContent) {
                if (err) {
                    return console.error(err.stack);
                }
                fileContent = fileContent.toString('utf-8') + ';$EXP$ = exports;';
                writeAtomic(tmpFile, fileContent, function(err) {
                    if (err) {
                        return console.error(err.stack);
                    }
                    bundle();
                });
            });
            return stream;
            function bundle() {
                browserify(tmpFile)
                    .transform({global:true}, "babelify", babelConfig)
                    .transform({global:true}, require('browserify-global-shim').configure({
                        'react': 'React',
                        'react-dom': 'ReactDOM'
                    }))
                    .transform({global:true}, "uglifyify")
                    .bundle()
                    .on('error', function(err){
                        console.error(err.message);
                        this.emit('end');
                    })
                    .pipe(concat(function(content) {
                        if (Buffer.isBuffer(content))
                            content = content.toString('utf-8');
                        writeResult(content);
                    }));
            }
            function writeResult(content) {
                content = '(function(func){'
                + ' if (typeof window == "undefined") {\n'
                + '  var fake={};\n'
                + '  fake.React=require("react");\n'
                + '  fake.ReactDOM=require("react-dom");\n'
                + '  module.exports = func.bind(this, fake);\n'
                + ' } else {\n'
                + '  window.Widgets = window.Widgets||{};\n'
                + '  window.Widgets[' + JSON.stringify(mod) + '] = func(window, {get:function(name) {return window.Widgets[name]}});\n'
                + ' }'
                + '})(function(window, widgets) {var $EXP$ = {};\n' + content + ';return $EXP$;})';
                writeAtomic(path.join('widgets', mod + '.js'), content, function(err) {   
                    if (err) {
                        console.error(err.message);
                    }
                    fs.unlink(tmpFile, function(err) {
                        if (err) {
                            return console.error(err.message);
                        }
                        gutil.log.bind(gutil, "Update widgets set done:", mod);
                    });
                });
            }
            function writeAtomic(path, content, cb) {
                var swp = path + '.' + new Date().getTime() + '.swp';
                fs.writeFile(swp, content, function(err) {
                    if (err) return cb(err);
                    fs.rename(swp, path, function(err) {
                        cb(err);
                    });
                });
            }
        }))
});

gulp.task('start-dev-server', (function() {
    var serverProcess, serverRestartDelay = 0, serverRestartTimeout;
    setInterval(function() {
        if (serverRestartDelay > 0)
            serverRestartDelay -= 1000;
    }, 1000);
    
    process.on('beforeExit', kill);
    process.on('SIGINT', kill)
    function kill() {
        if (serverProcess) {
            serverRestartDelay = 0xffffff;
            serverProcess.kill();
            serverProcess = null;
        }
        process.exit(0);
    }

    function startServer() {
        serverRestartTimeout = null;
        serverProcess = cp.spawn('node', ['index.js','--dev'], {stdio:'inherit'});
        serverRestartDelay = 10000;
        serverProcess.once('close', function() {
            gutil.log('Server closed');
            serverProcess = {kill:function() {
                if (serverRestartTimeout)
                    clearTimeout(serverRestartTimeout);
                serverRestartTimeout = setTimeout(startServer, serverRestartDelay);
            }};
            serverProcess.kill();
        });
    }
    return function() {
        if (serverProcess) {
            serverRestartDelay = 200;
            serverProcess.kill();
        } else {
            startServer();
        }
    };
})());

gulp.task('default', ['start-dev-server', 'build-widgets'], function() {
    gulp.watch('lib/**/*.js', ['start-dev-server']);
    gulp.watch('widgets/**/*.js', ['build-widgets']);
});
