/**
 * @module views/audio-player/controls/playlists
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:views/audio-player/controls/playlists~AudioPlayer_Controls_PlaylistsView
   * @extends module:app~App.View
   */
  var
    html = require("text!templates/audio-player/controls/playlists.html"),
    PlaylistsCollection = require("collections/playlists");
  return App.View.extend(
  /** @lends module:views/audio-player/controls/playlists~AudioPlayer_Controls_PlaylistsView.prototype */
  {
    className: "wrapper playlists",
    tagName: "div",
    /** @ignore */
    initialize: function () {
      this.collection = new PlaylistsCollection();
      this
        .listenTo(this.collection, "request", this.renderLoading)
        .listenTo(this.collection, "sync", this.render);
      this.collection.fetch();
      return App.View.prototype.initialize.apply(this, arguments);
    },
    /**
     * Renders the view.
     * @returns {this}
     */
    render: function () {
      this.$el.html(_.template(html, this));
      return App.View.prototype.render.apply(this, arguments);
    }
  });
});