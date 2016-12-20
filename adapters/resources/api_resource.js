var apigeetool 		= require('apigeetool')
var lodash 			= require('lodash')
var path 			= require('path')
var async			= require('async')
var lib 			= require('../../lib')

var sdk 			= apigeetool.getPromiseSDK()

var adapter = function () {
	this.clean 			= clean
	this.build 			= build
	this.deploy 		= deploy
}

var context = {
	get_where_to_deploy: function() {
		return {
			username: 'gkidiyoor+testing@apigee.com',
			password: 'Gkidiyoortesting1!',
			environments: 'prod',
			organization: 'hulk',
		}
	},
	get_params: function() {
		return {
			basePath: '/Users/gautham/apigee/projects/openbank'
		}
	},
	get_dependency: function() {
		return [{
			name: 'some_proxy',
			type: 'api',
			version: '1.0'
		}]
	}
}

function build(context,resourceName,subResourceName, params, cb) {
	console.log('building api resource')

	config = context.getConfig(resourceName);

	lib.handle_inputs(config)
	lib.handle_configuration(config)
	handle_dependencies(config)
	handle_data_sources(config)
	this.gotoSubResources('build', context, resourceName, subResourceName, params, function (err, result) {
		cb(err, result)
	})

}

function deploy(context,resourceName,subResourceName, params, cb) {

	console.log('deploying api resource')
	this.gotoSubResources('deploy', context, resourceName, subResourceName, params, function (err, result) {
		cb(err, result)
	})//dataSources.deploy()
}


function clean(context,resourceName,subResourceName, params, cb) {

	this.gotoSubResources('clean', context, resourceName, subResourceName, params, function (err, result) {
		cb(err, result)
	})
}

function handle_data_sources(config) {
	
}

function handle_dependencies(config) {
	lib.print('INFO','Downloading dependencies')
	// pull dependency to solutions-common folder
	/*
	 dependencies = context.get_dependency()


	 async.each(dependencies,
	 function(dependency, callback) {
	 if (dependency.type == 'node') {
	 pull_node(context, dependency)

	 } else if(dependency.type == 'api') {
	 pull_api(context, dependency)
	 }
	 callback()
	 },
	 function(err) {
	 if(err != null) {
	 console.log('ERROR : ' + err)
	 } else {
	 console.log('build successful')
	 }
	 }
	 );
	 */
	// run npm install inside proxy folder
}

function pull_node(context, dependency){

}

function pull_api(context, dependency){
	
}


exports.adapter 		= adapter

