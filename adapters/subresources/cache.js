var apigeetool 		= require('apigeetool')
var lib				= require('../../lib')
var async           = require('async')
var loadash         = require('lodash')

var sdk 			= apigeetool.getPromiseSDK()

var sdk 			= apigeetool.getPromiseSDK()

var adapter = function () {
    this.clean 			= clean
    this.build 			= build
    this.deploy 		= deploy
}

function build(context, resourceName, subResourceName, params, cb) {
    lib.print('INFO','building cache resources')
}

function deploy(context, resourceName, subResourceName, params, cb) {
    //opts = lib.build_opts(context, resourceName, subResourceName)
    lib.print('INFO','deploying cache resources')
    var config          = context.getConfig(resourceName, subResourceName)

    var items           = config.items

    var deploy_info     = context.getDeploymentInfo()

    for (var i=0; i< items.length; i++) {
        loadash.merge(items[i], deploy_info)
    }

    async.each(items, create_cache, function(err){
        if(err){
            lib.print('ERRROR', err)
            cb(err)
        } else {
            cb()
        }

    })



}

function create_cache(item, callback) {
    var opts             = {}

    opts.cache           = item.name
    opts.username        = item.username
    opts.password        = item.password

    sdk.createcache(opts)
        .then(function(result){
            //cache create success
            callback()
        },function(err){
            //cache create failed
            callback(err)
        }) ;
}

function clean(context, resourceName, subResourceName, params, cb) {
    //opts = lib.build_opts(context, resourceName, subResourceName)
    lib.print('INFO','cleaning cache resources')
}

exports.adapter 			= adapter
