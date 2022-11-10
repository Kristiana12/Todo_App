const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// sass task
function sassTask() {
  return src('./src/sass/**/*.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('./public/css', { sourcemaps: '.' }));
}

// javascript task
function jsTask() {
  return src('./src/js/**/*.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('./public/js', { sourcemaps: '.' }));
}

// browsersync
function browserSyncServer(callback) {
  browsersync.init({
    server: {
      baseDir: '.',
    },
  });
  callback();
}

function browserSyncReload(callback) {
  browsersync.reload();
  callback();
}

// watch task
function watchTask() {
  watch('*.html', browserSyncReload);
  watch(
    ['./src/sass/**/*.scss', './src/js/**/*.js'],
    series(sassTask, jsTask, browserSyncReload)
  );
}

// gulp workflow
exports.default = series(sassTask, jsTask, browserSyncServer, watchTask);
