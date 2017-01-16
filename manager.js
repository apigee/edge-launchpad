var fs                              = require('fs')
var baseAdapter                     = require('./baseAdapter')
var lodash 			                = require('lodash')
var lib                             = require('./lib')

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

    this.doTask = function(taskName, context, resourceName, subResourceName, params, cb ) {

        //TODO get the specific adapter from manager.getResource/SubResourceAdapter(resourceName, subResourceName);
        //TODO call doTask on the adapter
        //TODO:check context and taskName

        var config                  = context.getConfig(resourceName, subResourceName);

        if(!config){
            lib.print('error','ERROR retriving config, check parameters')
            return
        }

        //TODO use promise here, clean vari
        if(!resourceName && !subResourceName) {
            for(var i=0; i<config.length; i++){
                var resourceType        = config[i].type;
                var adapter             = this.getAdapter(resourceType);

                var resourceName        = config[i].name;

                context.loadConfiguration(resourceName);

                adapter.doTask('PROMPT', context, resourceName, subResourceName, params, function (err, result) {
                    adapter.doTask(taskName, context, resourceName, subResourceName, params, function (err, result) {
                        cb(err, result)
                    });
                });
            }
        } else if (!subResourceName) {
            context.loadConfiguration(resourceName);

            var resourceType            = config.type;
            var adapter                 = this.getAdapter(resourceType);

            adapter.doTask('PROMPT', context, resourceName, subResourceName, params, function (err, result) {
                adapter.doTask(taskName, context, resourceName, subResourceName, params, function (err, result) {
                    cb(err, result)
                });
            });
        } else {
            context.loadConfiguration(resourceName);

            var subResourceType         = config.type;
            // to get resource type
            var config                  = context.getConfig(resourceName, null);
            var resourceType            = config.type;
            var adapter                 = this.getAdapter(resourceType, subResourceType);

            adapter.doTask('PROMPT', context, resourceName, subResourceName, params, function (err, result) {
                adapter.doTask(taskName, context, resourceName, subResourceName, params, function (err, result) {
                    cb(err, result)
                });
            });
        }
    }

    this.getAdapter = function (resourceType, subResourceType) {
        var name = (resourceType)?((subResourceType)?resourceType+'.'+subResourceType:resourceType):'.';

        var adapter = this.adapters[name];

        if (!adapter) {
            //error
            console.log("Adapter not found for : " + name);
        } else {
            return adapter;
        }
    }

    this.loadAdapters = function (configFile) {
        var adapterConfigs                   = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        if (adapterConfigs) {
            for (var x in adapterConfigs) {
                var adapter                 = require(adapterConfigs[x]).adapter;
                adapter.prototype           = baseAdapter.baseAdapter;
                this.adapters[x]            = new adapter;
            }
        }

        this.adapters['.'] = baseAdapter;
    }

    this.loadAdapters('./config/adapters.json');
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
