/**
 * @module models/playlist
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
var db = require("mongoose"),
  PlaylistModel,
  PlaylistSchema;
PlaylistSchema = new db.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  tracks: [{
    type: db.Schema.Types.ObjectId,
    ref: "Track"
  }],
  user: {
    type: String,
    required: true,
    index: true
  }
});
PlaylistModel = db.model("Playlist", PlaylistSchema);
exports = module.exports = PlaylistModel;
