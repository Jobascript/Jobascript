/* eslint-env es6 */
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var del = require('del');
var eslint = require('gulp-eslint');
var watch = require('gulp-watch');
var mocha = require('gulp-spawn-mocha');
var gulpSequence = require('gulp-sequence');

var paths = {
  client: {
    src: './client/src/',
    dest: './client/dist/',
    scripts: './client/src/**/*.js',
    styles: './client/src/**/*.css'
  },
  server: {
    scripts: './server/**/*.js',
    test: './spec/server/**/*.js'
  }
};

gulp.task('clean', function() {
  return del([paths.client.dest + '**/*', '!' + paths.client.dest + '.gitkeep']);
});

// tests
gulp.task('test-server',  function () {
  return gulp.src([paths.server.test, './spec/server/test.js', '!./spec/server/apiSpec.js'], {read: false})
  .pipe(mocha({
    env: {'NODE_ENV': 'test'}
  }))
  .once('error', function () {
    process.exit(1);
  });
});

// lint
gulp.task('lint-client', function(){
  return gulp.src(paths.client.scripts)
  .pipe(eslint())
  .pipe(eslint.format());
  // .pipe(eslint.failAfterError());
});

gulp.task('lint-server', function(){
  return gulp.src(paths.server.scripts)
  .pipe(eslint())
  .pipe(eslint.format());
  // .pipe(eslint.failAfterError());
});

gulp.task('build-client', function() {
  // move index.html
  gulp.src(paths.client.src + 'index.html')
    .pipe(gulp.dest(paths.client.dest));

  // webpack
  gulp.src(paths.client.src + 'app.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(paths.client.dest));
});

gulp.task('server', done => gulpSequence('lint-server', 'test-server')(done));
gulp.task('client', done => gulpSequence('clean', 'lint-client', 'build-client')(done));
gulp.task('startup', done => gulpSequence('server', 'client')(done));

gulp.task('watch', function() {
  // client
  gulp.watch(paths.client.src + '**/*', ['client']);
  // server
  gulp.watch(paths.server.scripts, ['server']);
});

gulp.task('default', ['watch', 'startup']);
