var gulp = require('gulp');
var webserver = require('gulp-webserver');

gulp.task('webserver', function() {
    gulp.src('app')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true,
            fallback: 'index.html'
        }));
});

gulp.task('watch', function(){
    gulp.watch(['app/*.*']);
});

gulp.task('default', ['webserver', 'watch'])