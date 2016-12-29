/**
 * Created by Muthu on 28/11/16.
 */

var yaml                            = require('js-yaml');
var fs                              = require('fs');
var path                            = require('path');

var instance;

function getContext(config, env) {

    if (!instance) {
        instance                    = new context(config, env);
    }
    return instance;
}


function context(config, env) {
    this.variables                  = {};
    this.env                        = env;
    this.config                     = {};

    //TODO:if object assign as it is; if text, load (find file type and load accordingly) and assign
    if (typeof config === 'string' || config instanceof String ) {
        var configObj               = null;

        try {
            var current_dir         = process.cwd();
            var config_file_path    = path.join(current_dir, config)
            configObj = yaml.safeLoad(fs.readFileSync(config_file_path, 'utf8'));
        } catch(e) {
            console.log('ERROR reading config file');
        }

        this.config                 = configObj;

    } else {
        this.config                 = config;
    }

    this.getVariable = function (variableName) {
        // variables[variableName] if not found return undefined
        if (!variableName) return undefined;
        var vName = variableName.replace("$","").replace("\'","");

        return this.variables[vName];
    }

    this.getAllVariables = function(){
        return this.variables
    }

    this.setVariable = function(name, value) {
        this.variables[name]             = value;
    }

    this.cleanVariables = function(name, value) {
        this.variables                   = {}
    }

    this.getConfig = function (resourceName, subResourceName) {
        var config = this.config['resources'];

        if (subResourceName) {
            for(var i=0; i<config.length; i++){
                if(config[i].name == resourceName) {
                    for(var j=0; j<config[i].properties.subResources.length; j++){
                        if(config[i].properties.subResources[j].name == subResourceName) {
                            return config[i].properties.subResources[j];
                        }
                    }
                }
            }
        } else if (resourceName) {
            for(var i=0; i<config.length; i++){
                if(config[i].name == resourceName) {
                    return config[i];
                }
            }
        } else {
            return config;
        }
    }

    this.getEnvironment = function() {
        return this.env;
    }

    this.getDeploymentInfo = function () {
        var deploy_info                 = {};
        // TODO get from prompt variables

        //var edgeOrg                     = this.config.resources.properties.edgeOrg;

        deploy_info.organization         = this.getVariable('org');
        //deploy_info.token               = this.getVariable('token');
        deploy_info.username            = this.getVariable('username');
        deploy_info.password            = this.getVariable('password');
        deploy_info.environments        = this.getVariable('env').split(',');

        return deploy_info;
    }

    this.getBasePath = function (resourceName) {
        return this.getConfig(resourceName).properties.basePath
    }
}

exports.getContext = getContext;
