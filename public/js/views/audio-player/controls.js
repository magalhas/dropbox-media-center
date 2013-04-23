/**
 * @module views/audio-player/controls
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:views/audio-player/playlist~AudioPlayer_ControlsView
   * @extends module:app~App.View
   */
  var
    html = require("text!templates/audio-player/controls.html"),
    TrackModel = require("models/track");
  return App.View.extend(
  /** @lends module:views/audio-player/playlist~AudioPlayer_ControlsView.prototype */
  {
    /** @ignore */
    initialize: function () {
      return App.View.prototype.initialize.apply(this, arguments);
    },
    /**
     * Applies MediaElement.js to our audio tag.
     * @returns {this}
     */
    applyAudioPlayer: function () {
      return this;
    },
    /**
     * 
     */
    play: function (trackId) {
      window.open(this.collection.get(trackId).url());
      return this;
    },
    /**
     * Renders the view.
     * @returns {this}
     */
    render: function () {
      this.$el.html(_.template(html));
      return this;
    }
  });
});