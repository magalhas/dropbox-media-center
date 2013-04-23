/**
 * @module lib/dropbox-watcher
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var _ = require("lodash");
/**
 * @class module:lib/dropbox-watcher~DropboxWatcher
 * @param {Dropbox.Client} dropboxClient
 * @param {Object} options
 * @todo Documentation.
 */
function DropboxWatcher(app, options) {
  this.options = _.defaults(options || {}, {
    interval: 100000,
    pattern: /.+/,
    folders: ["/"]
  });
  this.app = app;
  this.dropbox = app.dropbox;
}
/**
 * @event
 * @param {Function} callback The callback that should be called when this event
 * ends.
 * @todo Documentation.
 */
DropboxWatcher.prototype.afterWatch = function (callback) {
  callback();
};
/**
 * @event
 * @param {Function} callback The callback that should be called when this event
 * ends.
 * @todo Documentation.
 */
DropboxWatcher.prototype.beforeWatch = function (callback) {
  callback();
};
/**
 * @todo Documentation.
 */
DropboxWatcher.prototype.lock = function () {
  this.locked = true;
  this.parsedDirs = 0;
  this.dirsToParse = this.options.folders.length;
  return this;
};
/**
 * @abstract
 * @event
 * @todo Documentation.
 */
DropboxWatcher.prototype.onMatch = function () {
  throw new Error("This method must be implemented.");
};
/**
 * @todo Documentation.
 */
DropboxWatcher.prototype.run = function () {
  this.interval = setInterval(
    _.bind(this.beforeWatch, this, _.bind(this.watch, this)),
    this.options.interval
  );
  return this;
};
/**
 * @fires #onMatch
 * @fires #afterWatch
 * @todo Documentation.
 */
DropboxWatcher.prototype.scan = function (error, entries, metafolder, metaentries) {
  this.parsedDirs += 1;
  if (error) {
    throw new Error("Error scanning Dropbox folder.");
  }
  var i, length = metaentries.length;
  for (i = 0; i < length; i += 1) {
    if (metaentries[i].isFolder) {
      this.dirsToParse += 1;
      this.dropbox.readdir(metaentries[i].path, _.bind(this.scan, this));
    } else if (metaentries[i].name.match(this.options.pattern)) {
      this.onMatch(metaentries[i]);
    }
  }
  if (this.parsedDirs === this.dirsToParse) {
    this.afterWatch(_.bind(this.unlock, this));
  }
};
/**
 * @todo Documentation.
 */
DropboxWatcher.prototype.stop = function () {
  clearInterval(this.interval);
  return this;
};
/**
 * @todo Documentation.
 */
DropboxWatcher.prototype.unlock = function () {
  this.locked = false;
  this.parsedDirs = 0;
  this.dirsToParse = 0;
};
/**
 * @todo Documentation.
 */
DropboxWatcher.prototype.watch = function () {
  if (this.locked) {
    return;
  }
  var i, length = this.options.folders.length;
  this.lock();
  for (i = 0; i < length; i += 1) {
    this.dropbox.readdir(
      this.options.folders[i],
      _.bind(this.scan, this)
    );
  }
};
exports = module.exports = DropboxWatcher;