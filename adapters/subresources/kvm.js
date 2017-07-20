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
var mustache        = require('mustache');
var request 		= require('request');

mustache.escape = function (value) {
    return value;
};

var sdk 			= apigeetool.getPromiseSDK();

var adapter = function () {
    this.clean 			= clean;
    this.build 			= build;
    this.deploy 		= deploy;
}

function build(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','building kvm resources');
    cb();
}

function deploy(context, resourceName, subResourceName, params, cb) {
    //opts = lib.build_opts(context, resourceName, subResourceName)
    lib.print('meta','deploying kvm resources');

    var config          = context.getConfig(resourceName, subResourceName);

    var items           = lib.filter_items(config.items, params);

    var deploy_info     = context.getDeploymentInfo();

    for (var i=0; i< items.length; i++) {
        lodash.merge(items[i], deploy_info);
        items[i].context = context;
    }

    async.each(items, create_kvm, function(err){
        if(err){
            lib.print('ERROR', err);
            cb();
        } else {
            cb();
        }
    });
}

function create_kvm(item, callback) {
    var opts 			= item;
    var context         = item.context;
    delete item.context;

    // TODO conflict for environments attribute
    var payload = mustache.render(item.payload, context.getAllVariables());

    if(lib.is_json_string(item.payload)){
        var options = {
            uri: context.getVariable('edge_host') + '/v1/organizations/' + opts.organization + '/environments/' + opts.environments + '/keyvaluemaps',
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            auth: {},
            body: payload
        };

        if(opts.token){
            options.auth.bearer = opts.token;
        } else {
            options.auth.username = opts.username;
            options.auth.password = opts.password;
        }

        request(options, function (error, response, body) {
            if (!error) {
                lib.print('info', 'created kvm ' + item.name);
                callback();
            } else {
                lib.print('error', 'error creating kvm ' + item.name);
                lib.print('error', error);
                callback();
            }
        });
    } else {
        lib.print('error', 'invalid JSON in payload');
        callback();
    }
}

function clean(context, resourceName, subResourceName, params, cb) {
    //opts = lib.build_opts(context, resourceName, subResourceName)
    lib.print('meta','cleaning kvm resources');

    var config          = context.getConfig(resourceName, subResourceName);

    var items           = lib.filter_items(config.items, params);

    var deploy_info     = context.getDeploymentInfo();

    for (var i=0; i< items.length; i++) {
        lodash.merge(items[i], deploy_info);
        items[i].context = context;
    }

    async.each(items, delete_kvm, function(err){
        if(err){
            lib.print('ERROR', err);
            cb();
        } else {
            cb();
        }

    })
}

function delete_kvm(item, callback) {
    var opts 			= item;
    var context			= item.context;
    delete item.context;

    opts.mapName  	= item.name;

    // TODO conflict for environments attribute
    var payload = mustache.render(item.payload, context.getAllVariables());

    if(lib.is_json_string(item.payload)){
        lodash.merge(opts, lib.normalize_data(JSON.parse(payload)));

        opts.mapName  	    = opts.name;
        opts.environment    = opts.environments[0];

        sdk.deleteKVM(opts)
            .then(function(result){
                //cache create success
                lib.print('info', 'deleted kvm ' + opts.mapName);
                callback();
            },function(err){
                //cache create failed
                lib.print('error', 'error deleting kvm ' + opts.mapName);
                lib.print('error', err);
                callback();
            });
    } else {
        lib.print('error', 'invalid JSON in payload');
        callback();
    }
}

exports.adapter 			= adapter;
