const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');


const pages = [
    "index",
    "experience"
]
gulp.task('nunjucks', async function() {
    return pages.forEach(function(current) {
        gulp.src(`App/pages/${current}.+(html|njk)`)
            .pipe(data(function() {
                return require(`./App/content_${current}.json`)
            }))
            .pipe(nunjucksRender({
                path: ['App/templates']
            }))
            .pipe(gulp.dest('App'))
    })
});
gulp.task('css', function () {
    const postcss = require('gulp-postcss')
  
    return gulp.src('App/css/output.css')
      .pipe(postcss([
        require('tailwindcss'),
        require('autoprefixer'),
      ]))
      .pipe(gulp.dest('App/css'))
})


exports.default = function() {
    //
};