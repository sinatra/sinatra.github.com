var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    sass   = require('gulp-ruby-sass'),
    rename = require('gulp-rename');

gulp.task('js', function(){
  gulp.src(['js/*.js', '!js/*.min.js'])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'}))
    .pipe(gulp.dest('js/min'));
});

gulp.task('css', function(){
  sass('_sass/application.sass', { style: 'compressed' })
    .pipe(rename({
      suffix: '.min'}))
    .pipe(gulp.dest('css'));
});
