var PACKAGE_NAME = 'gulp-html-escape';
var map = require('map-stream');
var PluginError = require('gulp-util').PluginError;
var escape = require('html-escape');

function getId(file, options) {
  'use strict';
  var
    matcher = /\/?(.*\/)+(.*)(\..*)/.exec(file.path),
    filename = matcher[2],
    extension = matcher[3],
    path = matcher[1]
      .split(options.templateFolderName + '/')[1]
      .replace(new RegExp('/?' + filename + extension), '')
      .split('/').join('-');
  return path + filename;
}

function compile(file, options, callback) {
  'use strict';
  var content = '';
  if (!file) return callback(new PluginError(PACKAGE_NAME, 'No file given'));
  // prepend unescaped html
  if (typeof options.prefix === 'string') {
    content += options.prefix.replace('{id}', getId(file, options));
  }
  // add escaped html
  content += escape(file.contents.toString());
  // append unescaped html
  if (typeof options.suffix === 'string') {
    content += options.suffix;
  }
  callback(null, content);
}

module.exports = function (options) {
  'use strict';
  options = options || {};
  if (!options.templateFolderName) options.templateFolderName = 'templates';
  return map(function (file, callback) {
    compile(file, options, function (err, data) {
      if (err) return callback(err);
      file.contents = new Buffer(data);
      callback(null, file);
    });
  });
};