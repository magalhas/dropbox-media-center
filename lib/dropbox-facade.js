/**
 * @module lib/dropbox-facace
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
/**
 * @namespace
 */
var dropboxFacade = {};
/**
 * @todo Documentation.
 */
dropboxFacade.getFile = function (app, track, callback) {
  app.dropbox.readFile(
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