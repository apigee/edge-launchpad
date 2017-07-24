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

/*
This is the base adapter object. Prototype property of the adapters is set to this object during runtime.
 */

var prompt_lib		                = require('prompt');
var manager_builder                 = require('./manager');
var async                           = require('async');
var lib 			                = require('./lib');

function baseAdapter () {

    this.doTask = function(taskName,context,resourceName,subResourceName, params, cb) {

        switch (taskName.toUpperCase()) {
            case 'CLEAN' :
                try {
                    this.clean(context, resourceName, subResourceName, params, function (err, result) {
                        cb(err, result)
                    });
                } catch(e){
                    lib.print('error', e);
                }

                break;

            case 'BUILD' :
                try {
                    this.build(context, resourceName, subResourceName, params, function (err, result) {
                        cb(err, result)
                    });
                } catch(e){
                    lib.print('error', e);
                }

                break;
            case 'DEPLOY' :
                try {
                    this.deploy(context, resourceName, subResourceName, params, function (err, result) {
                        cb(err, result);
                    });
                } catch(e){
                    lib.print('error', e);
                }

                break;
            case 'PROMPT' :
                try {
                    this.prompt(context, resourceName, subResourceName, params, function (err, result) {
                        cb(err, result);
                    });
                } catch(e){
                    lib.print('error', e);
                }

                break;
        }
    };


    // Do the same activity for all subresources/resources
    this.gotoSubResources = function(taskName, context, resourceName, subResourceName, params, cb) {
        var manager                         = manager_builder.getManager();

        var config                          = context.getConfig(resourceName);

        var resourceType                    = config.type;

        var subResources                    = config.properties.subResources;

        if (subResources && subResources.length > 0) {
            if(taskName.toUpperCase() == 'CLEAN') {
                subResources.reverse();
            }

            // TODO use promise
            async.eachSeries(
                subResources,

                function (subResource, callback) {
                    var subResourceType = subResource.type;
                    var subResourceName = subResource.name;

                    var adapter = manager.getAdapter(resourceType, subResourceType);

                    adapter.doTask(taskName, context, resourceName, subResourceName, params, function (err, result) {
                        if (!err) {
                            callback();
                        } else {
                            callback(err);
                        }
                    });
                },

                function (err) {
                    //
                    if (taskName.toUpperCase() == 'CLEAN') {
                        // reversing the list after clean so that build and deploy is executed in same order as defined in the config file
                        subResources.reverse();
                    }

                    if (!err) {
                        cb();
                    } else {
                        lib.print('ERROR', err);
                        cb(err);
                    }

                }
            );
        }
    };


    this.clean = function(context, resourceName, subResourceName, params, cb) {
        console.log('Base clean');
        this.gotoSubResources();
    };

    this.build = function(context, resourceName, subResourceName, params, cb) {
        console.log('Base build');
        this.gotoSubResources();
    };

    this.deploy = function(context, resourceName, subResourceName, params, cb) {
        console.log('Base deploy');
        this.gotoSubResources();
    };

    // Not used as of now; adapter property to inform manager that this adapter can be run asyc
    this.isAsynchable = function() {
        return false;
    };

    this.prompt = function(context, resourceName, subResourceName, params, cb) {
        var config = context.getConfig(resourceName);

        if (config.properties.inputs && config.properties.inputs.length > 0) {
            var inputs = config.properties.inputs;

            var required_values = [];

            for(var i=0; i<inputs.length; i++){

                // check if the variable already present in the context (so that input is not prompted at every task ie. clean, build, deploy and also to make sure that prompt values which are left null in previous task is prompted in next task)
                if(!context.getVariable(inputs[i].name) && !context.getVariable(inputs[i].ifNotPresent)) {
                    if(inputs[i].name == 'password') {
                        required_values.push({name: inputs[i].name, description: inputs[i].prompt, type: 'string', hidden: true});
                    } else if (inputs[i].hidden == true){
                        required_values.push({name: inputs[i].name, description: inputs[i].prompt, type: 'string', hidden: true});
                    } else {
                        required_values.push({name: inputs[i].name, description: inputs[i].prompt, type: 'string'});
                    }
                }
            }

            prompt_lib.start();

            prompt_lib.get(required_values, function(err, results) {
                var keys = Object.keys(results);

                for(var i=0; i<keys.length; i++){
                    context.setVariable(keys[i], results[keys[i]]);
                }

                cb(err, results);
            });
        }
    };
}

exports.baseAdapter 			= new baseAdapter();