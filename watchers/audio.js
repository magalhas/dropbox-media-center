/**
 * @module watchers/audio
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var DropboxWatcher = require("../lib/dropbox-watcher"),
  TrackModel = require("../models/track");
/**
 * @class module:watchers/audio~AudioWatcher
 * @extends DropboxWatcher
 * @param {App} app
 * @todo Documentation.
 */
function AudioWatcher(app) {
  DropboxWatcher.call(this, app, {
    interval: app.options.watchers.interval,
    pattern: /^.+\.mp3$/,
    folders: app.options.watchers.folders.audio
  });
}
AudioWatcher.prototype = Object.create(DropboxWatcher.prototype);
/**
 * @overrides
 * @todo Documentation.
 */
AudioWatcher.prototype.afterWatch = function (callback) {
  var self = this;
  this.app.log("Removing tracks from the database...");
  TrackModel.remove({timestamp: {$ne: this.timestamp}}, function (err) {
    callback();
    if (err) {
      self.app.error("Error: %j", err);
      throw new Error("There was an error removing tracks from the database.");
    } else {
      self.app
        .log("Tracks removed from the database.")
        .log("Watch on audio tracks finished.");
    }
  });
};
/**
 * @overrides
 * @todo Documentation.
 */
AudioWatcher.prototype.beforeWatch = function (callback) {
  this.app.log("Starting watch on audio tracks...");
  this.timestamp = Date.now();
  callback();
};
/**
 * @overrides
 * @todo Documentation.
 */
AudioWatcher.prototype.onMatch = function (entry) {
  var self = this;
  TrackModel.update(
      {path: entry.path},
      {
        filename: entry.name,
        modifiedAt: entry.modifiedAt,
        path: entry.path,
        timestamp: this.timestamp
      },
      {upsert: true},
      function (err) {
        if (err) {
          self.app.error("Error: %j", err);
          throw new Error("There was an error saving a track to the database.");
        }
      }
    );
};
exports = module.exports = AudioWatcher;