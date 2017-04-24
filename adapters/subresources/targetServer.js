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

var lib				= require('../../lib')
var async           = require('async')
var lodash          = require('lodash')
var request         = require('request')
var mustache        = require('mustache')

mustache.escape = function (value) {
    return value;
};

var adapter = function () {
    this.clean 			= clean
    this.build 			= build
    this.deploy 		= deploy
}

function build(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','building targetServer resources')
    cb()
}

function deploy(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','deploying targetServer resources')

    var config          = context.getConfig(resourceName, subResourceName)

    var items           = lib.filter_items(config.items, params)

    var deploy_info     = context.getDeploymentInfo()

    for (var i=0; i< items.length; i++) {
        lodash.merge(items[i], deploy_info)
        items[i].context = context
    }

    async.each(items, create_targetServer, function(err){
        if(err){
            lib.print('ERROR', err)
            cb()
        } else {
            cb()
        }

    })
}

function create_targetServer(item, callback) {
    var opts 			= item
    var context			= item.context
    delete item.context

    var options = {
        uri: context.getVariable('edge_host') + '/v1/organizations/' + opts.organization + '/environments/' + opts.environments  + '/targetservers',
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        auth: {
        }
    }

    options.body = mustache.render(item.payload, context.getAllVariables())

    if(opts.token){
        options.auth.bearer = opts.token
    } else {
        options.auth.username = opts.username
        options.auth.password = opts.password
    }

    request.post(options, function (error, response, body) {
        if (!error && (response.statusCode == 200 || response.statusCode == 201)) {
            //cache create success
            lib.print('info', 'created targetServer ' + item.name)

            if(item.assignResponse && item.assignResponse.length > 0){
                lib.extract_response(context, item.assignResponse, result)
            }

            callback()
        } else {
            lib.print('error', error)
            lib.print('error', body)
            callback()
        }
    })

}

function clean(context, resourceName, subResourceName, params, cb) {
    //opts = lib.build_opts(context, resourceName, subResourceName)
    lib.print('meta','cleaning targetServer resources')

    var config          = context.getConfig(resourceName, subResourceName)

    var items           = lib.filter_items(config.items, params)

    var deploy_info     = context.getDeploymentInfo()

    for (var i=0; i< items.length; i++) {
        lodash.merge(items[i], deploy_info)
        items[i].context = context
    }

    async.each(items, delete_targetServer, function(err){
        if(err){
            lib.print('ERROR', err)
            cb()
        } else {
            cb()
        }

    })
}

function delete_targetServer(item, callback) {
    var opts 			= item
    var context			= item.context
    delete item.context

    var payload = mustache.render(item.payload, context.getAllVariables())
    var name = JSON.parse(payload).name

    var options = {
        uri: context.getVariable('edge_host') + '/v1/organizations/' + opts.organization + '/environments/' + opts.environments  + '/targetservers/' + name ,
        method: 'DELETE',
        auth: {
        },
        headers: {
            'Content-type': 'application/json'
        },
        auth: {
        }
    }

    if(opts.token){
        options.auth.bearer = opts.token
    } else {
        options.auth.username = opts.username
        options.auth.password = opts.password
    }

    request(options, function (error, response, body) {
        if (!error && (response.statusCode == 200)) {
            //cache create success
            lib.print('info', 'deleted targetServer ' + item.name)

            if(item.assignResponse && item.assignResponse.length > 0){
                lib.extract_response(context, item.assignResponse, body)
            }

            callback()
        } else {
            lib.print('error', body)
            callback()
        }
    })


}

exports.adapter 			= adapter
