var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    sass   = require('gulp-ruby-sass'),
    prefixer = require('gulp-autoprefixer'),
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

gulp.task('prefixer', function(){
  gulp.src('css/application.min.css')
    //.pipe(prefixer())
    .pipe(prefixer({
      browsers: ['last 4 versions'],
        }))
    .pipe(gulp.dest('css'));
});
