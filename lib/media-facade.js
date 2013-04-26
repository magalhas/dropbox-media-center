/**
 * @module lib/media-facade
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
var
  fs = require("fs-extra"),
  MusicMetadata = require("musicmetadata"),
  Q = require("q");
/**
 * @namespace
 */
var mediaFacade = {};
/**
 * @returns {Q.Promise} Promises ID3 object containing track metadata.
 * @todo Documentation.
 */
mediaFacade.getID3 = function (path) {
  var
    id3 = {},
    musicMetadata = new MusicMetadata(fs.createReadStream(path));
  musicMetadata.on("metadata", function (metadata) {
    id3.artist = metadata.artist;
    id3.album = metadata.album;
    id3.genre = metadata.genre;
    id3.trackNumber = metadata.track.no;
    id3.title = metadata.title;
    id3.year = metadata.year;
  });
  musicMetadata.on("TLEN", function (duration) {
    id3.duration = duration;
  });
  return Q
    .ninvoke(musicMetadata, "on", "done")
    .then(function () {
      return id3;
    });
};
exports = module.exports = mediaFacade;