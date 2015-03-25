var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var spawn = require('child_process').spawn;
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = '_site/'


// Run Jekyll Build Asynchronously
gulp.task('jekyll', ['sass', 'bower', 'scripts'], function () {
    var jekyll = spawn('jekyll', ['build']);

    jekyll.on('exit', function (code) {
        console.log('-- Finished Jekyll Build --');
        reload();
    })
});


// Compile SASS
gulp.task('sass', function(cb) {
  return gulp.src('_scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('_site/css'))
    .pipe(reload({stream: true}, cb));
});

gulp.task('bower', function(cb) {
  return gulp.src([
    'bower_components/bootstrap-sass/assets/fonts/bootstrap/*',
    'bower_components/fontawesome/fonts/*',
    'bower_components/animate.css/animate.min.css'
  ], {base: '.'})
  .pipe(gulp.dest('css'), cb);
});

gulp.task('scripts', function(cb) {
  return gulp.src([
    'bower_components/jquery/dist/*.min.*',
    'bower_components/pace/*.min.js',
    'bower_components/bootstrap-sass/assets/javascripts/*.min.js',
    'bower_components/wow/dist/*.min.js',
    'bower_components/classie/classie.js',
    'bower_components/animated-header/js/animated-header.js'
  ])
  .pipe(gulp.dest('js/vendor'), cb);
});


// Run static file server
gulp.task('serve', ['jekyll'], function() {
  browserSync({
    server: {
      baseDir: EXPRESS_ROOT,
      port: EXPRESS_PORT
    }
  });
});

// Watch for changes
gulp.task('watch', function () {
    // Manually compile and inject css to avoid jekyll overhead, and utilize livereload injection
    gulp.watch('_scss/**', ['sass']);

    // Watch for changes to other files for jekyll compilation
    // Note: This will probably need to be updated with the files you want to watch
    // Second Note: MAKE SURE that the last to items in the watchlist are included or else infinite jekyll loop
    gulp.watch(['*.html', '*/*.html', 'js/*.js', '*/*.md', '!_site/**', '!_site/*/**'], ['jekyll']);
})


gulp.task('default', ['jekyll', 'serve', 'watch']);
