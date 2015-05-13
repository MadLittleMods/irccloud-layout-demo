var gulp = require('gulp');

var runSequence = require('run-sequence');
var del = require('del');
var cache = require('gulp-cached');

var sass = require('gulp-sass');
var gulpAutoprefixer = require('gulp-autoprefixer');

var corepostcss = require('postcss');
var postcss = require('gulp-postcss');
var inlineComments = require('postcss-inline-comment');
var atImport = require("postcss-import");
var simpleVars = require('postcss-simple-vars');
var mixins = require('postcss-mixins');
var nestedcss = require('postcss-nested');
var cssvariables = require('postcss-css-variables');
var autoprefixer = require('autoprefixer');
var discardComments = require('postcss-discard-comments');
var colorFunction = require('postcss-color-function');

var config = {
	paths: {
		'html': ['./src/index.html'],
		'sass': ['./src/scss-legacy/**/*'],
		'topLevelSass': ['./src/scss-legacy/all.scss'],
		'postcss': ['./src/postcss/**/*'],
		'topLevelPostCss': ['./src/postcss/all.css']
	}
};



// Clears the distribution folder before running the other tasks
gulp.task('build-clean', function(done) {
	del(['./dist'], done);
});

// Rerun tasks when a file changes
gulp.task('watch', function() {
	gulp.watch(config.paths.sass, ['sass']);
	gulp.watch(config.paths.postcss, ['postcss']);
	gulp.watch(config.paths.html, ['move-html']);
});

// Move the html into dist
gulp.task('move-html', function() {
	return gulp.src(config.paths.html)
		.pipe(gulp.dest('./dist/'));
});

// Compile our Sass
gulp.task('sass', function() {
	return gulp.src(config.paths.topLevelSass)
		// Process only changed files
		// We can't do this because other files besides the top level one change and need to be update the main one
		//.pipe(cache('compiling sass')) 
		.pipe(sass({
			errLogToConsole: true
			//outputStyle: 'compressed'
		}))
		.pipe(gulpAutoprefixer({
			browsers: ['last 10 versions'],
			cascade: false
		}))
		// Save out our compiled sass for the site
		.pipe(gulp.dest('./dist/css'));
});


// Compile our PostCSS
gulp.task('postcss', function () {
	var processors = [
		atImport(),
		discardComments(),
		inlineComments(),
		mixins(),
		simpleVars(),
		nestedcss,
		cssvariables(),
		colorFunction(),
		autoprefixer({browsers: ['last 10 versions']})
	];
	return gulp.src(config.paths.topLevelPostCss)
		// Process only changed files
		// We can't do this because other files besides the top level one change and need to be update the main one
		//.pipe(cache('processing postcss')) 
		.pipe(postcss(processors))
		.on('error', function (e) {
			console.log(e);
		})
		.pipe(gulp.dest('./dist/css'));
});



// Default Task
gulp.task('default', function(callback) {
	runSequence(
		['build-clean'],
		['move-html', /* * /'sass',/* */ 'postcss',/* */ 'watch'],
		callback
	);
});