/**
 * @module collections/playlists
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:collections/playlists~PlaylistsCollection
   * @extends module:app~App.Collection
   */
  var PlaylistModel = require("models/playlist");
  return App.Collection.extend(
  /** @lends module:collections/playlists~PlaylistsCollection.prototype */
  {
    model: PlaylistModel,
    url: "api/playlists"
  });
});