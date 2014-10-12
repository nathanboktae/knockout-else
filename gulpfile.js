/*

  Gulpfile
  --------

 */
var gulp = require('gulp'),
    yaml = require('js-yaml'),
    fs = require('fs'),
    config = yaml.safeLoad(fs.readFileSync('./config.yaml', 'utf8')),
    plugins = require('gulp-load-plugins')();

// from https://github.com/ikari-pl/gulp-tag-version
function inc(importance) {
  console.log(" ----  >>>  Don't forget: $ git push --tag");
  return gulp.src(['./package.json' ])
    .pipe(plugins.bump({type: importance}))
    .pipe(gulp.dest('./'))
    .pipe(plugins.git.commit('bumps package version'))
    .pipe(plugins.filter('bower.json'))
    .pipe(plugins.tagVersion())
}

gulp.task('patch', function() { return inc('patch'); })
gulp.task('feature', function() { return inc('minor'); })
gulp.task('release', function() { return inc('major'); })

gulp.task('webserver', function () {
  gulp.src('.')
    .pipe(plugins.webserver(config.webserver));
})

gulp.task('js', function () {
  gulp.src("./index.js")
    .pipe(plugins.header(config.header))
    .pipe(plugins.footer(config.footer))
    .pipe(gulp.dest('./dist'))
});

gulp.task('watch', ['js'], function () {
  gulp.watch(config.watch, ['js'])
})

gulp.task('live', ['watch', 'webserver'])
gulp.task('default', ['live'])