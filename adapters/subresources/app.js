var apigeetool 		= require('apigeetool')
var lib				= require('../../lib')
var async           = require('async')
var loadash         = require('lodash')

var sdk 			= apigeetool.getPromiseSDK()

var adapter = function () {
	this.clean 			= clean
	this.build 			= build
	this.deploy 		= deploy
}

function build(context, resourceName, subResourceName, params, cb) {
	lib.print('INFO','building app resources')
}

function deploy(context, resourceName, subResourceName, params, cb) {
	//opts = lib.build_opts(context, resourceName, subResourceName)
	lib.print('INFO','deploying app resources')

	var config          = context.getConfig(resourceName, subResourceName)

	var items           = config.items

	var deploy_info     = context.getDeploymentInfo()

	for (var i=0; i< items.length; i++) {
		loadash.merge(items[i], deploy_info)
	}

	async.each(items, create_app, function(err){
		if(err){
			lib.print('ERRROR', err)
			cb(err)
		} else {
			cb()
		}

	})
}

function create_app(item, callback) {
	var opts 			= {}

	opts.name  			= item.name
	opts.organization 	= item.org
	opts.environments 	= item.env
	loadash.merge(opts, lib.normalize_data(JSON.parse(item.payload)))
	opts.username       = item.username
	opts.password       = item.password

	sdk.createApp(opts)
		.then(function(result){
			//cache create success
			lib.print('info', 'created app ' + item.name)
			callback()
		},function(err){
			//cache create failed
			lib.print('error', 'error creating app ' + item.name)
			callback(err)
		}) ;
}

function clean(context, resourceName, subResourceName, params, cb) {
	//opts = lib.build_opts(context, resourceName, subResourceName)
	lib.print('INFO','cleaning app resources')

	var config          = context.getConfig(resourceName, subResourceName)

	var items           = config.items

	var deploy_info     = context.getDeploymentInfo()

	for (var i=0; i< items.length; i++) {
		loadash.merge(items[i], deploy_info)
	}

	async.each(items, delete_app, function(err){
		if(err){
			lib.print('ERRROR', err)
			cb(err)
		} else {
			cb()
		}

	})
}

function delete_app(item, callback) {
	var opts 			= {}

	opts.name  			= item.name
	opts.username       = item.username
	opts.password       = item.password
	opts.organization 	= item.org
	opts.environments 	= item.env
	loadash.merge(opts, lib.normalize_data(JSON.parse(item.payload)))

	sdk.deleteApp(opts)
		.then(function(result){
			//cache create success
			lib.print('info', 'deleted app  ' + item.name)
			callback()
		},function(err){
			//cache create failed
			lib.print('error', 'error deleting app ' + item.name)
			callback(err)
		}) ;
}

exports.adapter 			= adapter
