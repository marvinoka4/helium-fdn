const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const purgecss = require('@fullhuman/postcss-purgecss').default;
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

const paths = {
  scss: 'assets/styles/scss/**/*.scss',
  css: 'assets/styles/css/',
  jsSrc: 'assets/scripts/js/vendor/**/*.js',
  js: 'assets/scripts/js/',
};

const jsSrcList = [
  './assets/scripts/js/vendor/jquery.js',
  './assets/scripts/js/vendor/what-input.js',
  './assets/scripts/js/vendor/foundation.js',
  './assets/scripts/js/vendor/app.js',
];

function jsTask() {
  return gulp
    .src(jsSrcList, { allowEmpty: true })
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js))
    .pipe(browserSync.stream());
}

function sassTask() {
  return gulp
    .src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', '> 1%'],
        cascade: false
      }),
      purgecss({
        content: [
          '*.html',
          'assets/scripts/js/vendor/jquery.js',
          'assets/scripts/js/vendor/what-input.js',
          'assets/scripts/js/vendor/foundation.js',
          'assets/scripts/js/vendor/app.js'
        ],
        safelist: [
          'is-active',
          /hamburger-/,
          /foundation-/,
          'off-canvas-content', // Base class
          /is-open-/, // e.g., is-open-right, is-open-left
          'has-transition-push' // Animation class
        ]
      })
    ]))
    .pipe(concat('app.css'))
    .pipe(gulp.dest(paths.css))
    .pipe(cleanCSS())
    .pipe(concat('app.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
}

function browserSyncTask(done) {
  browserSync.init({
    server: {
      baseDir: '.'
    },
    notify: false
  });
  done();
}

function watchTask() {
  gulp.watch(paths.jsSrc, jsTask).on('change', file => console.log('JS Changed:', file));
  gulp.watch(paths.scss, sassTask).on('change', file => console.log('SCSS Changed:', file));
  gulp.watch('*.html').on('change', function(file) {
    console.log('HTML Changed:', file);
    gulp.series(sassTask, function reload(done) {
      browserSync.reload();
      done();
    })();
  });
}

exports.default = gulp.series(
  gulp.parallel(jsTask, sassTask),
  browserSyncTask,
  watchTask
);


