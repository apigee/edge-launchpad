var apigeetool 		= require('apigeetool')
var lib				= require('../../lib')
var sdk 			= apigeetool.getPromiseSDK()

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

}


function clean(context) {
    opts = lib.build_opts(context, resourceName, subResourceName)


}

exports.adapter 			= adapter