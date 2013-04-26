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
      this.listenTo(App, "track:play", this.playTrack);
      return App.View.prototype.initialize.apply(this, arguments);
    },
    /**
     * Applies $.jPlayer to the #jplayer element.
     * @returns {this}
     */
    applyJPlayer: function () {
      this.player = new CirclePlayer("#jplayer", {}, {
        cssSelectorAncestor: "#circleplayer",
        supplied: "mp3, m4a, oga",
        wmode: "window",
        keyEnabled: true
      });
      this.$("#jplayer")
        .on($.jPlayer.event.ended, _.bind(this.nextTrack, this))
        .on($.jPlayer.event.loadedmetadata, _.bind(this.playingTrack, this));
      return this;
    },
    /**
     * @listens $.jPlayer.event.ended
     * @fires module:app~App#track:next
     */
    nextTrack: function (event) {
      /**
       * @event module:app~App#track:next
       * @param {module:models/track~TrackModel}
       */
      App.trigger("track:next", this.track);
    },
    /**
     * @listens module:app~App#track:play
     * @todo Documentation.
     */
    playTrack: function (track) {
      this.track = track;
      this.player.setMedia({mp3: track.audioUrl()});
      this.player.play();
    },
    /**
     * @listens $.jPlayer.event.loadedmetadata
     * @fires module:app~App#track:playing
     */
    playingTrack: function () {
      /**
       * @event module:app~App#track:playing
       * @param {module:models/track~TrackModel}
       */
      App.trigger("track:playing", this.track);
    },
    /**
     * Renders the view.
     * @returns {this}
     */
    render: function () {
      this.$el.html(_.template(html));
      return this.applyJPlayer();
    }
  });
});