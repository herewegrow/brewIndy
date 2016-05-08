'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify'),
    html2js = require('gulp-ng-html2js'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    imagemin = require('gulp-imagemin'),
    strip = require('gulp-strip-debug'),
    gulpif = require('gulp-if'),
    cacheBuster = require('gulp-cachebust'),
    util = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    del = require('del'),
    replace = require('gulp-replace'),
    rs = require('run-sequence'),
    minimist = require('minimist'),
    nodemon = require('gulp-nodemon');

//specify the distribution folder for everything that gets compiled
const build = 'build/',
    temp = 'temp/';

const buster = new cacheBuster();

//parse arguments if there are any
let buildVars;
let args = minimist(process.argv.slice(2));

gulp.task('processBuildVars', function() {
    buildVars = args;
    if(buildVars.env === 'PROD') {

        //buildVars.color = 'red';

        if(!buildVars.apiUrl) {
            buildVars.apiUrl = 'https://'; //path to prod API
        }
    }
    else if(buildVars.env === 'QA') {

        buildVars.color = '#B85C28';

        if(!buildVars.apiUrl) {
            buildVars.apiUrl = 'https://'; //path to QA API
        }
    }
    else if(buildVars.env === 'DEV') {

        buildVars.color = '#A5C9F6';

        if(!buildVars.apiUrl) {
            buildVars.apiUrl = 'https://'; //path to dev API
        }
    }
    else {
        buildVars.apiUrl = 'https://devapi'; //by default use the dev api
        buildVars.env = 'DEV'; //by default make it the dev environment
        buildVars.psVersion = buildVars.psVersion || '000';
        buildVars.color = buildVars.color || '#bcbcbc';
    }
    util.log('Environment: ' + buildVars.env + '.  apiUrl: ' + buildVars.apiUrl + '.  color: ' + buildVars.color + '.  psVersion: ' + buildVars.psVersion);

    return buildVars;
});

//if PROD arg passed in do some additional steps (uglify, no source maps, etc)
// QA is being treated as production as well to be an accurate representation of exactly what PROD code will look like.
let isProduction = (args.env === 'PROD') || (args.env === 'QA');

/*
 You need to add new client side js here after npm installing new ones.
 This will bundle them all as vendor.js in the page.
 */
const vendorJs = [
    'node_modules/angular/angular.min.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'node_modules/underscore/underscore-min.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
    'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
    'node_modules/angular-toastr/dist/angular-toastr.min.js',
    'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',


    'node_modules/ngmap/build/scripts/ng-map.min.js',
    
    // angular-google-maps dependencies:
    // 'node_modules/angular-simple-logger/dist/angular-simple-logger.min.js',
    // 'node_modules/angular-google-maps/dist/angular-google-maps.min.js'
    // 'node_modules/angular-touch/angular-touch.min.js',
    // 'node_modules/angulartics/dist/angulartics.min.js',
    // 'node_modules/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
];

const internalJS = [
    'src/**/*Module.js', //in Angular modules must be loaded first
    'src/**/*.js'
];

const vendorCssFiles = [
    'node_modules/angular-toastr/dist/angular-toastr.min.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
];

const fontFiles = [
    'node_modules/bootstrap/fonts/*'
];

const webConfig = 'src/web.config';

/*
 html partials-used to load into angular's template cache for better performance and less request
 */
const templates = ['src/**/*.html', '!src/index.html'];

//concat and minify internal JS files
gulp.task('internalJs', function() {
    return gulp.src(internalJS)
        .pipe(gulpif(!isProduction, sourcemaps.init()))
        .pipe(gulpif(isProduction, strip())) //remove debugger and console stmts
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(replace("@@apiUrl", buildVars.apiUrl))
        .pipe(replace("@@psVersion", buildVars.psVersion))
        .pipe(replace("@@env", buildVars.env))  
        .pipe(replace("@@color", buildVars.color))
        .pipe(babel()) //convert ES6 to ES5 syntax
        .pipe(concat('internal.js'))
        .pipe(gulpif(!isProduction, sourcemaps.write()))
        .pipe(gulp.dest(temp));
});

//find html templates and convert them to js for angular's $templateCache
gulp.task('templateCache', function() {

    return gulp.src(templates)
        .pipe(html2js({moduleName: 'templates', removePrefix: '/'}))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(temp));
});

gulp.task('combineJs', ['internalJs', 'templateCache'], function() {

    return gulp.src([temp + 'templates.js', temp + 'internal.js'])
        .pipe(concat('app.min.js'))
        .pipe(gulpif(isProduction, uglify()))
        .pipe(buster.resources()) //version file
        .pipe(gulp.dest(build)); //writes manifest file

});


//concat and bundle vendor js files as vendor.js
gulp.task('vendorJs', function() {
    // create 1 vendor.js file from all vendor plugin code

    return gulp.src(vendorJs)
        .pipe(concat('vendor.min.js'))
        .pipe(buster.resources())
        .pipe(gulp.dest(build));

});

// convert sass to css
gulp.task('compileSass', function () {
    return gulp.src('src/css/style.scss')
        .pipe(concat('app.min.css'))
        .pipe(gulpif(!isProduction, sourcemaps.init()))
        .pipe(sass({outputStyle: 'compressed'}).on('error', util.log))
        .pipe(gulpif(!isProduction, sourcemaps.write({ includeContent: false })))
        .pipe(gulpif(!isProduction, sourcemaps.init({ loadMaps: true })))

        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))

        .pipe(buster.resources())
        .pipe(gulpif(!isProduction, sourcemaps.write('.')))

        .pipe(gulp.dest(build));

});


//concat, minify, and bundle vendor js files as vendor.js
gulp.task('vendorCss', function() {
    // create 1 vendor.css file from all vendor plugin code

    return gulp.src(vendorCssFiles)
        .pipe(concat('vendor.min.css'))
        .pipe(gulpif(!isProduction, sourcemaps.init()))
        .pipe(buster.resources())
        .pipe(gulpif(!isProduction, sourcemaps.write('.')))
        .pipe(gulp.dest(build));

});

gulp.task('clean-styles', function() {
    return Promise.all([
        del(build + 'styles/**/*.css')
    ]);
});

//optimize all the images
gulp.task('images', function() {
    return gulp.src('src/content/img/*')
        .pipe(gulpif(isProduction, imagemin({ progressive: true }))) //may need to make this only run in production, it's kind of slow
        .pipe(gulp.dest(build + 'content/img/'));

});

gulp.task('clean-images', function() {
    return del(build + 'img/*');
});


gulp.task('fonts', function () {
    return gulp.src(fontFiles)
        .pipe(gulp.dest(build + 'fonts/'));

});

gulp.task('webConfig', function() {
    return gulp.src(webConfig)
        .pipe(gulp.dest(build));
});

gulp.task('clean-fonts', function() {
    return del(build + 'fonts/*');
});

gulp.task('clean-build', function() {
    return del(build + '/*');
});

//serve the site with livereload
gulp.task('startServer', function () {
    connect.server({
        root: 'build',
        livereload: true,
        port: 8800,
        fallback: 'build/index.html'
    });

});

gulp.task('nodestart', function () {
    nodemon({
        script: 'server.js'
        //, ext: 'js html'
        , env: { 'NODE_ENV': 'DEV' }
    })
});

gulp.task('buildHtml', ['processBuildVars', 'vendorJs', 'combineJs', 'compileSass', 'vendorCss', 'images', 'fonts', 'webConfig'], function() {
    return gulp.src('src/index.html')
        .pipe(buster.references())
        .pipe(gulp.dest(build))
        .pipe(connect.reload());
});


gulp.task('serve', function () {
    return rs('clean-build', 'buildHtml', 'nodestart', 'startServer');

});

// Lets us type "gulp" on the command line and run all of our tasks
//gulp.task('default', ['serve', 'clean-code', 'internalJs', 'vendorJs', 'compileSass', 'vendorCss', 'images', 'templateCache', 'watch']);
gulp.task('default', ['serve', 'watch']);


// This handles watching and running tasks as well as telling our LiveReload server to refresh things
gulp.task('watch', function() {
    // Watch any file for a change in the 'app' folder and recompile and reload the browser as required
    // -- removed 'clean-build' from this task, how to use "rs" within a watcher?
    return gulp.watch('src/**', ['buildHtml']);


});
