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
    className: "playlist",
    tagName: "div",
    playedTracks: [],
    previousTracks: [],
    shuffledTracksIds: [],
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
        .listenTo(App, "track:play", this.logTrack)
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
     * @listens module:app~App#track:playing
     */
    logTrack: function (track) {
      this.playedTracks.push(track);
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
          if (self.shuffledTracksIds.indexOf($(this).data("id")) !== -1) {
            return false;
          }
          return true;
        });
        $next = $tracks.eq(Math.floor(Math.random() * ($tracks.length + 1)));
        nextTrackId = $next.data("id");
        this.shuffledTracksIds.push(nextTrackId);
      }
      nextTrack = this.collection.get(nextTrackId);
      if (nextTrack && nextTrack !== track || this.options.repeat) {
        /**
         * @event module:app~App#track:play
         * @param {module:models/track~TrackModel}
         */
        this.previousTracks = _.clone(this.playedTracks);
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
      if (!this.previousTracks.length) {
        $previous = this.$('[data-id="' + track.get("id") + '"]').prev();
        if (!$previous.length) {
          $previous = this.$("[data-id]").last();
        }
        previousTrackId = $previous.data("id");
        previousTrack = this.collection.get(previousTrackId);
      } else {
        previousTrack = this.previousTracks.pop();
      }
      if (previousTrack && (previousTrack !== track || this.options.repeat)) {
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
      this.previousTracks = _.clone(this.playedTracks);
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
      return App.View.prototype.render.apply(this, arguments);
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
            $updatedTrack = $(_.template(self.trackHtml, track.attributes)),
            data = [];
          $updatedTrack
            .attr("class", $track.attr("class"))
            .find("td")
              .each(function (index) {
                data.push($(this).text());
                $(this).attr("class", $trackColumns.eq(index).attr("class"));
              });
          // FIXME When updating an already updated row an exception was being thrown
          try {
            self.playlist.fnUpdate(data, $track[0], undefined, false);
          } catch (ex) {}
          $track.replaceWith($updatedTrack);
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
      this.shuffledTracksIds = [];
      this.options.shuffle = !this.options.shuffle;
      if (this.options.shuffle) {
        track && this.shuffledTracksIds.push(track.get("id"));
        /**
         * @event module:app~App#media:shuffle:on
         */
        App.trigger("media:shuffle:on");
      } else {
        /**
         * @event module:app~App#media:shuffle:off
         */
        App.trigger("media:shuffle:off");
      }
    }
  });
});