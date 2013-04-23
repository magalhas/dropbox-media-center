/**
 * @module views/audio-player/playlist
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:views/audio-player/playlist~AudioPlayer_PlaylistView
   * @extends module:app~App.View
   */
  var html = require("text!templates/audio-player/playlist.html");
  return App.View.extend(
  /** @lends module:views/audio-player/playlist~AudioPlayer_PlaylistView.prototype */
  {
    events: {
      "dblclick .track": "playTrack"
    },
    /** @ignore */
    initialize: function () {
      return App.View.prototype.initialize.apply(this, arguments);
    },
    /**
     * @event
     * @fires track:play
     */
    playTrack: function (event) {
      var
        $target = $(event.target).closest("tr"),
        trackId = $target.data("id");
      this.trigger("track:play", trackId);
      return this;
    },
    /**
     * Renders the view.
     * @returns {this}
     */
    render: function () {
      this.$el && this.$el.html(_.template(html, this));
      return this;
    }
  });
});