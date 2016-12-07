/**
 * Created by Muthu on 28/11/16.
 */

var yaml = require('js-yaml');
var fs   = require('fs');

function context(config, env) {
    this.variables = {};
    this.env = env;

    //TODO:if object assign as it is; if text, load (find file type and load accordingly) and assign
    if (typeof config === 'string' || config instanceof String ) {
        //load config file

        var configObj = null;
        try {
            configObj = yaml.safeLoad(fs.readFileSync(config, 'utf8'));
        } catch(e) {

        }

        this.config = configObj;
    } else {
        this.config = config;
    }

    this.getVariable = function (variableName) {
        // variables[variableName] if not found return undefined
        if (!variablenName) return undefined;

        var vName = variableName.replace("$","").replace("\'","");

        if (variables[vName]) return undefined;
        else
            return variables[vName];
    }

    this.getConfig = function() {
        return config;
    }

    //setVariable; set the variable in the context

    this.setVariable = function(name, value) {
        variables[name] = value;
    }

    this.getConfig = function (resourceName, subResourceName) {
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
    }

    this.getEnvironment = function() {
        return env;
    }
}