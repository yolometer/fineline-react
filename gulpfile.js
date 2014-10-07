var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inlinesource = require('gulp-inline-source');
var rename  = require('gulp-rename');



var jsfiles = ['./app/bower/pleasejs/dist/Please.js', './app/bower/react/react-with-addons.js', './app/views/*.js', './app/providers/*.js'];
var indexhtml = ['./app/index.html'];

gulp.task('dev', function () {
  gulp.watch(jsfiles, ['scripts']);
  gulp.watch(indexhtml, ['dev_html']);
});

gulp.task('prod', function () {
  gulp.watch(jsfiles.concat(indexhtml), ['prod_html']);
});

gulp.task('dev_html', function () {
  gulp.src(indexhtml)
    .pipe(rename(function(path) {
      path.dirname = "./public"
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('prod_html', ['compress'], function () {
  gulp.src(indexhtml)
    .pipe(inlinesource('./public'))
    .pipe(gulp.dest('./public'));
});


gulp.task('scripts', function () {
  gulp.src(jsfiles)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('compress', function () {
  gulp.src(jsfiles)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});
