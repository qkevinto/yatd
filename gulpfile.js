var eslint = require('gulp-eslint');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var babel = require('gulp-babel');
var sass = require('gulp-sass');

// JavaScript Linter
gulp.task('lint', function() {
  return gulp.src('./js/source/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Babel
gulp.task('babel', function() {
  return gulp.src('./js/source/*.js')
      .pipe(babel())
      .pipe(gulp.dest('./js/'));
0});

// Sass
gulp.task('sass', function() {
  return gulp.src('./css/source/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
})

// JavaScript
gulp.task('js', ['lint', 'babel'], browserSync.reload);

// Serve
gulp.task('serve', ['js', 'sass'], function () {
  browserSync({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch('./js/source/*.js', ['js']);
  gulp.watch('./css/source/*.scss', ['sass']);
});

// Default
gulp.task('default', ['serve']);
