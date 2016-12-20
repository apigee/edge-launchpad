var fs                              = require('fs')
var baseAdapter                     = require('./baseAdapter')
var lodash 			                = require('lodash')
var lib                             = require('./lib')
//var Promise = require("bluebird");

var instance;

function getManager() {

    if (!instance) {
        instance                    = new manager();
    }
    return instance;
}


function manager() {

    this.isDebug                    = true;
    this.adapters                   = JSON.parse(fs.readFileSync('./config/adapters.json', 'utf8'));

    this.doTask = function(taskName, context, resourceName, subResourceName, params ) {

        //TODO get the specific adapter from manager.getResource/SubResourceAdapter(resourceName, subResourceName);
        //TODO call doTask on the adapter
        //TODO:check context and taskName

        var config                  = context.getConfig(resourceName, subResourceName);

        if(!config){
            console.log('ERROR retriving config, check parameters')
            return
        }


            if(!resourceName && !subResourceName) {
                for(var i=0; i<config.length; i++){
                    var resourceType        = config[i].type;
                    var adapter             = this.getAdapter(resourceType);

                    var resourceName        = config[i].name;

                    adapter.doTask(taskName, context, resourceName, subResourceName, params);
                }
            } else if (!subResourceName) {
                var resourceType            = config.type;
                var adapter                 = this.getAdapter(resourceType);

                adapter.doTask(taskName, context, resourceName, subResourceName, params);
            } else {
                var resourceType            = config.type;
                var adapter                 = this.getAdapter(resourceType);

                adapter.doTask(taskName, context, resourceName, subResourceName, params);
        }
    }

    this.getAdapter = function (resourceType, subResourceType) {
        if(subResourceType){
            var s_type                  = resourceType + '.' + subResourceType;
            var adapter                 = require(this.adapters[s_type]).adapter;
            adapter.prototype           = baseAdapter.baseAdapter;
            var adapter_obj             = new adapter;
            return adapter_obj
        } else if(resourceType) {
            var adapter                 = require(this.adapters[resourceType]).adapter;
            adapter.prototype           = baseAdapter.baseAdapter;
            var adapter_obj             = new adapter;
            return adapter_obj
        } else {
            console.log('ERROR retrieving adapter');
        }
    }

    this.prompt = function (context, resourceName, cb) {
        var config                      = context.getConfig(resourceName);

        if (config.properties.inputs && config.properties.inputs.length > 0) {
            var inputs = config.properties.inputs;

            lib.prompt(inputs, function (err, results) {
                if (!err) {
                    cb(results)
                } else {
                    console.log('ERROR while prompt');
                    console.log(err);
                }
            });
        }
    }

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




//repeatAll(taskName, context, config, resourceName, subResourceName, params) {
    //if resources collection exists in config, for each each resource do the following; otherwise for each subresource do the following
    //for (x in config.resources or config.subresources) {
    // get specific adapter
    // call doTask(taskName, ....) in sequence.
//}


exports.getManager = getManager;
