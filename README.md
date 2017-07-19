# Edge-Launchpad
![](images/edge-launchpad-wall-image.png)

A deployment tool for apigee solutions. Helps orchestrating the deployement of any solution comprising of apps, products, developer, proxy, baas data etc

### Developer guide
https://docs.google.com/a/apigee.com/document/d/1ptxyDnFRnH4tKGZb2C1QJ2-Qnp8izvxKCi7vZOJbrSQ/edit?usp=sharing

### Usage

Usage: gulp < deploy / build / clean > [options]

Options: 

    --resource <resource>                     Pick any resource defined in config file

    --subresource <subresource1,subresource2> Pick any subresources defined under respective resource in config file 

    --item <item1,item2>                      Pick any items defined in respective RESOURCE,SUBRESOURCE in config file

    --strict                                  Do not run dependent tasks. eg. deploy will not run clean and build if --strict flag is passed 

    --env test                                Choose which edge environment for deployment

    --config <path to config file>            Relative to execution directory


Additional parameters can be passed to deploy script to avoid prompt. see **eg2**

**eg1** : gulp deploy

**eg2** : gulp deploy --username gauthamvk@google.com --org bumblebee --env test --resource openbank_apis


## Sample config
![samples/configuration/config_one.yml](sample/configuration/config_one.yml)

## Release

### v1.0.0
- initial release
- basic functionality

### v1.0.1
- multiple items can be deployed
- multiple subresources can be deployed from command line

### v1.0.2
- new subResource localCommand added
- assignResponse subResource is genralized for app, product,proxy,cache, developer subresources

### v1.0.3
- fix dependency pull
- fix localCommand variable replace

### v1.0.4
- fix localCommand

### v1.0.7
- using multipart for proxy upload 
- copy util added 
- fix deploy phase variable replacement 
- app deploy made sync 
- using cross-spawn to run npm commands, to make windows compatible

-------------------

### This is not an official Google project
