/**
 * @module routers/tracks
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var
  _ = require("lodash"),
  express = require("express"),
  Q = require("q"),
  PlaylistModel = require("../models/playlist");
/**
 * @class module:routers/tracks~TracksRouter
 * @todo Documentation.
 */
function PlaylistsRouter(app) {
  this.app = app;
  app.server.get(
    "/api/playlists",
    express.compress(),
    _.bind(this.routeGetPlaylists, this)
  );
  app.server.get(
    "/api/playlists/:id",
    express.compress(),
    _.bind(this.routeGetPlaylistById, this)
  );
  app.server.post(
    "/api/playlists",
    express.compress(),
    _.bind(this.routePostPlaylist, this)
  );
  app.server.put(
    "/api/playlists/:id",
    express.compress(),
    _.bind(this.routePutPlaylistById, this)
  );
}
/**
 * @todo Documentation.
 */
PlaylistsRouter.prototype.routeGetPlaylists = function (req, res) {
  Q
    .ninvoke(PlaylistModel, "find", {})
    .then(function (playlists) {
      res.send(playlists);
    })
    .fail(function (err) {
      res.status(500).send(err);
    })
    .done();
};
/**
 * @todo Documentation.
 */
PlaylistsRouter.prototype.routeGetPlaylistById = function (req, res) {
  var playlistId = req.param("id");
  Q
    .ninvoke(PlaylistModel, "findById", playlistId)
    .then(function (playlist) {
      res.send(playlist);
    })
    .fail(function (err) {
      res.status(500).send(err);
    })
    .done();
};
/**
 * @todo Documentation.
 */
PlaylistsRouter.prototype.routePostPlaylist = function (req, res) {
  var
    name = req.param("name"),
    tracks = req.param("tracks");
  Q
    .ninvoke(PlaylistModel, "create", {name: name, tracks: tracks})
    .then(function (playlist) {
      res.send(playlist);
    })
    .fail(function (err) {
      res.status(500).send(err);
    })
    .done();
};
/**
 * @todo Documentation.
 */
PlaylistsRouter.prototype.routePutPlaylistById = function (req, res) {
  var
    playlistId = req.param("id"),
    name = req.param("name", ""),
    tracks = req.param("tracks", []),
    data = {};
  name && (data.name = name);
  tracks && (data.tracks = tracks);
  Q
    .ninvoke(PlaylistModel, "findByIdAndUpdate", playlistId, data)
    .then(function (playlist) {
      res.send(playlist);
    })
    .fail(function (err) {
      res.status(500).send(err);
    })
    .done();
};
exports = module.exports = PlaylistsRouter;