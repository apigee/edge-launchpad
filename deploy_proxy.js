var apigeetool 		= require('apigeetool')
var lodash 			= require('lodash')
var path 			= require('path')
var async			= require('async')
var fs				= require('fs-extra')
var mustache 		= require('mustache')
var child_process	= require('child_process')

var sdk 			= apigeetool.getPromiseSDK()

var context = {
	basePath: '/Users/gautham/apigee/projects/openbank',
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

		}
	},
	getAllVariables: function(){
		return {name: 'Gautham V Kidiyoor'}
	}
}

function build(context, subResourceName) {
	// copy proxy files to target folder
	var proxy_dir 				= path.join(context.basePath, '/src/gateway/', subResourceName, 'apiproxy')
	var proxy_target_dir		= path.join(context.basePath, '/src/gateway/', subResourceName, 'target')

	
	if (!fs.existsSync(proxy_target_dir)){
		fs.mkdirSync(proxy_target_dir);
	}

	// copy contents from apiproxy to target
	fs.copy(proxy_dir, proxy_target_dir, function (err) {
		if (err) {
			console.error(err)
		} else {
			var inject_object = context.getAllVariables()
			replace_variables(proxy_target_dir, inject_object)
		}

		// do a npm install
		var npm_dir = path.join(proxy_target_dir, 'resources/node')
		if (fs.existsSync(npm_dir)){
			npm_install_local_only(npm_dir,function(code){
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

}

function deploy(context, subResourceName) {
	deployment_opts 			= {}

	// prepare deployment_opts object for deploying proxy
	where_to_deploy 			= context.get_where_to_deploy()
	lodash.merge(deployment_opts, where_to_deploy);
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

}


function clean(context, subResourceName) {
	var proxy_target_dir		= path.join(context.basePath, '/src/gateway/', subResourceName, 'target')
	fs.emptyDir(proxy_target_dir, function(err){
		if (err) {
			console.error(err)
		} else {
			console.log('done vacuming cleaning')
		}
	})
}

function pull_node(context, dependency){

}

function pull_api(context, dependency){

}

function replace_variables(proxy_target_dir, inject_object) {
	fs.walk(proxy_target_dir)
	.on('data', function (item) {
		if(item.stats.isFile()) {
			console.log(item.path)
			var path_to_template = item.path
			fs.readFile(path_to_template, function(err, data) {
				if (err) {
					console.error(err)
				} else {
					var mu_template = String(data)
					var output = mustache.render(mu_template, inject_object)
					fs.outputFile(path_to_template, output, function (err) {
						if (err) {
							console.error(err)
						}
					})
				}
			})
		}
		
	})
	.on('end', function () {
		console.log('done replacing variables')
	})
}

function npm_install_local_only(npm_dir, callback) {
	var npm_process = child_process.spawn('npm', ['install'],{'cwd': npm_dir})
	
	npm_process.stdout.on('data', (data) => {
		console.log(data)
	});

	npm_process.stderr.on('data', (data) => {
		console.log(data)
	});

	npm_process.on('exit', (code) => {
		console.log(code)
		console.log('npm install over !!')
		callback(code)
	});		
}

build(context, 'accounts')
//deploy(context, 'accounts')

