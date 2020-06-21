const gulp = require('gulp');
const image = require('gulp-image');
const nunjucks = require('gulp-nunjucks');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const nunEnv = new nunjucksRender.nunjucks.Environment();

const destination = 'App'
const pages = [
    "index",
    "experience",
    "on-demand",
    "scheduled",
    "memberships"
]
gulp.task('nunjucks', async function() {
    return pages.forEach(function(current) {
        gulp.src(`Nunjucks/pages/${current}.+(html|njk)`)
            .pipe(data(function() {
                return require(`./Nunjucks/content_${current}.json`)
            }))
            .pipe(nunjucksRender({
                path: ['Nunjucks/templates']
            }))
            .pipe(gulp.dest(destination));
    })
});
gulp.task('image', async function() {
    return pages.forEach(function(current) {
        gulp.src(`Nunjucks/media/image/${current}/*.+(jpg|svg|gif|png)`)
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
                quiet: true
            }))
            .pipe(gulp.dest(`${destination}/media/image/${current}`)
        );
    })
});

exports.default = function() {
    //
};