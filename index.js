/*
 Copyright 2017 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

var gulp                = require('gulp');
var argv                = require('yargs').argv;
var gutil               = require('gulp-util');
var context_builder     = require('./context');
var manager_builder     = require('./manager');
var async               = require('async');
var prompt              = require('gulp-prompt');

/*
gulp <deploy/build/clean>
    --resource resource1
    --subresource subresource1,subresource2
    --item item1,item2
    --strict (limit the action to one task ie: either deploy/build/clean and no chaining happens)
    --env test (defaults to test)
    --config config.yml (defaults to config.yml)

eg1 : gulp deploy
eg2 : gulp deploy --username gauthamvk@google.com --org bumblebee --env test --resource openbank_apis

*/

/*
FEEDBACK
 JSON validation not done on product
 no proper error response send for the same.

 zip node modules
 change from error to warnings while trying to delete non existing product/app/cache resources
 delete node modules before running npm install
*/

// TODO: decide how to pass env | different for apigeetool and proxy(direct api) | when you run deploy prod after runnning deploy test, app, product will get recreated meaning test env broke
// TODO: update readme to mention standard parameters ike username, password, baas_host etc
// TODO: explain when file replacements happen
// TODO: give a option not to delete any resource
// TODO: update README with reserved key words for variable - org, env, username, password, token
// TODO: update README edge_host is conpulsary in confiuration section
// TODO: p2 use logger
// TODO: p2 standardize sequential execution of tasks
// TODO: p2 data source many
// TODO: p2 generate load for generating initial report
// TODO: p2 license check
// TODO: p2 cache creation with cache properties
// TODO: p2 deploy individual dependency from its gulp
// TODO: p3 constants to diff file eg. baasLoadData.js limit=200
// TODO: p3 manage multiple env deployment, eg: in cache deploy, assign variable will be overridden

/* who are using launchpad ?
 openbank(<=1.7)
 healthapix(flame)(1.7)
 imedusa(v2.0.0)
 rupam(functions)(v2.0.0)
*/

module.exports = function(gulp){
    var env                 = 'test';
    var config_file         = 'config.yml';
    var params              = {};
    var context;
    var manager;
    var strict;
    var item;

    if (argv.env)
        env             = argv.env;

    if (argv.config)
        config_file     = argv.config;

    if(argv.strict)
        strict          = argv.strict;

    if(argv.item) {
        item = argv.item;
        params.items = item.split(',');
    }

    context             = context_builder.getContext(config_file, env);
    manager             = manager_builder.getManager();

    gulp.task('init', function() {

        gutil.log(gutil.colors.green('ENV : ' + env));
        gutil.log(gutil.colors.green('CONIG_FILE : ' + config_file));

        // set arguments passed to context
        var args_passed = argv;
        delete args_passed['_'];
        delete args_passed['$0'];
        delete args_passed['strict'];
        delete args_passed['config'];
        delete args_passed['item'];

        context.setCmdLineVariables(args_passed);

    });

    gulp.task('clean', ['init'], function (cb) {
        manager.doTask('CLEAN', context, argv.resource, argv.subresource, params, function () {
            cb();
        })
    });

    if(strict){
        gulp.task('build', ['init'], function(cb){
            manager.doTask('BUILD', context, argv.resource ,argv.subresource, params, function () {
                cb();
            })
        });
    } else {
        gulp.task('build',['init','clean'], function(cb){
            manager.doTask('BUILD', context, argv.resource ,argv.subresource, params, function () {
                cb();
            });
        });
    }


    if(strict){
        gulp.task('deploy', ['init'], function(cb){
            manager.doTask('DEPLOY', context, argv.resource ,argv.subresource, params, function () {
                cb();
            })
        });
    } else {
        gulp.task('deploy', ['init','build'], function(cb){
            manager.doTask('DEPLOY', context, argv.resource ,argv.subresource, params, function () {
                cb();
            })
        });
    }

};
