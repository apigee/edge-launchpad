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

var lib				= require('../../lib');
var path            = require('path');
var mustache        = require('mustache');

mustache.escape = function (value) {
    return value;
};

var adapter = function () {
    this.clean 			= clean;
    this.build 			= build;
    this.deploy 		= deploy;
}

function build(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','building config substitution');
    cb();
}

function deploy(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','deploying config substitution');

    var config          = context.getConfig(resourceName, subResourceName);

    var items           = lib.filter_items(config.items, params);

    var paths           = [];
    var inject_object   = {};

    for (var i=0; i<items.length; i++){
        var paths_tmp       = items[i].filePaths;

        if(!paths_tmp || !items[i].name || !items[i].value){
            lib.print('error', 'paths or name or value not mentioned');
        }

        for (var j=0; j<paths_tmp.length; j++) {
            paths.push(path.join(context.getBasePath(resourceName), paths_tmp[j]));
        }

        var toReplace   = items[i].name;
        var replaceBy   = mustache.render(items[i].value, context.getAllVariables());

        if(!replaceBy){
            lib.print('ERROR', '' + items[i].value +' not found in context');
        }

        inject_object[toReplace] = replaceBy;
    }

    lib.replace_variables(paths, inject_object);

    cb();

}


function clean(context, resourceName, subResourceName, params, cb) {
    lib.print('meta','cleaning config substitution');
    cb();
}

exports.adapter 			= adapter;
