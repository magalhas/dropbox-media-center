/**
 * @module routers/tracks
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var
  _ = require("lodash"),
  dropboxFacade = require("../lib/dropbox-facade"),
  express = require("express"),
  mediaFacade = require("../lib/media-facade"),
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
    express.compress(),
    _.bind(this.routeGetTrackById, this)
  );
  app.server.get(
    "/api/tracks/:id/audio",
    _.bind(this.routeGetTrackAudioById, this)
  );
}
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
        return Q.nfcall(dropboxFacade.getFile, self.app, track)
          .then(function (resolvedPath) {
            path = resolvedPath;
          })
          .then(function () {
            return mediaFacade.getID3(path);
          })
          .then(function (id3) {
            return Q.ninvoke(
              TrackModel,
              "update",
              {_id: track._id},
              id3,
              {upsert: true}
            );
          })
          .then(function () {
            res.sendfile(path);
          })
          .done();
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
exports = module.exports = TracksRouter;