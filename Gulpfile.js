const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');

gulp.task('nunjucks', function() {
    // Gets .html and .njk files in pages
    return gulp.src('App/pages/*.+(html|njk)')
    // import the data
    .pipe(data(function() {
        return require('./App/content.json')
    }))
    // Renders template with nunjucks
    .pipe(nunjucksRender({
        path: ['App/templates']
    }))
    // output files in app folder
    .pipe(gulp.dest('App'))
})

function clean(cb) {
    // body omitted
    cb();
}

function javascript(cb) {
    // body omitted
    cb();
}

function css(cb) {
    // body omitted
    cb();
}

exports.default = function() {
    // You can use a single task
    watch('src/*.css', css);
    // Or a composed task
    watch('src/*.js', series(clean, javascript));
};