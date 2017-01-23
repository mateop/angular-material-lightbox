
var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var ngHtml2Js = require("gulp-ng-html2js"); // don't know why it's not captured by gulp-load-plugins!

var pkg = require("./bower.json");
var streamqueue = require('streamqueue');

var srcPath = "src";
var distPath = "dist";
var outputName = "ame-lightbox";

var banner = '/*\n' +
    ' * <%= pkg.name %> <%= pkg.version %>\n' +
    ' * <%= pkg.description %>\n' +
    ' * <%= pkg.repository %>\n' +
    '*/\n\n';

gulp.task("build", ["build-js", "build-css"]);
gulp.task("watch", watch);
gulp.task("build-js", buildJs);
gulp.task("build-css", buildCss);


function watch(){
    gulp.watch([srcPath + "/**/*.js", srcPath + "/**/*.html"], buildJs);
    gulp.watch(srcPath + "/**/*.scss", buildCss);
}

function buildJs(){
    return streamqueue(
        {
            objectMode: true
        },
        gulp.src(srcPath + "/**/*.js")
            .pipe($.angularFilesort())
            .pipe($.ngAnnotate()),
        getHtmlAndSvgJsStream()
    )
        .pipe($.plumber())
        .pipe($.concat(outputName + ".js"))
        .pipe($.stripBanner())
        .pipe($.banner(banner,{
            pkg: pkg
        }))
        .pipe(gulp.dest(distPath))
        .pipe($.uglify())
        .pipe($.rename({suffix: ".min"}))
        .pipe(gulp.dest(distPath));
}
function buildCss(){
    gulp.src(srcPath + "/**/*.scss")
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.concatCss(outputName + ".css"))
        .pipe(gulp.dest(distPath))
        .pipe($.minifyCss())
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(distPath));
}
function getHtmlAndSvgJsStream(){
    return gulp.src([srcPath + "/**/*.html", srcPath + "/**/*.svg"])
        .pipe(ngHtml2Js({base: srcPath, moduleName: 'ame.lightbox'}));
}
