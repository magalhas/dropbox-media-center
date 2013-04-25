/**
 * @module routers/tracks
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var
  _ = require("lodash"),
  fs = require("fs-extra"),
  MusicMetadata = require("musicmetadata"),
  TrackModel = require("../models/track");
/**
 * @class module:routers/tracks~TracksRouter
 * @todo Documentation.
 */
function TracksRouter(app) {
  this.app = app;
  app.server.get("/api/tracks", _.bind(this.routeGetTracks, this));
  app.server.get("/api/tracks/:id", _.bind(this.routeGetTrackById, this));
  app.server.get("/api/tracks/:id/audio", _.bind(this.routeGetTrackAudioById, this));
}
/**
 * @todo Documentation.
 */
TracksRouter.prototype.getTrackFromDropbox = function (track, options) {
  !options && (options = {});
  this.app.log("Getting track '%s' from Dropbox.", track.path);
  this.app.dropbox.readFile(
    track.path,
    {
      buffer: true,
      binary: true
    },
    function (err, buffer) {
      if (err) {
        options.error && options.error(err);
      } else {
        options.success && options.success(buffer);
      }
    }
  );
};
/**
 * @route
 * @todo Documentation.
 */
TracksRouter.prototype.routeGetTrackById = function (req, res) {
  var
    self = this,
    path,
    trackId = req.param("id");
  // Get the track info from the database
  this.app.log("Getting track %s.", trackId);
  TrackModel.findById(trackId, function (err, track) {
    if (err) {
      self.app.error("Error: %j", err);
      res.status(500).send(err);
    } else {
      res.type("audio/mpeg");
      // If the track is cached
      if (self.app.cache.exists(track.path, track.modifiedAt)) {
        // Send the track to the client
        self.app.log("Sending track '%s' to client.", track.path);
        path = self.app.cache.path(track.path, track.modifiedAt);
        res.sendfile(path);
      }
      // If the track is not cached
      else {
        self.getTrackFromDropbox(track, {
          error: function (err) {
            self.app.error("Error: %j", err);
            res.status(500).send(err);
          },
          success: function (buffer) {
            self.app.log("Caching and sending track to client.");
            path = self.app.cache.store(track.path, track.modifiedAt, buffer);
            self.storeMetadata(path, track, {
              error: function (err) {
                self.app.error("Error: %j", err);
                res.status(500).send(err);
              },
              success: function () {
                res.sendfile(path);
              }
            });
          }
        });
      }
    }
  });
};
/**
 * @route
 * @todo Documentation.
 */
TracksRouter.prototype.routeGetTrackAudioById = function (req, res) {
};
/**
 * @route
 * @todo Documentation.
 */
TracksRouter.prototype.routeGetTracks = function (req, res) {
  var self = this;
  TrackModel.find({}, function (err, tracks) {
    if (err) {
      self.app.error("There was an error getting tracks. Error: %j", err);
      res.status(500).send(err);
    } else {
      res.send(tracks);
    }
  });
};
/**
 * @todo Documentation.
 */
TracksRouter.prototype.storeMetadata = function (path, track, options) {
  var
    id3 = {},
    musicMetadata = new MusicMetadata(fs.createReadStream(path));
  !options && (options = {});
  musicMetadata.on("metadata", function (metadata) {
    id3.artist = metadata.artist;
    id3.album = metadata.album;
    id3.genre = metadata.genre;
    id3.trackNumber = metadata.track.no;
    id3.title = metadata.title;
    id3.year = metadata.year;
  });
  musicMetadata.on("TLEN", function (duration) {
    id3.duration = duration;
  });
  musicMetadata.on("done", function (err) {
    TrackModel.update({_id: track._id}, id3, {upsert: true}, function (err) {
      if (err) {
        options.error && options.error(err);
      } else {
        options.success && options.success();
      }
    });
  });
};
exports = module.exports = TracksRouter;