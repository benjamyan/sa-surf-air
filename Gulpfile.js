const gulp = require('gulp');
// const nunjucks = require('gulp-nunjucks');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const pages = [
    "index","experience"
]

gulp.task('nunjucks', async function() {
    return pages.forEach(function(current) {
        gulp.src('App/pages/'+current+'.+(html|njk)')
            .pipe(data(function() {
                return require('./App/content_'+current+'.json')
            }))
            .pipe(nunjucksRender({
                path: ['App/templates']
            }))
            .pipe(gulp.dest('App'))
    })
})
/*gulp.task('nunjucks', function() {
    return gulp.src('App/pages/*.+(html|njk)')
        .pipe(data(function() {
            return require('./App/content.json')
        }))
        .pipe(nunjucksRender({
            path: ['App/templates']
        }))
        .pipe(gulp.dest('App'))
})*/

exports.default = function() {
    //
};