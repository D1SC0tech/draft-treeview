const gulp = require('gulp');
const babel = require('gulp-babel');
const header = require('gulp-header');
const jasmine = require('gulp-jasmine');
const rename = require('gulp-rename');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const del = require('del');



var pkg = require('./package.json');

var headerLong = [
  '/*',
  '* <%= pkg.name %> - <%= pkg.description %>',
  '* version v<%= pkg.version %>',
  '* <%= pkg.homepage %>',
  '*',
  '* copyright <%= pkg.author %>',
  '* license <%= pkg.license %>',
  '*',
  '* BUILT: <%= pkg.buildDate %>',
  '*/\n'
].join('\n');

var headerShort = '/*<%= pkg.name %> v<%= pkg.version %> | <%= pkg.homepage %> | <%= pkg.license %> license*/\n';



gulp.task('clean', function() {
	del.sync(['dist/*']);
});

gulp.task('unify', ['clean'], function() {
  pkg.buildDate = Date();

  return gulp.src('draft-treeview.js')
    .pipe(header(headerLong, { pkg: pkg }))
    .pipe(gulp.dest('dist'))
    .pipe(size({showFiles: true, title: 'Full'}));
});

gulp.task('minify', ['unify'], function() {
  return gulp.src('dist/draft-treeview.js')
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(babel({ presets: ['es2015'] }))
      .pipe(uglify())
      .pipe(rename({ suffix:'.min' }))
      .pipe(size({ showFiles: true, title: 'Minified' }))
      .pipe(size({ showFiles: true, gzip: true, title: 'Gzipped' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'unify', 'minify'], function() {});