var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-ruby-sass'),
    prefixer    = require('gulp-autoprefixer'),
    purify      = require('gulp-purifycss'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    runSequence = require('run-sequence');

// JS stuff

gulp.task('js', function(){
  return gulp.src(['js/*.js', '!js/*.min.js'])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'}))
    .pipe(gulp.dest('js/min'));
});

// Sass/CSS stuff

gulp.task('watch', function(){
  gulp.watch(['_sass/**/*.sass', '_sass/**/*.scss', 'css/development/*.css'], ['build-css']);
});

gulp.task('build-css', function(callback) {
  runSequence('sass2css',
              'prefix',
              'purify',
              'clean-css',
              callback);
});

gulp.task('sass2css', function(){
  console.log("Buidling your CSS from Sass");
  return sass('_sass/application.sass')
  //return sass('_sass/application.sass', { style: 'compressed' })
    .pipe(gulp.dest('css/development/'));
});

gulp.task('prefix', function(){
  console.log("Starting autoprefixer");
  return gulp.src('css/development/*.css')
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
    .pipe(gulp.dest('css/prefixed'));
});

gulp.task('purify', function() {
  console.log("Purifying your CSS from unused styles and minifying it");
  return gulp.src(['css/prefixed/*.css'])
    .pipe(purify(['_site/*.html'], { minify: true, rejected: true }))
    .pipe(gulp.dest('css/'));
});

gulp.task('clean-css', function() {
  return del(['css/prefixed', 'css/*.min.css']);
});
