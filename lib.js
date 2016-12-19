var lodash 			= require('lodash')
var path 			= require('path')
var fs				= require('fs-extra')
var mustache 		= require('mustache')

function build_opts(context, resourceName, subResourceName){
	opts 						= {}

	// prepare deployment_opts object for deploying proxy
	where_to_deploy 			= {} //context.get_where_to_deploy()
	lodash.merge(opts, where_to_deploy)

	config 						= {}//context.getSubResourceConfig(resourceName, subResourceName)
	opts.name 					= subResourceName
	lodash.merge(opts, config.payload)

	return opts
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
					var output 	= mustache.render(mu_template, inject_object)
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
	var npm_process 			= child_process.spawn('npm', ['install'],{'cwd': npm_dir})
	
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

exports.build_opts 				= build_opts
exports.replace_variables 		= replace_variables
exports.npm_install_local_only	= npm_install_local_only
