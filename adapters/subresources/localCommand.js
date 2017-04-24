/*
 Copyright 2017 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

var lib				= require('../../lib')
var child_process   = require('child_process')
var async           = require('async')
var mustache        = require('mustache')

mustache.escape = function (value) {
    return value;
};


var adapter = function () {
    this.clean 			= clean
    this.build 			= build
    this.deploy 		= deploy
}

function build(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','building localCommand resources')
    cb()
}

function deploy(context, resourceName, subResourceName, params, cb) {
    //opts = lib.build_opts(context, resourceName, subResourceName)
    lib.print('meta','deploying localCommand resources')

    var config          = context.getConfig(resourceName, subResourceName)

    var items           = lib.filter_items(config.items, params)

    for (var i=0; i< items.length; i++) {
        items[i].basePath = context.getBasePath(resourceName)
        items[i].context  = context
    }

    async.each(items, run_command, function(err){
        if(err){
            lib.print('ERROR', err)
            cb()
        } else {
            cb()
        }

    })
}

function run_command(item, callback) {
    var context = item.context
    var basePath = item.basePath
    var cmd     = mustache.render(item.cmd, context.getAllVariables())
    var cmds    = cmd.split(' ')

    var command = child_process.spawn(cmds[0], cmds.slice(1),{'cwd': basePath})

    var result = '';

    command.stdout.on('data', function(data) {
        result += data.toString();
    });

    command.stderr.on('data', function(data) {
        //result += data.toString();
    });

    command.on('exit', function(code) {
        lib.print('info', 'command run : ' + item.name)
        lib.print('info', 'output : ' + result)

        if(item.assignResponse && item.assignResponse.length > 0){
            lib.extract_response(context, item.assignResponse, result)
        }

        callback()
    });
}

function clean(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','cleaning localCommand resources')
    cb()
}

exports.adapter 			= adapter
