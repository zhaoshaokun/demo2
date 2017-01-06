var gulp = require("gulp");

//html插件
var htmlmin = require("gulp-htmlmin");

//css插件
var sass = require("gulp-sass");
var cssconcat = require("gulp-concat-css");
var cssnano = require("gulp-cssnano");

//js插件
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');//命令：npm install jshint gulp-jshint --save-dev

//开启静态服务器
var browserSync = require('browser-sync').create();
//browserSync上自带的实时刷新功能
var reload = browserSync.reload;


//1.处理HTML  压缩
gulp.task("html", function(){
	gulp.src("*.html")
		.pipe(htmlmin({
			collapseWhitespace: true, //压缩HTML中的空白字符
			collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input checked/>
			removeAttributeQuotes: true, //删除所有属性值的引号
			removeComments: true, //删除注释
			removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
			removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
			removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
		}))
		.pipe(gulp.dest("dist/"))
		.pipe(reload({stream: true}))
});

//2.处理css文件  转换、合并、压缩
gulp.task("css", function(){
	gulp.src("css/*.scss")
		.pipe(sass())
		.pipe(cssconcat("index.css"))
		.pipe(cssnano())
		.pipe(gulp.dest("dist/css"))
		.pipe(reload({stream: true}))
});

//3.处理js文件  合并，压缩，混淆
gulp.task("js", function(){
	gulp.src("js/*.js")
		.pipe(concat("index.js"))
		.pipe(uglify())
		.pipe(jshint())
		.pipe(gulp.dest("dist/js"))
		.pipe(reload({stream: true}))
});

//4.处理图片  直接复制移动或者压缩成精灵图
gulp.task("img", function(){
	gulp.src("img/*.*")
		.pipe(gulp.dest("dist/img"))
		.pipe(reload({stream: true}))
});

//5.处理fonts  直接复制移动或者压缩合并为一个文件
gulp.task("fonts", function(){
	gulp.src("fonts/*.*")
		.pipe(gulp.dest("dist/fonts"))
		.pipe(reload({stream: true}))
});

//6.处理lib  
gulp.task("lib", function(){
	gulp.src("lib/**/*.*")
		.pipe(gulp.dest("dist/lib"))
		.pipe(reload({stream: true}))
});

//7.编译任务
gulp.task("build", ["html", "css", "js", "img", "fonts", "lib"]);

//8.开启静态服务器
gulp.task("serve", ["build"], function(){
	browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });

	//监听前面所有的任务是否改变，进行实时刷新
    gulp.watch("*.html", ["html"]);
	gulp.watch("css/*.css", ["style"]);
    gulp.watch("js/*.js", ["js"]);
    gulp.watch("img/*.*", ["img"]);
    gulp.watch("fonts/*.*", ["fonts"]);
    gulp.watch("lib/**/*.*", ["lib"]);
});