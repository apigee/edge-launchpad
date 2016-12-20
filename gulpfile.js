var gulp                = require('gulp');
var argv                = require('yargs').argv;
var gutil               = require('gulp-util');
var context_builder     = require('./context');
var manager_builder     = require('./manager');
var async               = require('async');

var prompt              = require('gulp-prompt')
    /*
var gutil = require('gulp-util')
var build = require('gulp-build')
var async = require('async')
var replace = require('gulp-batch-replace');
var rename = require("gulp-rename");

var manager = require('./lib/manager');
var contextHelper = require('./lib/helper');


/*
Params
--env test
--config config.yml
--resource apis
--subresource consent
*/

var env                 = 'test'
var config_file         = 'config.yml'
var context             = {}

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

    //manager.prompt(context, 'openbank_apis')

});

gulp.task('clean', ['init'], function(){
    params = {}
    manager.doTask('CLEAN', context, argv.resource ,argv.subresource, params, function () {
        
    })
});

gulp.task('build',['init'], function(){
    params = {}
    manager.doTask('BUILD', context, argv.resource ,argv.subresource, params, function () {
        
    })
});

gulp.task('deploy', ['init','build'], function(){
    params = {}
    manager.doTask('DEPLOY', context, argv.resource ,argv.subresource, params, function () {
        
    })
});



function print(msg) {
    gutil.log(gutil.colors.green(msg));
}

function baseopts () {
    var opts = {
        organization: gutil.env.org,
        token: gutil.env.token,
        environments: gutil.env.env,
        environment: gutil.env.env,
        debug: gutil.env.debug ,
        usergrid_org: gutil.env.ug_org,
        usergrid_app: gutil.env.ug_app,
        usergrid_client_id: gutil.env.ug_client_id,
        usergrid_secret: gutil.env.ug_secret
    }
    return opts
}