/* gulpfile.js */
var 
    gulp = require('gulp'),
    sass = require('gulp-sass');

// source and distribution folder
var
    source = 'src/',
    dest = 'dist/';

// Bootstrap scss source
var bootstrapSass = {
        in: './node_modules/bootstrap-sass/'
    };

// Bootstrap native source
var bootstrapNative = {
        in: './node_modules/bootstrap.native/'
    };

// fonts
var fonts = {
        in: [source + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
        out: dest + 'fonts/'
    };

// css source file: .scss files
var css = {
    in: source + 'scss/main.scss',
    out: dest + 'css/',
    watch: source + 'scss/**/*',
    sassOpts: {
        outputStyle: 'nested',
        precision: 8,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

var bootstrapJs = {
   in: bootstrapNative.in + 'dist/bootstrap-native.js',
   out: dest + 'js/'
};
  
//gulp.task('fonts', function () {
//    return gulp
//        .src(fonts.in)
//        .pipe(gulp.dest(fonts.out));
//});

gulp.task('bootstrapJs', function () {
    return gulp
	  .src(bootstrapJs.in)
	  .pipe(gulp.dest(bootstrapJs.out));
});

// compile scss
gulp.task('sass', /*['fonts'],*/ function () {
    return gulp.src(css.in)
        .pipe(sass(css.sassOpts))
        .pipe(gulp.dest(css.out));
});

// default task
gulp.task('default', ['sass'], function () {
     gulp.watch(css.watch, ['sass']);
});
