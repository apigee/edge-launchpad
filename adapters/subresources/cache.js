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

var apigeetool 		= require('apigeetool');
var lib				= require('../../lib');
var async           = require('async');
var lodash          = require('lodash');
var request         = require('request');
var sdk 			= apigeetool.getPromiseSDK();
var mustache        = require('mustache');

mustache.escape = function (value) {
    return value;
};

var adapter = function () {
    this.clean 			= clean;
    this.build 			= build;
    this.deploy 		= deploy;
};

function build(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','building cache resources');
    cb();
}

function deploy(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','deploying cache resources');
    var config          = context.getConfig(resourceName, subResourceName);

    var items           = lib.filter_items(config.items, params);

    var deploy_info     = context.getDeploymentInfo();

    for (var i=0; i< items.length; i++) {
        lodash.merge(items[i], deploy_info);
        items[i].context = context;
    }

    async.each(items, create_cache, function(err){
        if(err){
            lib.print('ERROR', err);
            cb();
        } else {
            cb();
        }
    });
}

function create_cache(item, callback) {
    var opts             = item;
    var context          = item.context;
    delete item.context;

    opts.cache           = item.name;

    var payload = mustache.render(item.payload, context.getAllVariables());
    lodash.merge(opts, lib.normalize_data(JSON.parse(payload)));

    var environments    = item.environments;

    for (var i=0; i<environments.length; i++){
        opts.environment = environments[i];
        sdk.createcache(opts)
            .then(function(result){
                //cache create success
                lib.print('info', 'created cache ' + item.name + ' for env ' + item.environment);

                if(item.assignResponse && item.assignResponse.length > 0){
                    lib.extract_response(context, item.assignResponse, result);
                }

                callback();
            },function(err){
                //cache create failed
                lib.print('error', 'error creating cache ' + item.name + ' for env ' + item.environment);
                lib.print('ERROR', err);
                callback();
            }) ;
    }

}

function clean(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','cleaning cache resources');

    var config          = context.getConfig(resourceName, subResourceName);

    var items           = lib.filter_items(config.items, params);

    var deploy_info     = context.getDeploymentInfo();

    for (var i=0; i< items.length; i++) {
        lodash.merge(items[i], deploy_info);
        items[i].context = context;
    }

    async.each(items, delete_cache, function(err){
        if(err){
            lib.print('ERROR', err);
            cb();
        } else {
            cb();
        }

    });
}

function delete_cache(item, callback) {
    var opts             = item;
    var context          = item.context;
    opts.cache           = item.name;

    var payload = mustache.render(item.payload, context.getAllVariables());
    lodash.merge(opts, lib.normalize_data(JSON.parse(payload)));

    delete item.context;

    var options = {
        uri: context.getVariable('edge_host') + '/v1/organizations/' + opts.organization + '/environments/' + opts.environments + '/caches/' + opts.cache +  '/entries?action=clear',
        method: 'POST',
        headers: {
        },
        auth: {}
    };

    if(opts.token){
        options.auth.bearer = opts.token;
    } else {
        options.auth.username = opts.username;
        options.auth.password = opts.password;
    }

    request(options, function (error, response, body) {
        if (!error) {
            lib.print('info', 'cleared cache ' + item.name);
            callback();
        } else {
            //cache create failed
            lib.print('error', 'error clearing cache ' + item.name);
            lib.print('ERROR', error);
            callback();
        }
    });

}

exports.adapter 			= adapter;
