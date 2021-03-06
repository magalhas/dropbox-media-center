/**
 * @module models/track
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:models/track~TrackModel
   * @extends module:app~App.Model
   */
  return App.Model.extend(
  /** @lends module:models/track~TrackModel.prototype */
  {
    defaults: {
      album: "",
      artist: "",
      duration: "",
      filename: "",
      genre: "",
      title: "",
      trackNumber: "",
      year: ""
    },
    /**
     * @todo Documentation.
     */
    audioUrl: function () {
      return this.url() + "/audio";
    },
    /**
     * @override
     */
    parse: function (response) {
      response.id = response._id;
      !response.title && (response.title = response.filename);
      return response;
    },
    /**
     * @returns {string}
     * @todo Documentation.
     */
    toString: function () {
      return this.get("artist") + " - " + this.get("title");
    }
  });
});