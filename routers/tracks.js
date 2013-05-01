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
  var trackId = req.param("id");
  // Get the track info from the database
  Q
    .ninvoke(TrackModel, "findOne", {_id: trackId, user: req.user.username})
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
    app = this.app,
    trackId = req.param("id");
  res.type("audio/mpeg");
  // Get the track info from the database and then retrieve the track audio
  Q
    .ninvoke(TrackModel, "findOne", {_id: trackId, user: req.user.username})
    .then(function (track) {
      return dropboxFacade.getTrackAudioPath(app, req.user, track);
    })
    .then(function (path) {
      res.sendfile(path);
    })
    .fail(function (err) {
      app.error(err);
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
    .ninvoke(TrackModel, "find", {user: req.user.username})
    .then(function (tracks) {
      res.send(tracks);
    })
    .fail(function (err) {
      res.status(500).send(err);
    })
    .done();
};
exports = module.exports = TracksRouter;