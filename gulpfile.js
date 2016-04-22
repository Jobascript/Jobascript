var gulp = require('gulp');
var webpack = require('gulp-webpack');
var del = require('del');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');

var paths = {
  client: {
    src: './client/src/',
    dest: './client/dist/',
    scripts: './client/src/**/*.js'
  },
  server: {
    scripts: './server/**/*.js'
  }
};

gulp.task('clean', function() {
  return del([paths.client.dest + '**/*', '!' + paths.client.dest + '.gitkeep']);
});

// lint
gulp.task('lint-client', function(){
  return gulp.src(paths.client.scripts)
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('lint-server', function(){
  return gulp.src(paths.server.scripts)
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-client', ['clean'], function() {
  // move index.html
  gulp.src(paths.client.src + 'index.html')
    .pipe(gulp.dest(paths.client.dest));

  // webpack
  gulp.src(paths.client.src + 'app.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(paths.client.dest));
});

gulp.task('watch', function() {
  // client
  gulp.watch(paths.client.scripts, ['lint-client', 'build-client']);
  // server
  gulp.watch(paths.server.scripts, ['lint-server']);
});

gulp.task('default', ['watch', 'lint-client', 'lint-server', 'build-client']);
