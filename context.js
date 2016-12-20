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
        if (!variablenName) return undefined;

        var vName = variableName.replace("$","").replace("\'","");

        if (variables[vName]) return undefined;
        else
            return variables[vName];
    }

    //setVariable; set the variable in the context

    this.setVariable = function(name, value) {
        variables[name]             = value;
    }

    this.getConfig = function (resourceName, subResourceName) {
        var config = this.config['resources'];

        if (subResourceName) {
            for(var i=0; i<config.length; i++){
                if(config[i].name == resourceName) {
                    for(var j=0; j<config[i].subResources.length; j++){
                        if(config[i].subResources[j].name == subResourceName) {
                            return config[i].subResources[j];
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
        return env;
    }
    
    this.getDeploymentInfo = function () {
        var deploy_info                 = {};
        // TODO get from prompt variables
        /*
        var edgeOrg                     = this.config.resources.properties.edgeOrg;

        deploy_info.org                 = edgeOrg.org;
        deploy_info.token               = edgeOrg.token;
        deploy_info.username            = edgeOrg.username;
        deploy_info.password            = edgeOrg.password;
        deploy_info.env                 = this.getEnvironment();
        */

        return deploy_info;
    }
}

exports.getContext = getContext;


/*


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
    this.variables = {};
    this.env = env;
    this.config = {};

    //TODO:if object assign as it is; if text, load (find file type and load accordingly) and assign
    if (typeof config === 'string' || config instanceof String) {
        var configObj = null;

        try {
            var current_dir = process.cwd();
            var config_file_path = path.join(current_dir, config)
            configObj = yaml.safeLoad(fs.readFileSync(config_file_path, 'utf8'));
        } catch (e) {
            console.log('ERROR reading config file');
        }

        this.config = configObj;

    } else {
        this.config = config;
    }
}

context.prototype = {
    getVariable: function (variableName) {
        // variables[variableName] if not found return undefined
        if (!variablenName) return undefined;

        var vName = variableName.replace("$","").replace("\'","");

        if (variables[vName]) return undefined;
        else
            return variables[vName];
    },

    getConfig: function() {
        return this.config;
    },

    //setVariable; set the variable in the context

    setVariable: function(name, value) {
        variables[name] = value;
    },

    getConfig: function (resourceName, subResourceName) {
        if (resourceName) {
            var resource = this.config[resourceName];
            if (resource) {

                var resourceType = resource.type;
                if (subResourceName) {
                    var subResource = resource.subResources[subResourceName];
                    if (subResource) {
                        subResource.resourceName = resourceName;
                        subResource.resourceType = resourceType;
                        return subResource;
                    }else {
                        return null;
                    }
                } else {
                    return resource;
                }
            } else {
                return null;
            }
        } else {
            return undefined;
        }
    },

    getEnvironment: function() {
        return env;
    }
}

exports.getContext = getContext;
 */