var apigeetool 		= require('apigeetool')
var lib				= require('./lib')

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

//build(context)
deploy(context, 'accounts')

exports.clean 			= clean
exports.build 			= build
exports.deploy 			= deploy
