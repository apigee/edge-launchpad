var apigeetool 		= require('apigeetool')
var lodash 			= require('lodash')
var path 			= require('path')
var async			= require('async')
var lib 			= require('../../lib')

var sdk 			= apigeetool.getPromiseSDK()

function api_resources () {
    this.build = function build(context,resourceName,subResourceName, params, cb) {
        console.log('building api resource')

        var config = context.getConfig(resourceName);

        //lib.handle_inputs(config)
        lib.handle_configuration(config)
        handle_dependencies(config)
        handle_data_sources(config)
        this.gotoSubResources('build', context, resourceName, subResourceName, params, function (err, result) {
            cb(err, result)
        })

    };

    this.deploy = function deploy(context,resourceName,subResourceName, params, cb) {

        console.log('deploying api resource')
        this.gotoSubResources('deploy', context, resourceName, subResourceName, params, function (err, result) {
            cb(err, result)
        })//dataSources.deploy()
    };


    this.clean = function clean(context,resourceName,subResourceName, params, cb) {

        this.gotoSubResources('clean', context, resourceName, subResourceName, params, function (err, result) {
            cb(err, result)
        })
    }
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



function handle_data_sources(config) {
	
}

function handle_dependencies(config) {

    //Muthu: get logger from context() or baseAdapter() and use it to log...
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


exports.adapter 		= new api_resources();

