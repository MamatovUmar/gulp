let gulp = require('gulp');
let sass = require('gulp-sass');
let rollup = require('rollup');
let resolve = require('rollup-plugin-node-resolve');
let babel = require('rollup-plugin-babel');
let postcss = require('gulp-postcss');
let uglify = require('gulp-uglify');
let minifyCSS = require('gulp-minify-css');
let rename = require("gulp-rename");
const image = require('gulp-image');


// development  ----------------------------

gulp.task('dev:scss', () => {
    return gulp.src('src/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss())
        .pipe(gulp.dest('./src/css'))
});

gulp.task('dev:js', () => {
    return rollup.rollup({
        input: 'src/js/scripts.js',
        plugins: [
            resolve(),
            babel({
                exclude: 'node_modules/**'
            }),
        ],
    }).then(bundle => {
        return bundle.write({
            file: 'src/js/main.js',
            format: 'iife'
        });
    });
});


gulp.task('watch', () => {
    gulp.watch('src/scss/**/*.scss', gulp.series('dev:scss'));
    gulp.watch('src/js/**/*.js', gulp.series('dev:js'));
});

gulp.task('default', gulp.series(
    'dev:scss',
    'dev:js',
    gulp.parallel(
        'watch'
    )
));



// production  -------------------

gulp.task('build:css', () => {
    return gulp.src('src/css/*.css')
        .pipe(rename('main.css'))
        .pipe(gulp.dest('./build/css'))
        .pipe(minifyCSS())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./build/css'))
});

gulp.task('build:js', () => {
    return gulp.src('src/js/main.js')
        .pipe(rename('main.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('./build/js'))
});

gulp.task('build:images', () => {
    return gulp.src('src/images/**/*', {
            allowEmpty: true
        })
        .pipe(image())
        .pipe(gulp.dest('build/images'));
});

gulp.task('build:fonts', () => {
    return gulp.src('src/fonts/**/*', {
            dot: true,
            allowEmpty: true
        })
        .pipe(gulp.dest('build/fonts'))
});

gulp.task('build:html', () => {
    return gulp.src('src/**/*.html', {
            dot: true,
            allowEmpty: true
        })
        .pipe(gulp.dest('build/'))
});

gulp.task('build', gulp.parallel(
    'build:css',
    'build:js',
    'build:images',
    'build:fonts',
    'build:html'
));












// gulp.task('build:js', () => {
//     return gulp.src('src/js/build.js')
//         .pipe(minify())
//         .pipe(gulp.dest('./build/js'))
// });


// gulp.task('build:images', () => {
//     return gulp.src('src/images/**/*', {
//             allowEmpty: true
//         })
//         .pipe(gulp.dest('build/images'));
// });