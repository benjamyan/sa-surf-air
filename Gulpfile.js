const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const data = require('gulp-data');
const nunjucksRender = require('gulp-nunjucks-render');
const image = require('gulp-image');
const imageResizer = require('gulp-images-resizer');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
const rename = require('gulp-rename');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const favicons = require('gulp-favicons');
const debug = require('gulp-debug');

const directory = {
    root: {
        parent: 'nunjucks',
        template: 'templates',
        build: 'pages',
        content: 'content',
        script: 'script',
        style: 'style',
        image: {
            src: 'assets/image',
            ext: 'jpg|svg|gif|png'
        },
        video: {
            src: 'assets/video',
            ext: 'mp4|ogg|webm'
        },
        favi: {
            src: 'assets/favicon',
            ext: 'png|ico|xml|json'
        },
        font: {
            src: 'assets/fonts',
            ext: 'woff|woff2|ttf|otf|svg'
        }
    },
    files: {
        pages: [
            'base',
            'index',
            'experience',
            'on-demand',
            'scheduled',
            'memberships'
        ],
        style: {
            exclude: [
                'normalize'
            ],
            include: [
                'style'
            ]
        },
        script: {
            exclude: [
                'jquery-latest',
                'barba.min',
                'gsap.min',
                'scrollMagic.min',
                'plugin.min',
                'polyfill.min',
                'helper',
                'interaction',
                'transition',
                'animation',
                'app'
            ],
            include: [
                //
            ]
        }
    },
    dist: {
        parent: 'app',
        style: 'css',
        script: 'js',
        image: 'assets/image',
        video: 'assets/video',
        favi: 'assets/favicon',
        font: 'assets/fonts'
    }
};

gulp.task('nunjucks', async function() {
    const target = directory.files.pages;
    return target.forEach(function(current) {
        gulp.src(`${directory.root.parent}/${directory.root.build}/${current}.+(html|njk)`)
            .pipe(data(function() {
                return require(`./${directory.root.parent}/${directory.root.content}/${current}.json`)
            }))
            .pipe(nunjucksRender({
                path: [ directory.root.parent + '/' + directory.root.template ]
            }))
            .pipe(gulp.dest(directory.dist.parent)
        );
    })
});

gulp.task('sass', async function() {
    const target = directory.files.style.include.concat(directory.files.style.exclude);
    return target.forEach(function(current){
        const isSASS = function(file) {
            if (file.extname == '.scss') return true
        };
        gulp.src(`${directory.root.parent}/${directory.root.style}/*.+(scss|css)`)
            .pipe(gulpIf(isSASS, sass()))
            .pipe(gulpIf(isSASS, minify()))
            .pipe(gulp.dest(
                `${directory.dist.parent}/${directory.dist.style}`
            ));
    }) 
});

gulp.task('script', async function() {
    const target = directory.files.script.include.concat(directory.files.script.exclude);
    return target.forEach(function(current){
        const isInclude = function() {
            (directory.files.script.include).forEach(function(currFile){
                if (currFile === current) return true
            })
        };
        gulp.src(`${directory.root.parent}/${directory.root.script}/${current}.js`)
            .pipe(gulpIf(isInclude, concat('main.js')))
            /*.pipe(gulpIf(isInclude, minify({
                ext:{
                    src: 'main.js',
                    min:'.js'
                }
            })))*/
            .pipe(
                gulp.dest(`${directory.dist.parent}/${directory.dist.script}`)
            );
    })
});

gulp.task('video', async function(){
    const target = directory.files.pages;
    return target.forEach(function(current){
        gulp.src(`${directory.root.parent}/${directory.root.video.src}/${current}/*.+(${directory.root.video.ext})`)
            .pipe(gulp.dest(`${directory.dist.parent}/${directory.dist.video}/${current}`)
        );
    })
});

gulp.task('image', async function() {
    const target = directory.files.pages,
          sizes = ['100%|','70%|-md','30%|-sm'],
    isJPG = function(file) {
        if (file.extname == '.jpg') return true
    },
    isLarge = function(file) {
        if (fs.statSync(file.path).size > 500000) return true
    };
    return target.forEach(function(current) {
        // would make sense at this point to replace with this: https://www.npmjs.com/package/gulp-abraia
        sizes.forEach(function(currSize){
            gulp.src(`${directory.root.parent}/${directory.root.image.src}/${current}/*.+(${directory.root.image.ext})`)
                .pipe(gulpIf(isJPG, imageResizer(
                    { width: (currSize.split("|")[0]) }
                )))
                .pipe(gulpIf(isLarge, image({
                    pngquant: true,
                    optipng: true,
                    zopflipng: true,
                    jpegRecompress: false,
                    mozjpeg: true,
                    guetzli: false,
                    gifsicle: false,
                    svgo: true,
                    concurrent: 10,
                    quiet: true
                })))
                .pipe(gulpIf(isJPG, rename(function(path) { 
                    path.basename += (currSize.split("|")[1])
                })))
                .pipe(gulp.dest(
                    `${directory.dist.parent}/${directory.dist.image}/${current}`
                )
            );
        });
    })
});

gulp.task('font', async function(){
    const target = directory.files.pages;
    return target.forEach(function(current){
        gulp.src(`${directory.root.parent}/${directory.root.font.src}/*.+(${directory.root.font.ext})`)
            .pipe(gulp.dest(`${directory.dist.parent}/${directory.dist.font}`)
        );
    })
});

gulp.task('favicon', async function() {
    const target = directory.files.pages;
    return target.forEach(function(current){
        gulp.src(`${directory.root.parent}/${directory.root.favi.src}/*.+(${directory.root.favi.ext})`)
        // https://www.npmjs.com/package/gulp-favicons
        // gulp.src(`${directory.root.parent}/${directory.root.favi}/favicon.png`)
            /*.pipe(
                favicons({
                    appName: 'Surf Air',
                    appShortName: 'SA',
                    appDescription: '#',
                    developerName: 'Benjamin Yannella',
                    developerURL: 'http://benyan.dev/',
                    background: '#ffffff',
                    path: directory.dist.favi,
                    url: 'http://surfair.com/',
                    display: 'standalone',
                    orientation: 'portrait',
                    scope: '/',
                    start_url: '/',
                    version: 1.0,
                    logging: false,
                    html: current,
                    pipeHTML: true,
                    replace: true,
                })
            )*/
            .pipe(gulp.dest(`${directory.dist.parent}/${directory.dist.favi}`)
        );
    })
});

gulp.task('watch', function() {
    gulp.watch(`${directory.root.parent}/${directory.root.style}/*.+(scss|css)`, gulp.series(['sass']));
    gulp.watch(`${directory.root.parent}/${directory.root.script}/*.js`, gulp.series(['script']));
});
gulp.task('test', gulp.series(
    ['nunjucks','sass','script']
));
gulp.task('prod', gulp.series(
    ['image','video','font','favicon','nunjucks','sass','script']
));

exports.default = function() {
    //
};