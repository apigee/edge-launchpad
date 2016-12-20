/**
 * Created by Muthu on 28/11/16.
 */

baseAdapter = {
    adapterContext: {},

    doTask: function(taskName,context,resourceName,subResourceName, params, cb) {

        //TODO:

        /*
        var rName                           = config.configName;
        if (!this.adapterContext[rName]) {
            this.adapterContext[rName]      = {};
        }

        if (!this.adapterContext[rName].initialized) {
            this.prompt(context,config);
            this.adapterContext[rName].initialized = true;
        }
        */

        //TODO: check the taskName and call appropriate function

        switch (taskName.toUpperCase()) {
            case 'CLEAN' : this.clean (context, resourceName, subResourceName, params, function (err, result) {
                cb(err, result)
            }); break;
            case 'BUILD' : this.build (context, resourceName, subResourceName, params, function (err, result) {
                cb(err, result)
            }); break;
            case 'DEPLOY': this.deploy(context, resourceName, subResourceName, params, function (err, result) {
                cb(err, result)
            }); break;
            case 'PROMPT': this.prompt(context, resourceName, subResourceName, params, function (err, result) {
                cb(err, result)
            }); break;
        }

    },


    //do the same activity for all subresources/resources; don't override
    gotoSubResources: function(taskName, context, resourceName, subResourceName, params, cb) {

        var manager_builder                 = require('./manager');
        var async                           = require('async')
        manager                             = manager_builder.getManager();

        console.log('climbing down the tree ... ')

        var config                          = context.getConfig(resourceName);

        var resourceType                    = config.type;

        if (!config) return;

        subResources                        = config.properties.subResources;

        if (subResources && subResources.length > 0) {
            console.log('deploying all subresources')
            // TODO async or promise

            async.eachSeries(subResources,
                function (subResource, callback) {
                    var subResourceType         = subResource.type;
                    var subResourceName         = subResource.name;

                    console.log(taskName+'ing : '+ subResourceName);

                    var adapter                 = manager.getAdapter(resourceType, subResourceType);

                    adapter.doTask(taskName, context, resourceName, subResourceName, params, function (err, result) {
                       if(!err) {
                           callback()
                       } else {
                           callback(err)
                       }
                    });
                },

                function (err) {
                    if(!err) {
                        cb()
                    } else {
                        lib.print('ERROR',err)
                        cb(err)
                    }

                }
            );


            //use promise - synchronous invocation
            //loop through subresources
            //for each sub-resource get its adapter based on the resource & subResource type
            //config.configName = getName(resourceName, subResourceName);
            //call doTask on the subresource adapter with the subresource config. (set resourceType and resourceName attributes for the subresource config before passing, when getConfig() is not used
            //if there is an error then log the error (getLog().logErrorStatus(config, error))

        }

        var err;
        var result;

        cb(err, result)
    },


    clean: function(context,config,resourceName,subResourceName,params,cb) {

        //do cleaning activity
        this.gotoSubResources();
    },

    build: function(context,config,resourceName,subResourceName,params,cb) {

        this.gotoSubResources();
    },

    deploy: function(context,config,resourceName,subResourceName,params,cb) {
        console.log('base deploy')
        this.gotoSubResources();
    },


    prompt: function(context, config) {
        //check is there inputParams for the specific config
        //check whether all inputParams are found in context.getVariable(); if not prompt and store the input value in the variables (setVariable())

    }
}

exports.baseAdapter 			= baseAdapter;