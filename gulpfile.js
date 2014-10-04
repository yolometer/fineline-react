var concat = require('gulp-concat');

gulp.task('scripts', function() {
  gulp.src(['./app/views/*.js', './app/providers/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js'))
});
