/**
 * @file models/playlist.js
 * @module models/playlist
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT> and GPLv3 <http://www.gnu.org/licenses/gpl.txt>.
 */
var db = require("mongoose"),
  PlaylistModel,
  PlaylistSchema;
PlaylistSchema = new db.Schema({
  name: {
    type: String,
    required: true
  },
  tracks: [{
    type: db.Schema.Types.ObjectId,
    ref: "Track"
  }]
});
db.Playlist.ensureIndex(
  { name: 1 },
  { unique: true }
);
PlaylistModel = db.model("Playlist", PlaylistSchema);
exports = module.exports = PlaylistModel;
