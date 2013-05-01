/**
 * @module lib/dropbox-facace
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
var
  AudioWatcher = require("../watchers/audio"),
  Dropbox = require("dropbox"),
  DropboxCache = require("./dropbox-cache"),
  dropboxDriverNodeExpress = require("./dropbox-driver-node-express"),
  mediaFacade = require("../lib/media-facade"),
  Q = require("q"),
  TrackModel = require("../models/track"),
  UserModel = require("../models/user");
/**
 * @namespace
 */
var dropboxFacade = {};
/**
 * Connect middleware.
 * @todo Documentation.
 */
dropboxFacade.connect = function (req, res, next) {
  var
    app = this,
    options = this.options,
    username = req.user.username;
  if (!this.dropbox[username]) {
    Q
      .ninvoke(UserModel, "findOne", {username: username})
      // Check for user stored credentials and authenticate with Dropbox
      .then(function (user) {
        // Create Dropbox client
        var dropbox = app.dropbox[username] = new Dropbox.Client({
          key: options.dropbox.key,
          secret: options.dropbox.secret || null,
          token: user && user.token,
          tokenSecret: user && user.tokenSecret
        });
        // Set the authentication driver
        dropbox.authDriver(dropboxDriverNodeExpress(options.url, app.server));
        // Authenticate
        return Q.ninvoke(dropbox, "authenticate");
      })
      // Update UserModel with tokens from Dropbox authentication
      .then(function (dropbox) {
        app.log(username + " connected to Dropbox.");
        // Create and start watchers for the user
        app.watchers[username] = {
          audio: new AudioWatcher(app, req.user).run()
        };
        // Create cache for the user
        app.cache[username] = new DropboxCache({user: req.user});
        // Update database with user token and tokenSecret
        return Q.ninvoke(UserModel, "update", {username: username}, {
          token: dropbox.credentials().token,
          tokenSecret: dropbox.credentials().tokenSecret
        });
      })
      .done(function () {
        next();
      });
  } else {
    next();
  }
};
/**
 * @todo Documentation.
 */
dropboxFacade.getFile = function (app, user, track, callback) {
  app.dropbox[user.username].readFile(
    track.path,
    {
      buffer: true,
      binary: true
    },
    function (err, buffer) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, app.cache[user.username].store(track.path, track.modifiedAt, buffer));
      }
    }
  );
};
/**
 * @todo Documentation.
 */
dropboxFacade.getTrackAudioPath = function (app, user, track) {
  var path;
  if (app.cache[user.username].exists(track.path, track.modifiedAt)) {
    return app.cache[user.username].path(track.path, track.modifiedAt);
  } else {
    return Q
      .nfcall(dropboxFacade.getFile, app, user, track)
      .then(function (resolvedPath) {
        path = resolvedPath;
        return mediaFacade.getID3(resolvedPath);
      })
      .then(function (id3) {
        return Q.ninvoke(TrackModel, "update", {_id: track._id}, id3);
      })
      .then(function () {
        return path;
      });
  }
};
exports = module.exports = dropboxFacade;