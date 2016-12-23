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
    this.adapters = {};
    //this.adapters                   = JSON.parse(fs.readFileSync('./config/adapters.json', 'utf8'));


    this.doTask = function(taskName, context, resourceName, subResourceName, params, cb ) {

        //TODO get the specific adapter from manager.getResource/SubResourceAdapter(resourceName, subResourceName);
        //TODO call doTask on the adapter
        //TODO:check context and taskName

        console.log("manager.doTask:  resourceName-" + resourceName + "  subresourceName-"+ subResourceName);

        var config                  = context.getConfig(resourceName, subResourceName);

        if(!config){
            lib.print('error','ERROR retriving config, check parameters')
            return
        }

        var adapter;
        if(!resourceName && !subResourceName) {

            for(var i=0; i<config.length; i++){
                var resourceType        = config[i].type;
                adapter             = this.getAdapter(resourceType);

                var resourceName        = config[i].name;

                adapter.doTask(taskName, context, resourceName, subResourceName, params).done(function (result){
                    cb(null,result);
                }, function(err){
                    cb(err,null);
                });
            }
        } else if (!subResourceName) {
            var resourceType            = config.type;
            adapter                 = this.getAdapter(resourceType);

            adapter.doTask(taskName, context, resourceName, subResourceName, params).done(function (result){
                cb(null,result);
            }, function(err){
                cb(err,null);
            });
        } else {
            var subResourceType         = config.type;
            // to get resource type
            var config                  = context.getConfig(resourceName, null);
            var resourceType            = config.type;
            adapter                 = this.getAdapter(resourceType, subResourceType);

            adapter.doTask(taskName, context, resourceName, subResourceName, params).done(function (result){
                cb(null,result);
            }, function(err){
                cb(err,null);
            });
        }
    }

    this.getAdapter = function (resourceType, subResourceType) {
        console.log('ResourceType-'+resourceType+"   SubResourceType-" + subResourceType);
        console.log("this.adapters: " + this.adapters);
        (this.adapters?console.log("adapters length: " + this.adapters.length):console.log("0"));

        var name = (resourceType)?((subResourceType)?resourceType+'.'+subResourceType:resourceType):'.';

        var adapter = this.adapters[name];
        if (!adapter) {
            //error
            console.log("Adapter not found for : " + name);
        } else {
            return adapter;
        }
    }

    this.prompt = function (context, resourceName) {
        var config                      = context.getConfig(resourceName);

        if (config.properties.inputs && config.properties.inputs.length > 0) {
            var inputs = config.properties.inputs;

            lib.prompt(inputs, function (err, results) {
                if (!err) {
                    console.log('in return');
                    return results;
                } else {
                    lib.print('error','ERROR while prompt');
                    lib.print('error', err);
                    throw err;
                }
            });
        }
    }
    this.loadAdapters = function (configFile) {
        var adapterConfigs                   = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        if (adapterConfigs) {
            for (var x in adapterConfigs) {
                var adapter                 = require(adapterConfigs[x]).adapter;
                adapter.__proto__ = baseAdapter.baseAdapter;
                this.adapters[x] = adapter;
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


//var manager = getManager();

exports.getManager = getManager;
