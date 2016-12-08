var baseAdapter                     = require('./baseAdapter')

//var Promise = require("bluebird");
var deploy_api_resource             = require('./adapters/resources/deploy_api_resource')

var instance;

function getManager() {

    if (!instance) {
        instance                    = new manager();
    }
    return instance;
}


function manager() {

    this.adapters                   = {};
    this.isDebug                    = true;

    loadAdapters();

    function loadAdapters() {
        //TODO load all adapters from config file
        //TODO make all adapters inherit from baseAdapter
        console.log('loading adapters');
    }


    this.doTask = function(taskName,context,resourceName,subResourceName,params ) {

        //TODO get the specific adapter from manager.getResource/SubResourceAdapter(resourceName, subResourceName);
        //TODO call doTask on the adapter
        //TODO:check context and taskName

        var config = context.getConfig(resourceName, subResourceName);

        if (config) {
            //config.configName       = getName(resourceName, subResourceName);
            var adapter             = this.getAdapter(config.resourceType, config.subResourceName);
            adapter.doTask(taskName, context, config, resourceName, subResourceName, params);
        }

    }

    this.getAdapter = function (resourceType, subResourceType) {
        var adapter_cont            = function(){}
        adapter_cont.prototype      = baseAdapter.baseAdapter;
        adapter                     = new adapter_cont();
        console.log(adapter)
        adapter.deploy         = deploy_api_resource.deploy;
        return {doTask: function(){}}
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


exports.getManager = getManager;