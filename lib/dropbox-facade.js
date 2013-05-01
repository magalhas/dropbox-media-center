/**
 * @module lib/dropbox-facace
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
var
  AudioWatcher = require("../watchers/audio"),
  Dropbox = require("dropbox"),
  dropboxDriverNodeExpress = require("./dropbox-driver-node-express"),
  Q = require("q"),
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
        var dropbox = app.dropbox[username] = new Dropbox.Client({
          key: options.dropbox.key,
          secret: options.dropbox.secret || null,
          token: user && user.token,
          tokenSecret: user && user.tokenSecret
        });
        dropbox.authDriver(dropboxDriverNodeExpress(options.url, app.server));
        return Q.ninvoke(dropbox, "authenticate");
      })
      // Update UserModel with tokens from Dropbox authentication
      .then(function (dropbox) {
        app.log(username + " connected to Dropbox.");
        app.watchers[username] = {
          audio: new AudioWatcher(app, req.user).run()
        };
        return Q.ninvoke(UserModel, "update", {username: username},
          {
            token: dropbox.credentials().token,
            tokenSecret: dropbox.credentials().tokenSecret
          },
          {
            upsert: true
          }
        );
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
        callback(null, app.cache.store(track.path, track.modifiedAt, buffer));
      }
    }
  );
};
exports = module.exports = dropboxFacade;