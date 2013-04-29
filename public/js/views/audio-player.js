/**
 * @module views/audio-player
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:views/audio-player~AudioPlayerView
   * @extends module:app~App.View
   */
  var
    AudioPlayer_ControlsView = require("views/audio-player/controls"),
    AudioPlayer_PlaylistView = require("views/audio-player/playlist"),
    html = require("text!templates/audio-player.html"),
    TracksCollection = require("collections/tracks");
  return App.View.extend(
  /** @lends module:views/audio-player~AudioPlayerView.prototype */
  {
    tagName: "div",
    id: "audio-player",
    views: {},
    /** @ignore */
    initialize: function () {
      this.collection = new TracksCollection();
      // Subviews
      this.views.controls = new AudioPlayer_ControlsView({
        collection: this.collection
      });
      this.views.playlist = new AudioPlayer_PlaylistView({
        collection: this.collection
      });
      return App.View.prototype.initialize.apply(this, arguments);
    },
    /**
     * Renders the view.
     * @returns {this}
     */
    render: function () {
      this.$el
        .html(_.template(html))
        .append(this.views.playlist.$el)
        .append(this.views.controls.$el);
      this.views.controls.render();
      return App.View.prototype.render.apply(this, arguments);
    }
  });
});