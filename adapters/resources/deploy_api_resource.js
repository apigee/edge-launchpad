var apigeetool 		= require('apigeetool')
var sdk 			= apigeetool.getPromiseSDK()
var lodash 			= require('lodash');
var path 			= require('path');
var async			= require('async');

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

function build(context) {
	// pull dependency to solutions-common folder
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

	// run npm install inside proxy folder

}

function deploy(context, subResourceName) {
	console.log('deploying api resource')
	this.gotoSubResources();
}


function clean(context) {

}

function pull_node(context, dependency){

}

function pull_api(context, dependency){
	
}

build(context)
//deploy(context, 'accounts')

exports.clean 			= clean
exports.build 			= build
exports.deploy 			= deploy
