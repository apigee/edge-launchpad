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

var fs                              = require('fs');
var baseAdapter                     = require('./baseAdapter');
var lodash 			                = require('lodash');
var lib                             = require('./lib');
var path                            = require('path');
var async                           = require('async');

var instance;

function getManager() {

    if (!instance) {
        instance                    = new manager();
    }
    return instance;
}


function manager() {

    this.isDebug                    = true;
    this.adapters                   = JSON.parse(fs.readFileSync(path.join(__dirname, 'config/adapters.json'), 'utf8'));

    this.doTask = function(taskName, context, resourceName, subResourceName, params, cb ) {


        if(!resourceName) { // if no resource name supplied then iterate over all available resources in config file
            var config                  = context.getConfig(resourceName, subResourceName);

            if(!config){
                lib.print('error', 'ERROR retrieving config, check parameters');
                return;
            }

            for(var i=0; i<config.length; i++){
                var resourceType        = config[i].type;
                var adapter             = this.getAdapter(resourceType);

                var resourceName        = config[i].name;

                context.loadOrgDetail(resourceName);
                context.loadCmdLineVariables();

                adapter.doTask('PROMPT', context, resourceName, subResourceName, params, function (err, result) {
                    context.loadConfiguration(resourceName);

                    adapter.doTask(taskName, context, resourceName, subResourceName, params, function (err, result) {
                        cb(err, result);
                    });
                });
            }
            //
        } else if (resourceName && !subResourceName) { // if resource name is specified and subresource is not specified call adapter of that specific
            var config                  = context.getConfig(resourceName, subResourceName);

            if(!config){
                lib.print('error', 'ERROR retrieving config, check parameters')
                return
            }

            context.loadOrgDetail(resourceName);
            context.loadCmdLineVariables();

            var resourceType            = config.type;
            var adapter                 = this.getAdapter(resourceType);

            adapter.doTask('PROMPT', context, resourceName, subResourceName, params, function (err, result) {
                context.loadConfiguration(resourceName);

                adapter.doTask(taskName, context, resourceName, subResourceName, params, function (err, result) {
                    cb(err, result);
                });
            });
        } else if(!resourceName  && subResourceName){ // This combination is not valid
            lib.print('error', 'ERROR resource name not provided');
        } else { // both resource name and subresource name is specified
            context.loadOrgDetail(resourceName);
            context.loadCmdLineVariables();

            var subResourceItems = subResourceName.split(',');
            var self                    = this;

            async.eachSeries(subResourceItems, function (item, callback) {
                var config                  = context.getConfig(resourceName, item);

                if(!config){
                    lib.print('error', 'ERROR retrieving config, check parameters');
                    return
                }

                var subResourceType         = config.type;
                // Get resource type
                var config                  = context.getConfig(resourceName, null);
                var resourceType            = config.type;

                var adapter                 = self.getAdapter(resourceType, subResourceType);

                adapter.doTask('PROMPT', context, resourceName, item, params, function (err, result) {
                    context.loadConfiguration(resourceName);

                    adapter.doTask(taskName, context, resourceName, item, params, function (err, result) {
                        callback(err, result);
                    });
                });
            }, function(err, result){
                cb(err, result);
            });
        }
    };

    this.getAdapter = function (resourceType, subResourceType) {
        var name = (resourceType) ? ((subResourceType) ? resourceType + '.' + subResourceType : resourceType) : '.';

        var adapter = this.adapters[name];

        if (!adapter) {
            lib.print("error", "Adapter not found for : " + name);
        } else {
            return adapter;
        }
    };

    this.loadAdapters = function (configFile) {
        var adapterConfigs                  = JSON.parse(fs.readFileSync(configFile, 'utf8'));

        if (adapterConfigs) {
            for (var x in adapterConfigs) {
                var adapter                 = require(adapterConfigs[x]).adapter;
                adapter.prototype           = baseAdapter.baseAdapter;
                this.adapters[x]            = new adapter;
            }
        }

        this.adapters['.']                  = baseAdapter;
    };

    this.loadAdapters(path.join(__dirname, 'config/adapters.json'));
}

/*
this.getLog = function() {
    var log = function() {
        this.logs = {};
        this.logErrorStatus = function(taskName,config,error) {//final status
            //get resourceName & subResourceName
            //if not found : logs[config.configName] = {taskName, 'FailedWithError',""+error,error);
            //push in logs[config.configName].push({taskName, 'FailedWithError',""+error,error));
            //console.log the same
        }

        this.logError = function(taskName,config,error) {
            //add error into the logs
            //if isDebug is enabled, log in console as well
        }

        this.logWarning = function(taskName,config,message) {
            //add warning message into the logs
            //if isDebug is enabled log in console as well
        }

        this.logInfo = function(taskName,config,message) {
            //add info
        }

        this.logSuccessStatus = function(taskName, config, message) {//final success status

        }
    }
}
*/

//provide registerAdapter methods
//while registering if there is already an adapter for the type, make it the parent for to be registered adapter
//registerResourceAdapter(resourceType, adapter);
//if adapters[resourceType] exists, then adapter._prototype = adapters[resourceType] and adapters[resourceType] = adapter.
// other adapter._prototype = baseAdapter and adapters[resourceType] = adapter
//simlarly for registerSubResourceAdapter(resourceType, subResourceType, adapter);
//deregister() methods

exports.getManager = getManager;
