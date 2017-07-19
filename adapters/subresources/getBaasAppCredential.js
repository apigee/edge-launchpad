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

var lib				= require('../../lib');
var async           = require('async');
var lodash          = require('lodash');
var request         = require('request');
var mustache        = require('mustache');

mustache.escape = function (value) {
    return value;
};

var adapter = function () {
    this.clean 			= clean;
    this.build 			= build;
    this.deploy 		= deploy;
}

function build(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','building getBaasAppCredential resources');
    cb();
}

function deploy(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','deploying getBaasAppCredential resources');

    var config          = context.getConfig(resourceName, subResourceName);

    var items           = lib.filter_items(config.items, params);

    var deploy_info     = context.getDeploymentInfo();

    for (var i=0; i< items.length; i++) {
        lodash.merge(items[i], deploy_info);
        items[i].context = context;
    }

    async.each(items, create_getBaasAppCredential, function(err){
        if(err){
            lib.print('ERROR', err);
            cb();
        } else {
            cb();
        }

    });
}

function create_getBaasAppCredential(item, callback) {
    var context			= item.context;
    delete item.context;

    var client_id       = context.getVariable('usergrid_client_id');
    var client_secret   = context.getVariable('usergrid_secret');

    var options = {
        uri: context.getVariable('baas_host') + '/management/token',
        method: 'POST',
        json: {
            grant_type: 'client_credentials',
            client_id: client_id,
            client_secret: client_secret
        }
    };

    request(options ,function (error, response, body) {
        var token               = body.access_token;

        var baas_org            = context.getVariable('usergrid_org');
        var baas_app            = mustache.render(item.appName, context.getAllVariables());

        var options = {
            uri: context.getVariable('baas_host') + '/management/orgs/' + baas_org + '/apps/' + baas_app + '/credentials?access_token='+ token ,
            method: 'GET'
        };

        request(options ,function (error, response, body) {
            if (!error && (response.statusCode == 200)) {
                //cache create success
                lib.print('info', 'Credentials obtained for Baas App ' + baas_app);

                if(item.assignResponse && item.assignResponse.length > 0){
                    lib.extract_response(context, item.assignResponse, body);
                }

                callback();
            } else {
                lib.print('error', JSON.stringify(body));
                callback();
            }
        });
    });
}

function clean(context, resourceName, subResourceName, params, cb) {
    //opts = lib.build_opts(context, resourceName, subResourceName)
    lib.print('meta','cleaning getBaasAppCredential resources');
    cb();
}

exports.adapter 			= adapter;
