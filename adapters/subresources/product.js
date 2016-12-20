var apigeetool 		= require('apigeetool')
var lib				= require('../../lib')
var sdk 			= apigeetool.getPromiseSDK()

var sdk 			= apigeetool.getPromiseSDK()

var adapter = function () {
	this.clean 			= clean
	this.build 			= build
	this.deploy 		= deploy
}

function build(context, resourceName, subResourceName, params) {

}

function deploy(context, resourceName, subResourceName, params) {
	opts = lib.build_opts(context, resourceName, subResourceName)



	sdk.createProduct(opts).then(
		function(result){
			//developer created
		},
		function(err){
			//developer creation failed
		});
}


function clean(context, resourceName, subResourceName, params) {
	/*
	opts = lib.build_opts(context, resourceName, subResourceName, params)

	sdk.deleteProduct(deployment_opts).then(
		function(result){
			//developer deleted
		},
		function(err){
			//developer delete failed
		});
	*/
}

exports.adapter 			= adapter
