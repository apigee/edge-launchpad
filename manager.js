
var Promise = require("bluebird");


var instance;

function getManager() {

    if (!instance) {
        instance = new manager();
    }
    return instance;
}

exports.getManager = getManager;

function manager() {

    this.adapters = {};
    this.isDebug = true;
    loadAdapters();

    function loadAdapters() {
        //load all adapters from config file
        //make all adapters inherit from baseAdapter
    }

    //doTask(taskName, context, resourceName, subResourceName, params) {
////get the specific adapter from manager.getResource/SubResourceAdapter(resourceName, subResourceName);
//call doTask on the adapter

//}

    this.doTask = function(taskName,context,resourceName,subResourceName,params ) {
        //TODO:check context and taskName

        var config = context.getConfig(resourceName, subResourceName);



        if (config) {
            config.configName = getName(resourceName, subResourceName);
            var adapter = (subResourceName)?this.getAdapter(config.resourceType,config.subResourceType):this.getAdapter(config.resourceType);
            adapter.doTask(taskName,context,config,resourceName,subResourceName, params);
        }

    }

    this.repeatToAll = function(taskName,context,resourceName,subResourceName,params) {

        if (subResourceName) return;

        var config = context.getConfig(resourceName);

        if (!config) return;

        if (config.subResources && config.subResources.length > 0) {

            //use promise - synchronous invocation
            //loop through subresources
            //for each sub-resource get its adapter based on the resource & subResource type
            //config.configName = getName(resourceName, subResourceName);
            //call doTask on the subresource adapter with the subresource config. (set resourceType and resourceName attributes for the subresource config before passing, when getConfig() is not used
            //if there is an error then log the error (getLog().logErrorStatus(config, error))
        } else if (config.resources && config.resources.length > 0) {
            //use promise - synchronous invocation
            //loop through subresources
            //for each sub-resource get its adapter based on the resource & subResource type
            //config.configName = getName(resourceName, subResourceName);
            //call doTask on the subresource adapter with the subresource config. (set resourceType and resourceName attributes for the subresource config before passing, when getConfig() is not used
            //if there is an error then log the error (getLog().logErrorStatus(config, error))
        }

    }

}


function getName(resourceName, subResourceName) {

    var name = '.' + (resourceName)?resourceName:''+(subResourceName)?'.'+subResourceName:'';
    return name;
}

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

//provide registerAdapter methods
//while registering if there is already an adapter for the type, make it the parent for to be registered adapter
//registerResourceAdapter(resourceType, adapter);
//if adapters[resourceType] exists, then adapter._prototype = adapters[resourceType] and adapters[resourceType] = adapter.
// other adapter._prototype = baseAdapter and adapters[resourceType] = adapter
//simlarly for registerSubResourceAdapter(resourceType, subResourceType, adapter);
//deregister() methods




//repeatAll(taskName, context, config, resourceName, subResourceName, params) {
    //if resources collection exists in config, for each each resource do the following; otherwise for each subresource do the following
    //for (x in config.resources or config.subresources) {
    // get specific adapter
    // call doTask(taskName, ....) in sequence.
//}