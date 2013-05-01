/**
 * @module lib/dropbox-media-center
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var
  _ = require("lodash"),
  db = require("mongoose"),
  DropboxCache = require("./dropbox-cache"),
  dropboxFacade = require("./dropbox-facade"),
  express = require("express"),
  passport = require("passport"),
  passportHTTP = require("passport-http"),
  PlaylistsRouter = require("../routers/playlists"),
  Q = require("q"),
  TracksRouter = require("../routers/tracks"),
  UserModel = require("../models/user");
/**
 * @class module:lib/dropbox-media-center~DropboxMediaCenter
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
  if (!this.options.dropbox.key) { throw new Error("Dropbox key is undefined."); }
  if (!this.options.url) { throw new Error("Application URL is undefined."); }
  this.db = db;
  this.dropbox = {};
  this.routers = {};
  this.watchers = {};
}
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
DropboxMediaCenter.prototype.createCache = function () {
  this.cache = new DropboxCache();
  return this;
};
/**
 * @todo Documentation.
 */
DropboxMediaCenter.prototype.createRouters = function () {
  this.routers.playlists = new PlaylistsRouter(this);
  this.routers.tracks = new TracksRouter(this);
  return this;
};
/**
 * @todo Documentation.
 */
DropboxMediaCenter.prototype.createServer = function () {
  // Passport strategy implementation
  passport.use(new passportHTTP.DigestStrategy({}, function (username, done) {
    Q
      .ninvoke(UserModel, "findOne", {username: username})
      .then(function (user) {
        if (!user || !user.password) {
          return done(null, false);
        }
        return done(null, user, user.password);
      })
      .fail(function (err) {
        return done(err);
      });
  }));
  // Start server instance
  this.server = express();
  // Body parser
  this.server.use(express.bodyParser());
  // Logging
  this.server.use("/api", express.logger());
  // Passport
  this.server.use(passport.initialize());
  this.server.use(passport.authenticate("digest", {session: false}));
  // Dropbox connect
  this.server.use(_.bind(dropboxFacade.connect, this));
  // Routes
  this.server.use(this.server.router);
  this.server.use(express.static(this.options.root));
  return this;
};
/**
 * @todo Documentation.
 */
DropboxMediaCenter.prototype.error = function () {
  !this.options.quiet && console.error.apply(console, arguments);
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
  this
    .startServer()
    .connectMongoDB()
    .createCache()
    .createRouters();
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