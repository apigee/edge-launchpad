var apigeetool 		= require('apigeetool')
var sdk 			= apigeetool.getPromiseSDK()
var path 			= require('path');
var async			= require('async');

var sdk 			= apigeetool.getPromiseSDK()

var adapter = function () {
	this.clean 			= clean
	this.build 			= build
	this.deploy 		= deploy
}

function build(context, resourceName, subResourceName, params) {

}

function deploy(context, resourceName, subResourceName, params) {
	/*
	deployment_opts 			= {}

	// prepare deployment_opts object for deploying proxy
	where_to_deploy 			= context.get_where_to_deploy()
	lodash.merge(deployment_opts, where_to_deploy)
	
	config = context.getSubResourceConfig(resourceName, subResourceName)
	deployment_opts.email 		= subResourceName
	lodash.merge(deployment_opts, config.payload)

	sdk.createDeveloper(opts).then(
		function(result){
			//developer created
		},
		function(err){
			//developer creation failed
		});
	*/
}


function clean(context, resourceName, subResourceName, params) {
	/*
    deployment_opts 			= {}

	// prepare deployment_opts object for deploying proxy
	where_to_deploy 			= context.get_where_to_deploy()
	lodash.merge(deployment_opts, where_to_deploy);

	config = context.getSubResourceConfig(resourceName, subResourceName)
	deployment_opts.email 		= subResourceName
	lodash.merge(deployment_opts, config.payload)


	sdk.deleteDeveloper(deployment_opts).then(
		function(result){
			//developer deleted
		},
		function(err){
			//developer delete failed
		});
		*/
}

exports.adapter 			= adapter

