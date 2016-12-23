/**
 * Created by Muthu on 28/11/16.
 */

var lib                             = require('./lib');
var Promise = require('bluebird');

function baseAdapter () {
    this.adapterContext = {};


    this.doTask = function(taskName,context,resourceName,subResourceName, params) {
        var currentAdapterObj = this;
        return new Promise(function(resolve, reject) {
            console.log('in baseApapter doTask: ' + taskName);


            if (!context.isResourceInitialized(resourceName)) {
                console.log("not initialized : " + resourceName);

                currentAdapterObj.prompt(context, resourceName, subResourceName, params, function (err, results) {
                    context.setResourceInitialized(resourceName);
                    if (!err) {
                        if (results && results.length > 0) {
                            //store results in setVariables
                        }
                        //TODO: check the taskName and call appropriate function

                        switch (taskName.toUpperCase()) {
                            case 'CLEAN' :
                                currentAdapterObj.clean(context, resourceName, subResourceName, params, function (err, result) {
                                    (err)?reject(err):resolve(result);
                                });
                                break;
                            case 'BUILD' :
                                currentAdapterObj.build(context, resourceName, subResourceName, params, function (err, result) {
                                    (err)?reject(err):resolve(result);
                                });
                                break;
                            case 'DEPLOY':
                                currentAdapterObj.deploy(context, resourceName, subResourceName, params, function (err, result) {
                                    (err)?reject(err):resolve(result);
                                });
                                break;
                            case 'PROMPT':
                                currentAdapterObj.prompt(context, resourceName, subResourceName, params, function (err, result) {
                                    (err)?reject(err):resolve(result);
                                });
                                break;
                        }
                    } else {//error

                    }

                });

            } else {
                switch (taskName.toUpperCase()) {
                    case 'CLEAN' :
                        currentAdapterObj.clean(context, resourceName, subResourceName, params, function (err, result) {
                            (err)?reject(err):resolve(result);
                        });
                        break;
                    case 'BUILD' :
                        currentAdapterObj.build(context, resourceName, subResourceName, params, function (err, result) {
                            (err)?reject(err):resolve(result);
                        });
                        break;
                    case 'DEPLOY':
                        currentAdapterObj.deploy(context, resourceName, subResourceName, params, function (err, result) {
                            (err)?reject(err):resolve(result);
                        });
                        break;
                    case 'PROMPT':
                        currentAdapterObj.prompt(context, resourceName, subResourceName, params, function (err, result) {
                            (err)?reject(err):resolve(result);
                        });
                        break;
                }
            }

        });


    };


    //do the same activity for all subresources/resources; don't override
    this.gotoSubResources = function(taskName, context, resourceName, subResourceName, params, cb) {

        var manager_builder                 = require('./manager');
        var async                           = require('async')
        var manager                             = manager_builder.getManager();

        console.log('climbing down the tree ... ')

        var config                          = context.getConfig(resourceName);

        var resourceType                    = config.type;

        if (!config) return;

       var subResources                        = config.properties.subResources;

        if (subResources && subResources.length > 0) {
            console.log('deploying all subresources')
            // TODO async or promise

            var promises = [];
            for (var i = 0; i < subResources.length; i++) {
                var subResource = subResources[i];
                var subResourceType         = subResource.type;
                var subResourceName         = subResource.name;

                console.log(taskName+'ing : '+ subResourceName);

                var adapter                 = manager.getAdapter(resourceType, subResourceType);
                promises.push(adapter.doTask(taskName, context, resourceName, subResourceName, params));

            }

            Promise.each(promises,function(result){
                console.log(result);
            });

            //async.eachSeries(subResources,
            //    function (subResource, callback) {
            //        var subResourceType         = subResource.type;
            //        var subResourceName         = subResource.name;
            //
            //        console.log(taskName+'ing : '+ subResourceName);
            //
            //        var adapter                 = manager.getAdapter(resourceType, subResourceType);
            //
            //        adapter.doTask(taskName, context, resourceName, subResourceName, params, function (err, result) {
            //           if(!err) {
            //               callback()
            //           } else {
            //               callback(err)
            //           }
            //        });
            //    },
            //
            //    function (err) {
            //        if(!err) {
            //            cb()
            //        } else {
            //            lib.print('ERROR',err)
            //            cb(err)
            //        }
            //
            //    }
            //);


            //use promise - synchronous invocation
            //loop through subresources
            //for each sub-resource get its adapter based on the resource & subResource type
            //config.configName = getName(resourceName, subResourceName);
            //call doTask on the subresource adapter with the subresource config. (set resourceType and resourceName attributes for the subresource config before passing, when getConfig() is not used
            //if there is an error then log the error (getLog().logErrorStatus(config, error))

        }
    };


    this.clean = function(context,resourceName,subResourceName,params,cb) {

        //do cleaning activity
        console.log('in baseAdapter clean()');
        this.gotoSubResources();
    };

    this.build = function(context,resourceName,subResourceName,params,cb) {

        console.log('in baseAdapter build()');
        this.gotoSubResources();
    };

    this.deploy = function(context,resourceName,subResourceName,params,cb) {
        console.log('in baseAdapter deploy()');
        this.gotoSubResources();
    };


    this.prompt = function(context, resourceName, subResourceName, params, cb) {

        var config = context.getConfig(resourceName);
        if (config.properties.inputs && config.properties.inputs.length > 0) {
            var inputs = config.properties.inputs;

            lib.prompt(inputs).done(function (results) { //Muthu: This would need to move to manager?
                cb(null,results);
            },function(err){cb(err,null)});
        }

        //check is there inputParams for the specific config
        //check whether all inputParams are found in context.getVariable(); if not prompt and store the input value in the variables (setVariable())

    }
}

exports.baseAdapter 			= new baseAdapter();