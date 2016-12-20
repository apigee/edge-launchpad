var apigeetool 		= require('apigeetool')
var lib				= require('../../lib')
var sdk 			= apigeetool.getPromiseSDK()

var sdk 			= apigeetool.getPromiseSDK()

var adapter = function () {
    this.clean 			= clean
    this.build 			= build
    this.deploy 		= deploy
}

function build(context, resourceName, subResourceName, params, cb) {

}

function deploy(context, resourceName, subResourceName, params, cb) {
    opts = lib.build_opts(context, resourceName, subResourceName)

}


function clean(context, resourceName, subResourceName, params, cb) {
    opts = lib.build_opts(context, resourceName, subResourceName)


}

exports.adapter 			= adapter
