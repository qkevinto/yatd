var eslint = require('gulp-eslint');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var babel = require('gulp-babel');
var sass = require('gulp-sass');

var paths = {
  base: './',
  js: {
    source: './app/js/source/*.js',
    dest: './app/js'
  },
  css: {
    source: './app/css/source/**/*.scss',
    dest: './app/css'
  },
  html: {
    source: './*.html'
  }
}

// JavaScript Linter
gulp.task('lint', function() {
  return gulp.src(paths.js.source)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Babel
gulp.task('babel', function() {
  return gulp.src(paths.js.source)
    .pipe(babel({
        presets: ['babel-preset-es2015']
    }))
    .pipe(gulp.dest(paths.js.dest));
});

// CSS
gulp.task('css', function() {
  return gulp.src(paths.css.source)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.css.dest))
    .pipe(browserSync.stream());
})

// JavaScript
gulp.task('js', ['lint', 'babel'], browserSync.reload);

// Build
gulp.task('build', ['css', 'js']);

// Serve
gulp.task('serve', ['build'], function () {
  browserSync({
    server: {
      baseDir: paths.base
    }
  });

  gulp.watch(paths.js.source, ['js']);
  gulp.watch(paths.css.source, ['css']);
  gulp.watch(paths.html.source, browserSync.reload);
});

// Default
gulp.task('default', ['serve']);
