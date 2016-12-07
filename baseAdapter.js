/**
 * Created by Muthu on 28/11/16.
 */

var manager = require('./manager').getManager();

function baseAdapter() {
    this.adapterContext = {};


    function doTask(taskName,context,config,resourceName,subResourceName, params) {
        //TODO:

        var rName = config.configName;
        if (!this.adapterContext[rName]) {
            this.adapterContext[rName] = {};
        }

        if (!this.adapterContext[rName].initialized) {
            this.prompt(context,config);
            this.adapterContext[rName].initialized = true;
        }

                //TODO: check the taskName and call appropriate function

        switch (taskName.toUpperCase()) {
            case 'CLEAN': clean(context,config,resourceName,subResourceName,params); break;
            case 'BUILD': build(context,config,resourceName,subResourceName,params); break;
            case 'DEPLOY': deploy(context,config,resourceName,subResourceName,params); break;
            case 'PROMPT': prompt(context,config,resourceName,subResourceName,params); break;
        }

    }


    //do the same activity for all subresources/resources; don't override
    function repeatForAll(taskName,context,config,resourceName, subResourceName, params ) {
        //manager.repeatForAll(taskName,context,config,resourceName, subResourceName, params );

    }


    function clean(context,config,resourceName,subResourceName,params) {

        //do cleaning activity
        //this.repeatForAll();
    }

    function build(context,config,resourceName,subResourceName,params) {

    }

    function deploy(context,config,resourceName,subResourceName,params) {

    }


    function prompt(context, config) {
        //check is there inputParams for the specific config
        //check whether all inputParams are found in context.getVariable(); if not prompt and store the input value in the variables (setVariable())

    }
}