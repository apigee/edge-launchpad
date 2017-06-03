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

var apigeetool 		= require('apigeetool')
var lib				= require('../../lib')
var async           = require('async')
var lodash         = require('lodash')
var mustache        = require('mustache')
var path 			= require('path')

mustache.escape = function (value) {
    return value;
};

var sdk 			= apigeetool.getPromiseSDK()

var adapter = function () {
    this.clean 			= clean
    this.build 			= build
    this.deploy 		= deploy
}

function build(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','building shared flow resources')
    cb()
}

function deploy(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','deploying shared flow resources')

    var config          = context.getConfig(resourceName, subResourceName)

    var items           = lib.filter_items(config.items, params)

    var deploy_info     = context.getDeploymentInfo()

    context.resourceName 	= resourceName

    for (var i=0; i< items.length; i++) {
        lodash.merge(items[i], deploy_info)
        items[i].context = context
    }

    async.eachSeries(items, create_shared_flow, function(err){
        if(err){
            lib.print('ERROR', err)
            cb()
        } else {
            cb()
        }

    })
}

function create_shared_flow(item, callback) {
    var opts 			= item
    var context			= item.context
    delete item.context

    opts.directory = path.join(context.getBasePath(context.resourceName), '/src/shared_flow/', item.name)
    opts.environments = opts.environments.join(',')

    sdk.deploySharedflow(opts)
        .then(function(result){
            //cache create success
            lib.print('info', 'created shared flow ' + item.name)
            if(item.assignResponse && item.assignResponse.length > 0){
                lib.extract_response(context, item.assignResponse, result)
            }
            callback()
        },function(err){
            //cache create failed
            lib.print('error', 'error creating shared flow ' + item.name)
            lib.print('ERROR', err)
            callback()
        }) ;
}

function clean(context, resourceName, subResourceName, params, cb) {
    //opts = lib.build_opts(context, resourceName, subResourceName)
    lib.print('meta','cleaning shared flow resources')

    var config          = context.getConfig(resourceName, subResourceName)

    var items           = lib.filter_items(config.items, params)

    var deploy_info     = context.getDeploymentInfo()

    for (var i=0; i< items.length; i++) {
        lodash.merge(items[i], deploy_info)
        items[i].context = context
    }

    async.each(items, delete_shared_flow, function(err){
        if(err){
            lib.print('ERROR', err)
            cb()
        } else {
            cb()
        }

    })
}

function delete_shared_flow(item, callback) {
    var opts 			= item
    var context			= item.context
    delete item.context

    sdk.deleteSharedflow(opts)
        .then(function(result){
            //cache create success
            lib.print('info', 'deleted shared flow  ' + item.name)
            callback()
        },function(err){
            //cache create failed
            lib.print('error', 'error deleting shared flow ' + item.name)
            lib.print('ERROR', err)
            callback()
        }) ;
}

exports.adapter 			= adapter
