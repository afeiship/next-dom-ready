(function () {

  var gulp = require('gulp');
  var del = require('del');
  var uglify = require('gulp-uglify');
  var rename = require('gulp-rename');

  gulp.task('clean', function () {
    return del('dist');
  });

  gulp.task('scripts', function () {
    gulp.src('src/*.js')
      .pipe(gulp.dest('dist'))
      .pipe(uglify())
      .pipe(rename({ extname:'.min.js'}))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('default', ['clean'],function(){
    return gulp.start(['scripts']);
  });

}());
