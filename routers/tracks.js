/**
 * @file routers/tracks.js
 * @module routers/tracks
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var TrackModel = require("../models/track");
/**
 * @class TracksRouter
 * @todo Documentation.
 */
function TracksRouter(app) {
  app.server.get("/api/tracks", function (req, res) {
    
  });
}
exports = module.exports = TracksRouter;