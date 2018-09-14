var gulp         = require('gulp');
var autoprefixer = require('autoprefixer');
var postcss      = require('gulp-postcss');
var sass         = require('gulp-sass');
var babel        = require('gulp-babel');
var plumber      = require('gulp-plumber');
var eslint       = require('gulp-eslint');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');

// Asset paths
var paths = {
  sass: './sass/**/*.scss',
  js: './js/**/*.js',
  distJs: './dist/**/*.js'
};

gulp.task('default', ['sass', 'es6', 'watch']);

/**
 * Minify JavaScript
 */
gulp.task('compress', function () {
  return gulp.src(paths.distJs)
    .pipe(uglify())
    .pipe(rename('typeit.min.js'))
    .pipe(gulp.dest('./dist/js'))
});

/**
 * Compile Sass
 */
gulp.task('sass', function () {
  return gulp.src(paths.sass)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 version']
      })
    ]))
    .pipe(gulp.dest('./dist/css'));
});

/**
 * Compile JS
 */
gulp.task('es6', function () {
  return gulp.src([
      'node_modules/babel-polyfill/dist/polyfill.js',
      paths.js
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(plumber())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('./dist/js'));
});

/**
 * Watcher
 */
gulp.task('watch', function () {
  gulp.watch(paths.js, ['es6']);
  gulp.watch(paths.sass, ['sass']);
});
