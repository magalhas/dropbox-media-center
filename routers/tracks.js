/**
 * @file routers/tracks.js
 * @module routers/tracks
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var TrackModel = require("../models/track");
/**
 * @class module:routers/tracks~TracksRouter
 * @todo Documentation.
 */
function TracksRouter(app) {
  app.server.get("/api/tracks", function (req, res) {
    TrackModel.find({}, function (err, tracks) {
      if (err) {
        app.error("There was an error getting tracks. Error: %j", err);
        res.status(500).send(err);
      } else {
        res.send(tracks);
      }
    });
  });
  app.server.get("/api/tracks/:id", function (req, res) {
    var path,
      trackId = req.param("id");
    // Get the track info from the database
    app.log("Getting track %s.", trackId);
    TrackModel.findById(trackId, function (err, track) {
      if (err) {
        app.error("Error: %j", err);
        res.status(500).send(err);
      } else {
        res.type("audio/mpeg");
        // If the track is cached
        if (app.cache.exists(track.path, track.modifiedAt)) {
          // Send the track to the client
          app.log("Sending track '%s' to client.", track.path);
          path = app.cache.path(track.path, track.modifiedAt);
          res.sendfile(path);
        }
        // If the track is not cached
        else {
          // Get it from Dropbox
          app.log("Getting track '%s' from Dropbox.", track.path);
          app.dropbox.readFile(
            track.path,
            {
              buffer: true,
              binary: true
            },
            function (err, buffer) {
              if (err) {
                app.error("Error: %f", err);
                res.status(500).send(err);
              } else {
                // Cache it and send it to the client
                app.log("Caching and sending track to client.");
                path = app.cache.store(track.path, track.modifiedAt, buffer);
                res.sendfile(path);
              }
            }
          );
        }
      }
    });
  });
}
exports = module.exports = TracksRouter;