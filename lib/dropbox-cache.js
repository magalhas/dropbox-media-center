/**
 * @module lib/dropbox-cache
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var _ = require("lodash"),
  crypto = require("crypto"),
  fs = require("fs-extra");
/**
 * @class module:lib/dropbox-cache~DropboxCache
 * @param {Dropbox.Client} dropboxClient
 * @param {Object} options
 * @todo Documentation.
 */
function DropboxCache(options) {
  this.options = _.defaults(options || {}, {
    dir: "./cache"
  });
  fs.mkdirsSync(this.options.dir);
}
/**
 * @todo Documentation.
 */
DropboxCache.prototype.exists = function (objectId, modifiedAt) {
  if (fs.existsSync(this.path(objectId, modifiedAt))) {
    return true;
  }
  return false;
};
/**
 * @todo Documentation.
 */
DropboxCache.prototype.get = function (objectId, modifiedAt) {
  return fs.readFileSync(this.path(objectId, modifiedAt));
};
/**
 * @todo Documentation. 
 */
DropboxCache.prototype.path = function (objectId, modifiedAt) {
  return this.options.dir + "/" + this.sanitize(objectId, modifiedAt);
} 
/**
 * @todo Documentation.
 */
DropboxCache.prototype.sanitize = function (objectId, modifiedAt) {
  return crypto.createHash("md5").update(objectId + modifiedAt).digest("hex");
};
/**
 * @todo Documentation.
 */
DropboxCache.prototype.store = function (objectId, modifiedAt, content) {
  var path = this.path(objectId, modifiedAt);
  fs.writeFileSync(path, content);
  return path;
};
exports = module.exports = DropboxCache;