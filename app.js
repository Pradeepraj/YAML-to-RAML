var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mergeYaml = require('merge-yaml-cli');
var jsyaml = require('js-yaml');
var converter = require('oas-raml-converter');

var oas20ToRaml10 = new converter.Converter(converter.Formats.OAS20, converter.Formats.RAML);

let dir = __dirname + path.sep + "/yaml-files";

// const mergeYamls = function(dir, filelist, yamlPathsPassed) {
//   let files = fs.readdirSync(dir);
//   let yamlPaths = yamlPathsPassed || {};
//   filelist = filelist || [];
//   _.forIn(files, function(file) {
//     var absPath = path.join(dir, file);
//     if(fs.statSync(absPath).isDirectory()) {
//       mergeYamls(absPath, filelist, yamlPaths);
//     } else {
//       if(path.extname(file) === '.yml' || path.extname === '.yaml' && file !== __filename) {
//         let yamlObj = jsyaml.safeLoad(fs.readFileSync(absPath, 'utf8'));
//         var basePath = _.split(yamlObj['basePath'], '/')[1];
//         var pathName = _.split(_.keys(yamlObj['paths'])[0], '/')[1];
//         if(_.isUndefined(yamlPaths[basePath])) {
//           yamlPaths[basePath] = {};
//         }
//         if(_.isUndefined(yamlPaths[basePath][pathName])) {
//           yamlPaths[basePath][pathName] = [];
//         }
//         yamlPaths[basePath][pathName].push(absPath);
//       }
//     }
//   });
//
//   let basePaths = _.keys(yamlPaths);
//   _.forIn(basePaths, function(basePath) {
//     let pathNames = _.keys(yamlPaths[basePath]);
//     _.forIn(pathNames, function(pathName) {
//
//         const result = mergeYaml.merge(yamlPaths[basePath][pathName]);
//         console.log(result);
//         let swaggerDoc = jsyaml.safeLoad(result);
//         let mergedFilePath = __dirname+path.sep+'mergedFiles'+path.sep+'yaml'+path.sep+'final-'+basePath+'-'+pathName+'.yaml';
//
//         fs.writeFile(mergedFilePath, jsyaml.safeDump(swaggerDoc), function(err) {
//           if(err) console.log(err);
//           oas20ToRaml10.convertFile(__dirname+path.sep+'mergedFiles'+path.sep+'yaml'+path.sep+'final-'+basePath+'-'+pathName+'.yaml', {}).then(function(raml) {
//             fs.writeFile(__dirname+path.sep+'mergedFiles'+path.sep+'raml'+path.sep+'/final-'+basePath+'-'+pathName+'.raml', raml, function(err) {
//               if(err) console.log(err);
//             });
//           }).catch(function(err) {
//             console.error(err);
//           });
//         });
//
//     });
//   });
// }
//
// mergeYamls(dir);

let yamlObj = jsyaml.safeLoad(fs.readFileSync('./mergedFiles/yaml/test.yaml', 'utf8'));
console.log(yamlObj);
var paths = _.keys(yamlObj.paths);
_.forIn(paths, function(path) {
  console.log("path: ", yamlObj.paths[path]);
  yamlObj.paths[path].description = yamlObj.paths[path].get.description+'(added using code)';
})

console.log(yamlObj);

oas20ToRaml10.convertFile(yamlObj, {}).then(function(raml) {
  fs.writeFile('./mergedFiles/raml/test.raml', raml, function(err) {
    if(err) console.log(err);
  });
}).catch(function(err) {
  console.error(err);
});


// let files = fs.readdirSync(dir);
// var yamlPaths = [];
// _.forIn(files, function(file) {
//   if(fs.statSync(dir + path.sep + file).isDirectory()) {
//     console.log(file + " is a dir");
//   } else {
//     console.log(file + " is a file");
//     if(path.extname(file) === '.yml' || path.extname === '.yaml' && file !== __filename) {
//       yamlPaths.push(dir + path.sep + file);
//
//     }
//   }
//   console.log(yamlPaths);
//   if(!_.isEmpty(yamlPaths)) {
//     console.log("called!");
//     const result = mergeYaml.merge(yamlPaths);
//     let swaggerDoc = jsyaml.safeLoad(result);
//     let mergedFilePath = __dirname+path.sep+'final.yaml';
//     fs.writeFile(mergedFilePath, jsyaml.safeDump(swaggerDoc), function(err) {
//       console.log(mergedFilePath);
//       if(err) console.log(err);
//       // converter(__dirname+path.sep+'final.yaml', './raml');
//       oas20ToRaml10.convertFile(__dirname+path.sep+'final.yaml', {}).then(function(raml) {
//         fs.writeFile('./final.raml', raml, function(err) {
//           if(err) console.log(err);
//           console.log("Success");
//         });
//       }).catch(function(err) {
//         console.error(err);
//       });
//     });
//   }
// });

// Converter.convert({
//   from: 'swagger_2',
//   to: 'raml',
//   source: __dirname+path.sep+'final.yaml',
// })
// .then(function(converted) {
//   console.log(converted.stringify());
// });

// converter(__dirname+path.sep+'final.yaml', './raml');
// const validateOptions = {
//   validate: validate,
//   fsResolver: myFsResolver
// };
// oas20ToRaml10.convertFile('./final.yaml', {}).then(function(raml) {
//   fs.writeFile('./final.raml', raml, function(err) {
//     if(err) console.log(err);
//     console.log("Success");
//   });
// }).catch(function(err) {
//   console.error(err);
// });
