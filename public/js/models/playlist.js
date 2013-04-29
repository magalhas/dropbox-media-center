/**
 * @module models/playlist
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:models/playlist~PlaylistModel
   * @extends module:app~App.Model
   */
  return App.Model.extend(
  /** @lends module:models/playlist~PlaylistModel.prototype */
  {
    defaults: {
      name: "",
      tracks: []
    },
    /**
     * @override
     */
    parse: function (response) {
      response.id = response._id;
      return response;
    },
    /**
     * @todo Documentation.
     */
    toString: function () {
      return this.get("name");
    }
  });
});