/**
 * @module routers/tracks
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var
  _ = require("lodash"),
  express = require("express"),
  fs = require("fs-extra"),
  MusicMetadata = require("musicmetadata"),
  Q = require("q"),
  TrackModel = require("../models/track");
/**
 * @class module:routers/tracks~TracksRouter
 * @todo Documentation.
 */
function TracksRouter(app) {
  this.app = app;
  app.server.get(
    "/api/tracks",
    express.compress(),
    _.bind(this.routeGetTracks, this)
  );
  app.server.get(
    "/api/tracks/:id",
    _.bind(this.routeGetTrackById, this)
  );
  app.server.get(
    "/api/tracks/:id/audio",
    _.bind(this.routeGetTrackAudioById, this)
  );
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
        if (options.error) {
          options.error(err);
        } else {
          throw err;
        }
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
    trackId = req.param("id");
  // Get the track info from the database
  Q
    .ninvoke(TrackModel, "findById", trackId)
    .then(function (track) {
      res.send(track);
    })
    .fail(function (err) {
      res.status(500).send(err);
    });
};
/**
 * @route
 * @todo Documentation.
 */
TracksRouter.prototype.routeGetTrackAudioById = function (req, res) {
  var
    self = this,
    path,
    trackId = req.param("id");
  res.type("audio/mpeg");
  // Get the track info from the database
  Q
    .ninvoke(TrackModel, "findById", trackId)
    .then(function (track) {
      if (self.app.cache.exists(track.path, track.modifiedAt)) {
        path = self.app.cache.path(track.path, track.modifiedAt);
        res.sendfile(path);
      } else {
        self.getTrackFromDropbox(track, {
          success: function (buffer) {
            path = self.app.cache.store(track.path, track.modifiedAt, buffer);
            self
              .storeMetadata(path, track)
              .then(function () {
                res.sendfile(path);
              })
              .done();
          }
        });
      }
    })
    .fail(function (err) {
      self.app.error(err);
      res.status(500).send(err);
    })
    .done();
};
/**
 * @route
 * @todo Documentation.
 */
TracksRouter.prototype.routeGetTracks = function (req, res) {
  var self = this;
  Q
    .ninvoke(TrackModel, "find", {})
    .then(function (tracks) {
      res.send(tracks);
    })
    .fail(function (err) {
      res.status(500).send(err);
    })
    .done();
};
/**
 * @todo Documentation.
 */
TracksRouter.prototype.storeMetadata = function (path, track) {
  var
    id3 = {},
    musicMetadata = new MusicMetadata(fs.createReadStream(path));
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
  return Q
    .ninvoke(musicMetadata, "on", "done")
    .then(function () {
      return Q.ninvoke(TrackModel, "update", {_id: track._id}, id3, {upsert: true});
    });
};
exports = module.exports = TracksRouter;