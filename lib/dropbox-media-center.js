/**
 * @file lib/dropbox-media-center.js
 * @module lib/dropbox-media-center
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var _ = require("lodash"),
  AudioWatcher = require("../watchers/audio"),
  db = require("mongoose"),
  Dropbox = require("dropbox"),
  dropboxDriverNodeExpress = require("./dropbox-driver-node-express"),
  express = require("express"),
  TracksRouter = require("../routers/tracks");
/**
 * @class
 * @todo Documentation.
 */
function DropboxMediaCenter(options) {
  this.options = _.defaults(options || {}, {
    dropbox: {
      key: null,
      secret: null
    },
    foldersToWatch: {},
    mongodbURI: null,
    port: process.env.PORT || null,
    quiet: false,
    root: "./public",
    url: null
  });
  this.db = db;
  this.routers = {};
  this.watchers = {};
}
/**
 * @todo Documentation.
 */
DropboxMediaCenter.prototype.connectDropbox = function (callback) {
  var self = this;
  if (!this.options.dropbox.key) {
    throw new Error("Dropbox key is undefined.");
  }
  if (!this.options.url) {
    throw new Error("Application URL is undefined.");
  }
  this.dropbox = new Dropbox.Client({
    key: this.options.dropbox.key,
    secret: this.options.dropbox.secret || null
  });
  this
    .dropbox
    .authDriver(dropboxDriverNodeExpress(this.options.url, this.server));
  this
    .log("Waiting for request to authenticate with Dropbox...")
    .dropbox.authenticate(function (error, dropbox) {
      if (error) {
        throw new Error("There was a problem authenticating with "
          + "Dropbox.");
      }
      self.log("Connected to Dropbox.");
      callback();
    });
};
/**
 * @todo Documentation.
 */
DropboxMediaCenter.prototype.connectMongoDB = function () {
  if (!this.options.mongodbURI) {
    throw new Error("Mongo DB URI is undefined.");
  }
  db.connect(this.options.mongodbURI);
  return this.log("Connected to MongoDB.");
};
/**
 * @todo Documentation.
 */
DropboxMediaCenter.prototype.createRouters = function () {
  this.routers.tracks = new TracksRouter(this);
  return this;
};
/**
 * @todo Documentation.
 */
DropboxMediaCenter.prototype.createServer = function () {
  this.server = express();
  this.server.set("base", "api");
  this.server.use(this.server.router);
  this.server.use(express.static(this.options.root));
  return this;
};
/**
 * @todo Documentation.
 */
DropboxMediaCenter.prototype.createWatchers = function () {
  this.watchers.audio = new AudioWatcher(this).run();
  return this;
};
/**
 * @todo Documentation.
 */
DropboxMediaCenter.prototype.log = function () {
  !this.options.quiet && console.log.apply(console, arguments);
  return this;
};
/**
 * @todo Documentation.
 */
DropboxMediaCenter.prototype.run = function () {
  var self = this;
  this
    .connectMongoDB()
    .startServer()
    .connectDropbox(function () {
      self
        .createWatchers()
        .createRouters();
    });
  return this;
};
/**
 * @todo Documentation.
 */
DropboxMediaCenter.prototype.startServer = function () {
  !this.server && this.createServer();
  this.listener = this.server.listen(this.options.port);
  this.log("Application running on port %s.", this.listener.address().port);
  return this;
};
exports = module.exports = DropboxMediaCenter;