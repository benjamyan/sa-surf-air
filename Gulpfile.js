const gulp = require('gulp');
const image = require('gulp-image');
const nunjucks = require('gulp-nunjucks');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const nunEnv = new nunjucksRender.nunjucks.Environment();

const pages = ["index","experience","on-demand","scheduled","memberships"]
gulp.task('nunjucks', async function() {
    return pages.forEach(function(current) {
        gulp.src(`Nunjucks/pages/${current}.+(html|njk)`)
            .pipe(data(function() {
                return require(`./Nunjucks/content_${current}.json`)
            }))
            .pipe(nunjucksRender({
                path: ['Nunjucks/templates']
            }))
            .pipe(gulp.dest('App'))
    })
});
gulp.task('image', () => {
    gulp.src('./App/media/*')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            guetzli: false,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true // defaults to false
        }))
        .pipe(gulp.dest('./App'));
});

exports.default = function() {
    //
};