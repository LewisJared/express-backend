/**
 * The gulpfile for testing, linting and running an express backend server.
 * This server could be responsible for API or serving files. The options are
 * endless!
 *
 */
'use strict';

var CI = process.env.CI === 'true';

var gulp = require('gulp'),
  del = require('del'),
  env = require('gulp-env'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-spawn-mocha'),
  server = require('gulp-express'),
  q = require('q');

var config = {
  tests: 'server/**/*.spec.js',
  src: ['server/**/*.js', 'server/*.js', '!server/**/*.spec.js'],
  entry: 'server/app.js'
}

gulp.task('setEnvTest', function () {
  env({
    vars: {
      NODE_ENV: 'test'
    }
  });
});

gulp.task('setEnvDev', function () {
  env({
    vars: {
      NODE_ENV: 'development'
    }
  });
});

gulp.task('setEnvProd', function () {
  env({
    vars: {
      NODE_ENV: 'production'
    }
  });
});

gulp.task('test', function() {
  gulp.src('server/**/*.spec.js')
  .pipe(mocha({
    env: {'NODE_ENV': 'test'},
    R: CI ? 'mocha-bamboo-reporter' : 'spec'
  }))
});

gulp.task('jshint', function() {
  // lint the server code
  gulp.src(config.src)
  .pipe(jshint('.jshintrc'))
  .pipe(jshint.reporter('default'))

  //Now hint the tests and the gulpfile
  gulp.src([config.tests, 'gulpfile.js'])
  .pipe(jshint('.jshintrc-spec'))
  .pipe(jshint.reporter('default'))
})

gulp.task('express', ['jshint', 'test'], function() {
  gulp.run('setEnvDev');
  server.run([config.entry]);

  gulp.watch([config.src, config.entry], server.run)
});

gulp.task('watch', function() {
  gulp.watch([config.tests, config.src], ['jshint', 'test']);
})


/**
 * By default run the ex
 */
gulp.task('default', ['express']);
