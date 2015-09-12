var gulp = require('gulp');
var jade = require('gulp-jade'); // jadeのコンパイル用
var stylus = require('gulp-stylus'); // stylusのコンパイル用
var plumber = require('gulp-plumber'); // watchが止まらないように
var notify  = require('gulp-notify'); // エラーの通知用
var concat = require('gulp-concat'); // ファイルを一つにまとめる
var browserSync = require('browser-sync'); // オートリロード
var pleeease = require('gulp-pleeease'); // ベンダープレフィックスの自動付与, CSSの圧縮
var webpack = require('gulp-webpack'); // JSの依存関係解決ツール
var uglify = require('gulp-uglify'); // JSの圧縮化
var imagemin = require('gulp-imagemin'); // 画像の圧縮化
var cache = require('gulp-cached'); // 変更したファイルだけ処理

// ======================================================================

// jade compile
gulp.task('jade', function() {
  gulp.src(['app/view/*', '!' + 'app/view/_*.jade'])
    .pipe(plumber({
        errorHandler: notify.onError("jadeのエラーですわよ！: <%= error.message %>")
      }))
    .pipe(jade({
        pretty: true // HTML minify
      }))
    .pipe(gulp.dest('dist/'))
});

// ======================================================================

// stylus compile
gulp.task('stylus', function() {
  //gulp.src(['app/stylus/**/*.styl', 'app/stylus/**/!(_)*'])
  gulp.src('app/stylus/*')
    .pipe(cache('stylus'))
    .pipe(plumber({
        errorHandler: notify.onError("stylusのエラーですわよ！: <%= error.message %>")
      }))
    .pipe(stylus())
    .pipe(pleeease({
        fallbacks: {
            autoprefixer: ['last 2 versions']
        },minifier: true // CSS minify
    }))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.reload({stream: true}));
});

// ======================================================================

// javascript compile
gulp.task('js', function() {
  gulp.src('app/js/*.js')
  .pipe(plumber({
      errorHandler: notify.onError("JSのエラーですわよ！: <%= error.message %>")
    }))
  .pipe(concat('script.js'))
  .pipe(uglify({preserveComments: 'some'})) // javascript minify
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.reload({stream: true}));
});

// ======================================================================

// image minify
gulp.task('imagemin', function() {
  gulp.src('app/img/**/*.{png,jpg,gif,svg}')
  .pipe(imagemin({optimizationLevel: 7}))
  .pipe(gulp.dest('dist/img'))
});

// ======================================================================

// server
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./dist",
      index: "index.html"
    }
  });
});

// ======================================================================

// browser reload
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// ======================================================================

gulp.task('default', ['browser-sync'], function() {
  gulp.watch('./app/stylus/*.styl', ['stylus']);
  gulp.watch('./app/js/*.js',['js']);
  gulp.watch('./app/view/*', ['jade']);
  gulp.watch('./app/img/**/*.{png,jpg,gif,svg}',['imagemin']);
  gulp.watch("./dist/*.html", ['bs-reload']);
});
