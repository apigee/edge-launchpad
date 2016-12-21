var lodash 			= require('lodash')
var path 			= require('path')
var fs				= require('fs-extra')
var mustache 		= require('mustache')
var prompt_lib		= require('prompt');

function build_opts(context, resourceName, subResourceName){
	opts 						= {}

	// prepare deployment_opts object for deploying proxy
	where_to_deploy 			= context.getDeploymentInfo()


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

function prompt(inputs, cb) {
	var required_values = []

	for(var i=0; i<inputs.length; i++){
		required_values.push({name: inputs[i].name, description: inputs[i].prompt, type: 'string', required: true})
	}

	prompt_lib.start();

	prompt_lib.get(required_values, function(err, results) {
		cb(err, result)
	});

}

function print(level, msg){
	console.log(msg)
}

function handle_inputs(config) {
	print('INFO','Handling inputs')
}

function handle_configuration(config){

}

function normalize_data(obj) {
	if(obj.scopes){
		var str = ''
		obj.scopes.forEach(function(item){
			if(item && item.trim()!= '') {
				str += item.trim() + ","
			}
		})
		obj.scopes = str
	}

	if(obj.environments){
		var str = ''
		obj.environments.forEach(function(item){
			if(item && item.trim()!= '') {
				str += item.trim() + ","
			}
		})
		obj.environments = str
	}

	if(obj.proxies){
		var str = ''
		obj.proxies.forEach(function(item){
			if(item && item.trim()!= '') {
				str += item.trim() + ","
			}
		})
		obj.proxies = str
	}

	return obj
}

exports.build_opts 				= build_opts
exports.replace_variables 		= replace_variables
exports.npm_install_local_only	= npm_install_local_only
exports.prompt 					= prompt
exports.handle_configuration 	= handle_configuration
exports.handle_inputs 			= handle_inputs
exports.print 					= print
exports.normalize_data 			= normalize_data