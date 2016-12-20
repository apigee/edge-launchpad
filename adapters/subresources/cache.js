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
    lib.print('INFO','building cache resources')
}

function deploy(context, resourceName, subResourceName, params) {
    //opts = lib.build_opts(context, resourceName, subResourceName)
    lib.print('INFO','deploying cache resources')
}


function clean(context, resourceName, subResourceName, params) {
    //opts = lib.build_opts(context, resourceName, subResourceName)
    lib.print('INFO','cleaning cache resources')
}

exports.adapter 			= adapter
