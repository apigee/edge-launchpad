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
	lib.print('INFO','building product resources')
}

function deploy(context, resourceName, subResourceName, params, cb) {
	//opts = lib.build_opts(context, resourceName, subResourceName)
	lib.print('INFO','deploying product resources')

	var config          = context.getConfig(resourceName, subResourceName)

	var items           = config.items

	var deploy_info     = context.getDeploymentInfo()

	for (var i=0; i< items.length; i++) {
		loadash.merge(items[i], deploy_info)
	}

	async.each(items, create_product, function(err){
		if(err){
			lib.print('ERRROR', err)
			cb(err)
		} else {
			cb()
		}

	})
}

function create_product(item, callback) {
	var opts 			= {}

	opts.name  			= item.name
	loadash.merge(opts, JSON.parse(item.payload))
	opts.username       = item.username
	opts.password       = item.password

	sdk.createProduct(opts)
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
	lib.print('INFO','cleaning product resources')

	var config          = context.getConfig(resourceName, subResourceName)

	var items           = config.items

	var deploy_info     = context.getDeploymentInfo()

	for (var i=0; i< items.length; i++) {
		loadash.merge(items[i], deploy_info)
	}

	async.each(items, delete_product, function(err){
		if(err){
			lib.print('ERRROR', err)
			cb(err)
		} else {
			cb()
		}

	})
}

function delete_product(item, callback) {
	var opts 			= {}

	opts.name  			= item.name
	loadash.merge(opts, JSON.parse(item.payload))
	opts.username       = item.username
	opts.password       = item.password

	sdk.deleteProduct(opts)
		.then(function(result){
			//cache create success
			callback()
		},function(err){
			//cache create failed
			callback(err)
		}) ;
}

exports.adapter 			= adapter
