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
    initialize: function (options) {
      options = _.defaults(options || {}, {
        repeat: false,
        shuffle: false
      });
      this.listenTo(App, "track:next", this.playNextTrack);
      return App.View.prototype.initialize.apply(this, arguments);
    },
    /**
     * Applies jQuery.DataTables to the table element.
     * @returns {this}
     */
    applyDataTables: function () {
      this.$("table").dataTable({
        "aaSorting": [[1, "asc"], [4, "asc"], [3, "asc"], [0, "asc"]],
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bSort": true,
        "bInfo": false,
        "bAutoWidth": false
      });
      return this;
    },
    /**
     * @listens module:app~App#track:next
     * @fires module:app~App#track:play
     */
    playNextTrack: function (track) {
      var
        $next,
        nextTrack;
      if (!this.options.shuffle) {
        $next = this.$('[data-id="' + track.get("id") + '"]').next();
        if (!$next.length) {
          $next = this.$("[data-id]").first();
        }
        nextTrack = this.collection.get($next.data("id"));
      }
      if (nextTrack !== track || this.options.repeat) {
        /**
         * @event module:app~App#track:play
         * @param {module:models/track~TrackModel}
         */
        App.trigger("track:play", nextTrack);
      }
    },
    /**
     * @listens module:app~App#track:previous
     * @fires module:app~App#track:play
     */
    playPreviousTrack: function (track) {
      var
        $previous,
        previousTrack;
      if (!this.options.shuffle) {
        $previous = this.$('[data-id="' + track.get("id") + '"]').prev();
        if (!$previous.length) {
          $previous = this.$("[data-id]").last();
        }
        previousTrack = this.collection.get($previous.data("id"));
      }
      if (previousTrack !== track || this.options.repeat) {
        /**
         * @event module:app~App#track:play
         * @param {module:models/track~TrackModel}
         */
        App.trigger("track:play", previousTrack);
      }
    },
    /**
     * @fires module:app~App#track:play
     */
    playTrack: function (event) {
      var
        $target = $(event.target).closest("tr"),
        trackId = $target.data("id"),      
        track = this.collection.get(trackId);
      /**
       * @event module:app~App#track:play
       * @param {module:models/track~TrackModel}
       */
      App.trigger("track:play", track);
    },
    /**
     * Renders the view.
     * @returns {this}
     */
    render: function () {
      this.$el.html(_.template(html, this));
      return this.applyDataTables();
    }
  });
});