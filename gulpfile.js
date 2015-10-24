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
});

// CSS
gulp.task('css', function() {
  return gulp.src('./css/source/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
})

// JavaScript
gulp.task('js', ['lint', 'babel'], browserSync.reload);

// Serve
gulp.task('serve', ['lint'], function () {
  browserSync({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch('./js/*.js', ['js']);
  gulp.watch('./css/*.scss', ['css']);
});

// Default
gulp.task('default', ['serve']);
