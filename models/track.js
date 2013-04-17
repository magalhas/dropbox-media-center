/**
 * @file models/track.js
 * @module models/track
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT> and GPLv3 <http://www.gnu.org/licenses/gpl.txt>.
 */
var db = require("mongoose"),
  TrackModel,
  TrackSchema;
TrackSchema = new db.Schema({
  artist: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    min: 0
  },
  location: {
    type: String,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  filename: {
    type: String,
    required: true,
    trim: true
  },
  path: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true
  },
  timestamp: {
    type: Number,
    required: true,
    index: true
  }
});
TrackModel = db.model("Track", TrackSchema);
exports = module.exports = TrackModel;