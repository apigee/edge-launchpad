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

gulp.task('init', function() {
    //TODO: getArguments() { to return all passed arguments}

    //TODO: get all arguments

    //TODO any parameters passed in the argument, set it in context.setVariable(parameterName, value);

    //TODO not sure what this means : if a specific resource name or resource name & sub resource name are passed then


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
    params = {}
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


