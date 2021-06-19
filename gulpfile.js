const {src, watch, series, dest} = require("gulp");
const sass = require("gulp-dart-sass");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const browserSync = require("browser-sync").create();
const autoPrefixer = require("autoprefixer");
const nodemon = require("gulp-nodemon");


// task for scss
function scssTask(){
    return src("./public/app/scss/style.scss", {sourcemaps: true})
    .pipe(sass())
    .pipe(postcss([cssnano(), autoPrefixer()]))
    .pipe(dest("./public/dist", {sourcemaps: "."}));
}

// start the browser-sync
function browserSyncServe(callback){
    browserSync.init(null, {
		proxy: {
            target: "localhost:3000",
            ws: true
        },
        files: ["./public/app/**/*.*"],
        port: 7000
	});
    callback();
}

// for reloading the browsersync
function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}

// watch for every changes
function watchTask(callback){
    watch(["./views/**/*.pug"], series(browserSyncReload));
    watch(["./public/app/scss/**/*.scss", "./public/app/**/*.js"], series(scssTask, browserSyncReload));
    callback();
}

// start the nodemon
function startNodemon(callback){
    let started = false;

    nodemon({
        script: "app.js",
        watch: ["./routes/**/*.js", "app.js"]
    }).on("start", ()=>{
        if (!started) {
            started = true;
            callback();
        }
    }).on("restart", ()=>{
        setTimeout(()=>{
            series(browserSyncReload);
        },600)
    });
}

// export for gulp cli
exports.default = series(
    startNodemon,
    browserSyncServe,
    scssTask,
    watchTask
);