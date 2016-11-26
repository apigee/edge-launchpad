var apigeetool 		= require('apigeetool')
var sdk 			= apigeetool.getPromiseSDK()
var lodash 			= require('lodash');
var path 			= require('path');
var async			= require('async');

var sdk 			= apigeetool.getPromiseSDK()

var context = {
	get_where_to_deploy: function() {
		return {
			username: 'gkidiyoor+testing@apigee.com',
			password: 'XXX!',
			environments: 'prod',
			organization: 'hulk',
		}
	}
}

function build(context) {

}

function deploy(context, subResourceName) {
	deployment_opts 			= {}

	// prepare deployment_opts object for deploying proxy
	where_to_deploy 			= context.get_where_to_deploy()
	lodash.merge(deployment_opts, where_to_deploy);
	
	deployment_opts.name 		= ''
	deployment_opts.apiproducts = ''
	deployment_opts.email 		= ''

	sdk.createApp(opts).then(
		function(result){
			//developer created
		},
		function(err){
			//developer creation failed
		});
}


function clean(context) {
    deployment_opts 			= {}

	// prepare deployment_opts object for deploying proxy
	where_to_deploy 			= context.get_where_to_deploy()
	lodash.merge(deployment_opts, where_to_deploy);

	deployment_opts.name 		= ''
	deployment_opts.email 		= ''		

	sdk.deleteApp(deployment_opts).then(
		function(result){
			//developer deleted
		},
		function(err){
			//developer delete failed
		});
}


build(context)
//deploy(context, 'accounts')

