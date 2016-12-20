var apigeetool 		= require('apigeetool')
var lodash 			= require('lodash')
var path 			= require('path')
var fs				= require('fs-extra')
var mustache 		= require('mustache')
var child_process	= require('child_process')
var lib 			= require('../../lib')

var sdk 			= apigeetool.getPromiseSDK()

var adapter = function () {
	this.clean 			= clean
	this.build 			= build
	this.deploy 		= deploy
}

function build(context, resourceName, subResourceName, params, cb) {
	/*
	// copy proxy files to target folder
	var proxy_dir 				= path.join(context.basePath, '/src/gateway/', subResourceName, 'apiproxy')
	var proxy_target_dir		= path.join(context.basePath, '/src/gateway/', subResourceName, 'target')

	
	if (!fs.existsSync(proxy_target_dir)){
		fs.mkdirSync(proxy_target_dir)
	}

	// copy contents from apiproxy to target
	fs.copy(proxy_dir, proxy_target_dir, function (err) {
		if (err) {
			console.error(err)
		} else {
			var inject_object = context.getAllVariables()
			lib.replace_variables(proxy_target_dir, inject_object)
		}

		// do a npm install
		var npm_dir = path.join(proxy_target_dir, 'resources/node')
		if (fs.existsSync(npm_dir)){
			lib.npm_install_local_only(npm_dir,function(code){
				if (code != 0) {
					console.error(err)
				} else {
					console.log('build complete ... yayy')
				}
			})
		}
		
	});

	// npm install only local dependencies

	// run npm install inside proxy folder
	*/
}

function deploy(context, resourceName, subResourceName, params, cb) {
	/*
	deployment_opts 			= {}

	// prepare deployment_opts object for deploying proxy
	where_to_deploy 			= context.get_where_to_deploy()
	lodash.merge(deployment_opts, where_to_deploy)
	deployment_opts.directory 	= path.join(context.basePath, 'src/gateway', subResourceName, 'target')
	deployment_opts.api 		= subResourceName
	
	// deploy proxy
	sdk.deployProxy(deployment_opts).then( 
		function(result){
		    //deploy success
		    console.log(result)
		    console.log('deploy successful')
	    },
	    function(err){
		    //deploy failed 
		    console.log(err)
		    console.log('deploy failed')
	})
	*/

}


function clean(context, resourceName, subResourceName, params, cb) {
	/*
	var proxy_target_dir		= path.join(context.basePath, '/src/gateway/', subResourceName, 'target')
	fs.emptyDir(proxy_target_dir, function(err){
		if (err) {
			console.error(err)
		} else {
			console.log('done vacuming cleaning')
		}
	})
	*/
}

exports.adapter 			= adapter

