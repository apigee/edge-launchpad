/**
 * Created by Muthu on 28/11/16.
 */

baseAdapter = {
    adapterContext: {},

    doTask: function(taskName,context,resourceName,subResourceName, params) {

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
            case 'CLEAN' : this.clean (context,resourceName,subResourceName,params); break;
            case 'BUILD' : this.build (context,resourceName,subResourceName,params); break;
            case 'DEPLOY': this.deploy(context,resourceName,subResourceName,params); break;
            case 'PROMPT': this.prompt(context,resourceName,subResourceName,params); break;
        }

    },


    //do the same activity for all subresources/resources; don't override
    gotoSubResources: function(taskName, context, resourceName, subResourceName, params ) {

        var manager_builder                 = require('./manager');
        manager                             = manager_builder.getManager();

        console.log('climbing down the tree ... ')

        var config                          = context.getConfig(resourceName);

        var resourceType                    = config.type;

        if (!config) return;

        subResources                        = config.properties.subResources;

        if (subResources && subResources.length > 0) {
            console.log('deploying all subresources')

            for(var i=0; i< subResources.length; i++){
                var subResourceType         = subResources[i].type;
                var subResourceName         = subResources[i].name;

                console.log(taskName+'ing : '+ subResourceName)

                var adapter                 = manager.getAdapter(resourceType, subResourceType);

                adapter.doTask(taskName, context, resourceName, subResourceName, params);
            }

            //use promise - synchronous invocation
            //loop through subresources
            //for each sub-resource get its adapter based on the resource & subResource type
            //config.configName = getName(resourceName, subResourceName);
            //call doTask on the subresource adapter with the subresource config. (set resourceType and resourceName attributes for the subresource config before passing, when getConfig() is not used
            //if there is an error then log the error (getLog().logErrorStatus(config, error))

        }
    },


    clean: function(context,config,resourceName,subResourceName,params) {

        //do cleaning activity
        this.gotoSubResources();
    },

    build: function(context,config,resourceName,subResourceName,params) {

        this.gotoSubResources();
    },

    deploy: function(context,config,resourceName,subResourceName,params) {
        console.log('base deploy')
        this.gotoSubResources();
    },


    prompt: function(context, config) {
        //check is there inputParams for the specific config
        //check whether all inputParams are found in context.getVariable(); if not prompt and store the input value in the variables (setVariable())

    }
}

exports.baseAdapter 			= baseAdapter;