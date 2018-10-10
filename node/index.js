var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    config      = require('./config.json'),
    babel       = require('gulp-babel'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify');

    gulp.task('scss-compiler', function () {
    gulp.src(config.styles.source + "/style.scss")
    .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.styles.distribution));
});

gulp.task('js-compiler', () =>
    gulp.src(config.js.source + "/main.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env'],
        compact: true,
    }))
    .pipe(sourcemaps.write())
    .pipe(uglify())
    .pipe(gulp.dest(config.js.distribution))
);

gulp.start('scss-compiler');
gulp.start('js-compiler');