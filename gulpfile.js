var gulp = require('gulp');
var change = require('gulp-change');
var rename = require('gulp-regex-rename');
var argv = require('minimist')(process.argv.slice(2));

// FIXME
// The following tasks are almost the same, needs to be
// merged and make use of params

function renameComponent(content) {
    return content.replace(/\/\*COMPONENT_NAME\*\//g, argv.name);
}

function renameModel(content) {
    return content.replace(/\/\*MODEL_NAME\*\//g, argv.name);
}

gulp.task('component', function() {
    return gulp.src('template/component/*')
        .pipe(rename(/COMPONENT_NAME/, argv.name))
        .pipe(change(renameComponent))
        .pipe(gulp.dest('component/'+ argv.name, {overwrite: false}));
});

gulp.task('model', function() {
    return gulp.src('template/model/*.js')
        .pipe(rename(/MODEL_NAME/, argv.name))
        .pipe(change(renameModel))
        .pipe(gulp.dest('model/', {overwrite: false}));
});

// TODO
// components generator needs option to generate
// components without a controller, just a view component