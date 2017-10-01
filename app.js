var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mergeYaml = require('merge-yaml-cli');
var jsyaml = require('js-yaml');
var converter = require('oas-raml-converter');

var oas20ToRaml10 = new converter.Converter(converter.Formats.OAS20, converter.Formats.RAML);

let dir = __dirname + path.sep + "/yaml-files";

const mergeYamls = function(dir, filelist, yamlPathsPassed) {
  let files = fs.readdirSync(dir);
  let yamlPaths = yamlPathsPassed || {};
  filelist = filelist || [];
  _.forIn(files, function(file) {
    var absPath = path.join(dir, file);
    if(fs.statSync(absPath).isDirectory()) {
      mergeYamls(absPath, filelist, yamlPaths);
    } else {
      if(path.extname(file) === '.yml' || path.extname === '.yaml' && file !== __filename) {
        let yamlObj = jsyaml.safeLoad(fs.readFileSync(absPath, 'utf8'));
        var basePath = _.split(yamlObj['basePath'], '/')[1];
        var pathName = _.split(_.keys(yamlObj['paths'])[0], '/')[1];
        if(_.isUndefined(yamlPaths[basePath])) {
          yamlPaths[basePath] = {};
        }
        if(_.isUndefined(yamlPaths[basePath][pathName])) {
          yamlPaths[basePath][pathName] = [];
        }
        yamlPaths[basePath][pathName].push(absPath);
      }
    }
  });

  let basePaths = _.keys(yamlPaths);
  _.forIn(basePaths, function(basePath) {
    let pathNames = _.keys(yamlPaths[basePath]);
    _.forIn(pathNames, function(pathName) {

        const result = mergeYaml.merge(yamlPaths[basePath][pathName]);
        let swaggerDoc = jsyaml.safeLoad(result);
        let mergedFilePath = __dirname+path.sep+'mergedFiles'+path.sep+'yaml'+path.sep+'final-'+basePath+'-'+pathName+'.yaml';

        fs.writeFile(mergedFilePath, jsyaml.safeDump(swaggerDoc), function(err) {
          if(err) console.log(err);

          var yamlObj = jsyaml.safeLoad(fs.readFileSync(mergedFilePath, 'utf8'));
          var paths = _.keys(yamlObj.paths);
          _.forIn(paths, function(path) {
            yamlObj.paths[path].description = yamlObj.paths[path].get.description+'(added using code)';
          })

          oas20ToRaml10.convertFile(yamlObj, {}).then(function(raml) {
            fs.writeFile(__dirname+path.sep+'mergedFiles'+path.sep+'raml'+path.sep+'/final-'+basePath+'-'+pathName+'.raml', raml, function(err) {
              if(err) console.log(err);
            });
          }).catch(function(err) {
            console.error(err);
          });

        });

    });
  });
}

mergeYamls(dir);
