var apigeetool 		= require('apigeetool')
var lib				= require('./lib')

var sdk 			= apigeetool.getPromiseSDK()


var adapter = function () {
	this.clean 			= clean
	this.build 			= build
	this.deploy 		= deploy
}

function build(context) {

}

function deploy(context, resourceName, subResourceName) {
	opts = lib.build_opts(context, resourceName, subResourceName)

	sdk.createApp(opts).then(
		function(result){
			//developer created
		},
		function(err){
			//developer creation failed
		});
}


function clean(context) {
	opts = lib.build_opts(context, resourceName, subResourceName)

	sdk.deleteApp(deployment_opts).then(
		function(result){
			//developer deleted
		},
		function(err){
			//developer delete failed
		});
}

exports.adapter 			= adapter