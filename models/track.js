/**
 * @module models/track
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
var
  db = require("mongoose"),
  TrackModel,
  TrackSchema;
TrackSchema = new db.Schema({
  album: {
    type: String,
    trim: true
  },
  artist: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    min: 0
  },
  genre: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  filename: {
    type: String,
    required: true,
    trim: true
  },
  modifiedAt: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now(),
    required: true,
    index: true
  },
  title: {
    type: String,
    trim: true
  },
  trackNumber: {
    type: Number,
    min: 0
  },
  year: {
    type: Number
  }
});
TrackModel = db.model("Track", TrackSchema);
exports = module.exports = TrackModel;