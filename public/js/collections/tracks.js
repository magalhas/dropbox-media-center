/**
 * @module collections/tracks
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:collections/tracks~TracksCollection
   * @extends module:app~App.Collection
   */
  var TrackModel = require("models/track");
  return App.Collection.extend(
  /** @lends module:collections/tracks~TracksCollection.prototype */
  {
    model: TrackModel,
    url: "api/tracks"
  });
});