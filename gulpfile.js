var gulp                = require('gulp');
var argv                = require('yargs').argv;
var gutil               = require('gulp-util');
var context_builder     = require('./context');
var manager_builder     = require('./manager');
var async               = require('async');
var prompt              = require('gulp-prompt');

var env                 = 'test'
var config_file         = 'config.yml'
var context
var manager

// TODO: cache creation with cache properties
// TODO: standardize extract variables (discuss with muthu)
// TODO: standardize sequential execution of tasks
// TODO: constants to diff file eg. baasLoadData.js limit=200
// TODO: p1 literal
// TODO: p1 index.js
// TODO: org, data source


gulp.task('init', function() {
    if (argv.env)
        env             = argv.env

    if (argv.config)
        config_file     = argv.config

    print('ENV : ' + env)
    print('CONIG_FILE : ' + config_file)

    context             = context_builder.getContext(config_file, env)
    manager             = manager_builder.getManager()

    // set arguments passed to context
    var args_passed     = argv
    delete args_passed['_']
    delete args_passed['$0']

    for (var i=0; i<Object.keys(args_passed).length; i++) {
        context.setVariable(Object.keys(args_passed)[i], args_passed[Object.keys(args_passed)[i]])
    }
});

gulp.task('clean', ['init'], function(cb){
    params = {}
    manager.doTask('CLEAN', context, argv.resource ,argv.subresource, params, function () {
        cb()
    })
});

gulp.task('build',['init','clean'], function(cb){
    params = {};

    manager.doTask('BUILD', context, argv.resource ,argv.subresource, params, function () {
        cb()
    })
});


gulp.task('deploy', ['init','build'], function(cb){
    params = {}
    manager.doTask('DEPLOY', context, argv.resource ,argv.subresource, params, function () {
        cb()
    })
});



function print(msg) {
    gutil.log(gutil.colors.green(msg));
}


