/**
 * @module views/audio-player/controls
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:views/audio-player/controls~AudioPlayer_ControlsView
   * @extends module:app~App.View
   */
  var
    AudioPlayer_Controls_PlaylistsView = require("views/audio-player/controls/playlists"),
    html = require("text!templates/audio-player/controls.html");
  return App.View.extend(
  /** @lends module:views/audio-player/controls~AudioPlayer_ControlsView.prototype */
  {
    className: "controls",
    tagName: "div",
    events: {
      "click .trigger.previous-track": "previousTrack",
      "click .trigger.next-track": "nextTrack",
      "click .trigger.repeat": "toggleRepeat",
      "click .trigger.shuffle": "toggleShuffle"
    },
    views: {},
    /** @ignore */
    initialize: function () {
      // Subviews
      this.views.playlists = new AudioPlayer_Controls_PlaylistsView();
      // Bindings
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
     * @listens dom.event#click .trigger.next-track
     * @fires module:app~App#track:next
     */
    nextTrack: function (event) {
      /**
       * @event module:app~App#track:next
       * @param {module:models/track~TrackModel} Current track playing.
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
      this.listenToOnce(track, "sync", this.renderTrack);
    },
    /**
     * @listens $.jPlayer.event.loadedmetadata
     * @fires module:app~App#track:playing
     */
    playingTrack: function () {
      /**
       * @event module:app~App#track:playing
       * @param {module:models/track~TrackModel} Current track playing.
       */
      App.trigger("track:playing", this.track);
    },
    /**
     * @listens dom.event#click .trigger.next-track
     * @fires module:app~App#track:previous
     */
    previousTrack: function (event) {
      /**
       * @event module:app~App#track:previous
       * @param {module:models/track~TrackModel} Current track playing.
       */
      App.trigger("track:previous", this.track);
    },
    /**
     * Renders the view.
     * @returns {this}
     */
    render: function () {
      this.$el
        .html(_.template(html))
        .append(this.views.playlists.$el);
      this.applyJPlayer();
      return App.View.prototype.render.apply(this, arguments);
    },
    /**
     * @listens module:models/track~TrackModel#sync
     */
    renderTrack: function (track) {
      this.$(".current-track").html(track.toString());
    },
    /**
     * @listens dom.event#click .trigger.repeat
     * @fires module:app~App#media:repeat
     */
    toggleRepeat: function (event) {
      /**
       * @event module:app~App#media:repeat
       * @param {module:models/track~TrackModel} Current track playing.
       */
      App.trigger("media:repeat", this.track);
      $(event.target).toggleClass("active");
    },
    /**
     * @listens dom.event#click .trigger.shuffle
     * @fires module:app~App#media:shuffle
     */
    toggleShuffle: function (event) {
      /**
       * @event module:app~App#media:shuffle
       * @param {module:models/track~TrackModel} Current track playing.
       */
      App.trigger("media:shuffle", this.track);
      $(event.target).toggleClass("active");
    }
  });
});