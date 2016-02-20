// Require gulp
var gulp = require('gulp');

// Require other packages
var ftp = require('vinyl-ftp');
var gutil = require('gutil');
var rename = require('gulp-rename');

// Require config file for FTP server info
var config = require('../config/config');

// Define source/destination paths for build and deploy tasks
var deployDestination = config.deployDestination;
var srcDeployProd = ['./website/**/*'];

// FTP connection
var conn = ftp.create({
    host: config.serverHost,
    user: config.serverUser,
    password: config.serverPassword,
    parallel: 5,
    log: gutil.log
});

// Deploy function. Strips first folder, to put files in base directory.
function deploy (destination, inputStream) {
    return inputStream
        .pipe(rename(function (path) {
            var parts = path.dirname.split('/');
            parts.splice(0, 1);
            path.dirname = parts.join('/');
        }))
        .pipe(conn.newer(destination))
        .pipe(conn.dest(destination));
}

// Default task
gulp.task('default', ['deployAll']);

// Deploy all files to server
gulp.task('deployAll', function () {
    return deploy(deployDestination, gulp.src(srcDeployProd, {base: '.', buffer: false}));
});
