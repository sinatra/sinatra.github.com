var gulp     = require('gulp'),
    uglify   = require('gulp-uglify'),
    sass     = require('gulp-ruby-sass'),
    prefixer = require('gulp-autoprefixer'),
    rename   = require('gulp-rename');

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
    .pipe(gulp.dest('css/min'));
});

gulp.task('prefix', function(){
  gulp.src('css/min/application.min.css')
    .pipe(prefixer({
      browsers: [
        '> 1%',
        'last 4 versions',
        'firefox >= 4',
        'safari 7',
        'safari 8',
        'IE 8',
        'IE 9',
        'IE 10',
        'IE 11'
      ],
      cascade: false
        }))
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function(){
  gulp.watch('_sass/*.sass', ['css']),
  gulp.watch('css/min/application.min.css', ['prefix']);
});
