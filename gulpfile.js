// List dependencies
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const path = require('path');

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

// Create functions
function jsTask() {
  return gulp
    .src(jsSrcList, { allowEmpty: true })
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js))
    .pipe(browserSync.stream());
}

// Task to compile SCSS to app.css, then minify to app.min.css
function sassTask() {
  return gulp
    .src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      overrideBrowserslist: ['last 2 versions', '> 1%'],
      cascade: false
    })]))
    .pipe(concat('app.css')) // Concatenate into app.css first
    .pipe(gulp.dest(paths.css)) // Output app.css
    .pipe(cleanCSS()) // Minify the concatenated CSS
    .pipe(concat('app.min.css')) // Rename to app.min.css
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
}

// Task to initialize BrowserSync server
function browserSyncTask(done) {
  browserSync.init({
    server: {
      baseDir: '.' // Serve files from the current directory
    },
    notify: false
  });
  done();
}

// Watch task to monitor file changes and recompile
function watchTask() {
  gulp.watch(
    [paths.jsSrc, '!app.min.js', paths.scss, '!app.min.css'],
    gulp.parallel(jsTask, sassTask)
  );
  gulp.watch(['index.html']).on('change', browserSync.reload);
}

// Define default task
exports.default = gulp.series(
  gulp.parallel(jsTask, sassTask),
  browserSyncTask,
  watchTask
);