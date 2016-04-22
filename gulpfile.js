var gulp = require('gulp');
var webpack = require('gulp-webpack');
var del = require('del');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');

var paths = {
  client: {
    entry: './client/src/',
    dest: './client/dist/',
    scripts: './client/src/**/*.js'
  }
};

gulp.task('clean', function() {
  return del([paths.client.dest + '**/*', '!' + paths.client.dest + '.gitkeep']);
});

// lint
gulp.task('lint', function(){
  return gulp.src(paths.client.scripts)
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('build-client', ['clean'], function() {
  // move index.html
  gulp.src(paths.client.entry + 'index.html')
    .pipe(gulp.dest(paths.client.dest));

  // webpack
  gulp.src(paths.client.entry + 'app.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(paths.client.dest));
});

gulp.task('watch', function() {
  // client
  gulp.watch(paths.client.scripts, ['build-client']);
});

gulp.task('default', ['watch']);

// handle error