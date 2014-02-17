var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
 
var paths = {
  scripts: ['src/js/**/*.js']
};
 
var brConfig = {
	shim: {
    angular: {
      path: './bower_components/angular/angular.js',
      exports: 'angular'
    },
    ngRoute: {
      path: './bower_components/angular-route/angular-route.js',
      exports: 'ngRoute'
    },
    ngSocket: {
      path: './bower_components/angular-socket-io/socket.js',
      exports: 'socketFactory'
    }
  },
  debug: true
};

var browserifier = function() {
  gulp.src('src/js/app.js')
    .pipe(browserify(brConfig))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./public/js/'));
};

gulp.task('scripts', browserifier);
 
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('jshint', function() {
  gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
 
gulp.task('default', ['scripts', 'watch']);

gulp.task('nodemon', function () {
  nodemon({script: 'app.js', options: '-i ./public/js/*'}).on('restart', function() {
    browserifier();
  });
});