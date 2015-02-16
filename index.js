var
  PACKAGE_NAME = require('./package.json').name,
  map = require('map-stream'),
  PluginError = require('gulp-util').PluginError,
  escape = require('html-escape'),
  path = require('path');

/**
 *
 * @param {!vinyl.File} file
 * @returns {object.<string, string>}
**/
function getFileNameDescription(file) {
  return {
    basename: path.basename(file.path, path.extname(file.path)),
    extension: path.extname(file.path).substr(1),
    path: path.dirname(file.path)
  };
}

/**
 *
 * @param {!vinyl.File} file
 * @param {!object.<string, string>} options
 * @param {!function(PluginError, Buffer)} callback
**/
function escapeFile(file, options, callback) {
  var
    content = '',
    prefix, suffix;
  if (!file) return callback(new PluginError(PACKAGE_NAME, 'No file given'), null);
  if (file.isStream()) return callback(new PluginError(PACKAGE_NAME, 'Streaming not supported'), null);
  // prepend unescaped html prefix
  if (typeof options.prefix === 'function') {
    prefix = options.prefix(getFileNameDescription(file));
    if (typeof prefix !== 'undefined' && prefix !== null) content += String(prefix);
  } else if (typeof options.prefix !== 'undefined' && options.prefix !== null) {
    content += String(options.prefix);
  }
  // add escaped html
  content += escape(file.contents);
  // append unescaped html suffix
  if (typeof options.suffix === 'function') {
    suffix = options.suffix(getFileNameDescription(file));
    if (typeof suffix !== 'undefined' && suffix !== null) content += String(suffix);
  } else if (typeof options.suffix !== 'undefined' && options.suffix !== null) {
    content += String(options.suffix);
  }
  callback(null, new Buffer(content));
}

module.exports = function (options) {
  options = options || {};
  return map(function (file, callback) {
    escapeFile(file, options, function (err, buffer) {
      if (err) return callback(err);
      file.contents = buffer;
      callback(null, file);
    });
  });
};