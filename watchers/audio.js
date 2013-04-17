/**
 * @file watchers/audio.js
 * @module watchers/audio
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT> and GPLv3 <http://www.gnu.org/licenses/gpl.txt>.
 */
"use strict";
var DropboxWatcher = require("../lib/dropbox-watcher"),
  TrackModel = require("../models/track");
/**
 * @class
 * @extends DropboxWatcher
 * @param {App} app
 * @todo Documentation.
 */
function AudioWatcher(app) {
  DropboxWatcher.call(this, app.dropbox, {
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
  TrackModel.remove({timestamp: {$ne: this.timestamp}}, function (error) {
    callback();
    if (error) {
      throw new Error("There was an error removing tracks from the database.");
    }
  });
};
/**
 * @overrides
 * @todo Documentation.
 */
AudioWatcher.prototype.beforeWatch = function (callback) {
  this.timestamp = Date.now();
  callback();
};
/**
 * @overrides
 * @todo Documentation.
 */
AudioWatcher.prototype.onMatch = function (entry) {
  TrackModel.update(
      {path: entry.path},
      {
        filename: entry.name,
        path: entry.path,
        timestamp: this.timestamp
      },
      {upsert: true},
      function (error) {
        if (error) {
          throw new Error("There was an error saving a track to the database.");
        }
      }
    );
};
exports = module.exports = AudioWatcher;