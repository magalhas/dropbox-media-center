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
    tagName: "div",
    className: "wrapper playlists",
    events: {
      "click .playlist": "openPlaylist"
    },
    /** @ignore */
    initialize: function () {
      this.collection = new PlaylistsCollection();
      // Bindings
      this
        .listenTo(this.collection, "request", this.renderLoading)
        .listenTo(this.collection, "sync", this.render);
      this.collection.fetch();
      return App.View.prototype.initialize.apply(this, arguments);
    },
    /**
     * Applies jQueryUI.Droppable to each playlist entry.
     * @fires dom.event#drop .playlist
     * @returns {this}
     */
    applyDroppable: function () {
      this.$(".playlist.droppable").droppable({
        accept: ".track",
        activeClass: "droppable-active",
        hoverClass: "droppable-hover",
        drop: _.bind(this.drop, this)
      });
      return this;
    },
    /**
     * @listens dom.event#drop .playlist
     */
    drop: function (event, ui) {
      var
        playlistId = $(event.target).data("id"),
        playlist = this.collection.get(playlistId),
        trackId = $(ui.draggable).data("id");
      playlist.get("tracks").push(trackId);
      playlist.save({}, {bypass: true});
    },
    /**
     * @fires module:app~App#playlist:open
     */
    openPlaylist: function (event) {
      var
        $playlist = $(event.target),
        playlistId = $playlist.data("id"),
        playlist = this.collection.get(playlistId);
      $playlist.addClass("selected").siblings().removeClass("selected");
      /**
       * @event module:app~App#playlist:open
       * @param {module:models/playlist~PlaylistModel}
       */
      App.trigger("playlist:open", playlist);
    },
    /**
     * Renders the view.
     * @returns {this}
     */
    render: function () {
      this.$el.html(_.template(html, this));
      this.applyDroppable();
      return App.View.prototype.render.apply(this, arguments);
    }
  });
});