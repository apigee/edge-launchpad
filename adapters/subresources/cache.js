var apigeetool 		= require('apigeetool')
var lib				= require('../../lib')
var async           = require('async')
var lodash         = require('lodash')

var sdk 			= apigeetool.getPromiseSDK()

var adapter = function () {
    this.clean 			= clean
    this.build 			= build
    this.deploy 		= deploy
}

function build(context, resourceName, subResourceName, params, cb) {
    lib.print('INFO','building cache resources')
    cb()
}

function deploy(context, resourceName, subResourceName, params, cb) {
    lib.print('INFO','deploying cache resources')
    var config          = context.getConfig(resourceName, subResourceName)

    var items           = config.items

    var deploy_info     = context.getDeploymentInfo()

    for (var i=0; i< items.length; i++) {
        lodash.merge(items[i], deploy_info)
    }

    async.each(items, create_cache, function(err){
        if(err){
            lib.print('ERROR', err)
            cb()
        } else {
            cb()
        }

    })
}

function create_cache(item, callback) {
    var opts             = item

    opts.cache           = item.name
    lodash.merge(opts, lib.normalize_data(JSON.parse(item.payload)))
    var environments    = item.environments
    for (var i=0; i<environments.length; i++){
        opts.environment = environments[i]
        sdk.createcache(opts)
            .then(function(result){
                //cache create success
                lib.print('info', 'created cache ' + item.name + ' for env ' + item.environment)
                callback()
            },function(err){
                //cache create failed
                lib.print('error', 'error creating cache ' + item.name + ' for env ' + item.environment)
                lib.print('ERROR', err)
                callback()
            }) ;
    }

}

function clean(context, resourceName, subResourceName, params, cb) {
    //opts = lib.build_opts(context, resourceName, subResourceName)
    lib.print('INFO','cleaning cache resources')

    var config          = context.getConfig(resourceName, subResourceName)

    var items           = config.items

    var deploy_info     = context.getDeploymentInfo()

    for (var i=0; i< items.length; i++) {
        lodash.merge(items[i], deploy_info)
    }

    async.each(items, delete_cache, function(err){
        if(err){
            lib.print('ERROR', err)
            cb()
        } else {
            cb()
        }

    })
}

function delete_cache(item, callback) {
    var opts             = item

    opts.cache           = item.name
    lodash.merge(opts, lib.normalize_data(JSON.parse(item.payload)))

    sdk.deletecache(opts)
        .then(function(result){
            //cache create success
            lib.print('info', 'deleted cache ' + item.name)
            callback()
        },function(err){
            //cache create failed
            lib.print('error', 'error deleting cache ' + item.name)
            lib.print('ERRROR', err)
            callback()
        }) ;
}

exports.adapter 			= adapter
