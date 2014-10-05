var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var jsfiles = ['./app/bower/pleasejs/dist/Please.js', './app/bower/react/react.js', './app/views/*.js', './app/providers/*.js'];

gulp.task('dev', function () {
  gulp.watch(jsfiles, ['scripts']);
});

gulp.task('prod', function () {
  gulp.watch(jsfiles, ['compress']);
});

gulp.task('scripts', function() {
  gulp.src(jsfiles)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('compress', function() {
  gulp.src(jsfiles)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});
