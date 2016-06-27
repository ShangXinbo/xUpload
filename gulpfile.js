var combiner = require('stream-combiner2');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulp = require('gulp');

var release_version = '1.2.0'

gulp.task('js compress', function() {
    var dest = 'dist/';
    var demo_js = 'public/js/'
    return gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(dest))
        .pipe(gulp.dest(demo_js));
});
gulp.task('default', ['js compress']);