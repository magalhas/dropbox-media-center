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
  var
    html = require("text!templates/audio-player/playlist.html"),
    trackHtml = require("text!templates/audio-player/playlist/track.html");
  return App.View.extend(
  /** @lends module:views/audio-player/playlist~AudioPlayer_PlaylistView.prototype */
  {
    shuffledTracks: [],
    trackHtml: trackHtml,
    events: {
      "dblclick .track": "playTrack"
    },
    /** @ignore */
    initialize: function (options) {
      options = _.defaults(options || {}, {
        repeat: false,
        shuffle: false
      });
      this
        .listenTo(this.collection, "sync", this.render)
        .listenTo(this.collection, "request", this.renderLoading)
        .listenTo(App, "track:previous", this.playPreviousTrack)
        .listenTo(App, "track:next", this.playNextTrack)
        .listenTo(App, "track:playing", this.renderTrack)
        .listenTo(App, "media:shuffle", this.toggleShuffle);
      return App.View.prototype.initialize.apply(this, arguments);
    },
    /**
     * Applies jQuery.DataTables to the table element.
     * @returns {this}
     */
    applyDataTables: function () {
      this.playlist = this.$("table").dataTable({
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
        self = this,
        $next,
        $tracks,
        nextTrack,
        nextTrackId;
      if (!this.options.shuffle) {
        $next = this.$('[data-id="' + track.get("id") + '"]').next();
        if (!$next.length) {
          $next = this.$("[data-id]").first();
        }
        nextTrackId = $next.data("id");
      } else {
        $tracks = this.$("[data-id]").filter(function () {
          if (self.shuffledTracks.indexOf($(this).data("id")) !== -1) {
            return false;
          }
          return true;
        });
        $next = $tracks.eq(Math.floor(Math.random() * ($tracks.length + 1)));
        nextTrackId = $next.data("id");
        this.shuffledTracks.push(nextTrackId);
      }
      nextTrack = this.collection.get(nextTrackId);
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
        previousTrack,
        previousTrackId;
      if (!this.options.shuffle) {
        $previous = this.$('[data-id="' + track.get("id") + '"]').prev();
        if (!$previous.length) {
          $previous = this.$("[data-id]").last();
        }
        previousTrack = this.collection.get($previous.data("id"));
      } else {
        if (this.shuffledTracks.length > 1) {
          previousTrackId = this.shuffledTracks[this.shuffledTracks.length - 2];
        } else {
          return this.playNextTrack(track);
        }
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
     * @listens dom.event#dblclick .track
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
     * @listens external:Backbone.Collection#sync
     * @returns {this}
     */
    render: function (collection, response, options) {
      if (!options.bypass) {
        this.$el.html(_.template(html, this));
        this.applyDataTables();
      }
    },
    /**
     * @listens module:app~App#track:playing
     */
    renderTrack: function (track) {
      var self = this;
      track.fetch({
        bypass: true,
        success: function () {
          var
            $track = self.$('[data-id="' + track.get("id") + '"]'),
            $trackColumns = $track.find("td"),
            $updatedTrack = $(_.template(self.trackHtml, track)),
            data = [];
          $updatedTrack
            .attr("class", $track.attr("class"))
            .find("td")
              .each(function (index) {
                data.push($(this).text());
                $(this).attr("class", $trackColumns.eq(index).attr("class"));
              });
          $track.replaceWith($updatedTrack);
          self.playlist.fnUpdate(data, $track[0], undefined, false);
        }
      });
    },
    /**
     * @listens module:app~App#media:shuffle
     * @fires module:app~App#media:shuffle:on
     * @fires module:app~App#media:shuffle:off
     * @param {module:models/track~TrackModel} Current playing track.
     */
    toggleShuffle: function (track) {
      this.shuffledTracks = [];
      this.options.shuffle = !this.options.shuffle;
      if (this.options.shuffle) {
        track && this.shuffledTracks.push(track.get("id"));
        App.trigger("media:shuffle:on");
      } else {
        App.trigger("media:shuffle:off");
      }
    }
  });
});