/**
 * @module routers/main
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:routers/main~MainRouter
   * @extends module:app~App.Router
   */
  var
    AudioPlayerView = require("views/audio-player"),
    BodyView = require("views/body");
  return App.Router.extend(
  /** @lends module:routers/main~MainRouter.prototype */
  {
    routes: {
      "": "bootstrap",
      "audio": "audio"
    },
    views: {},
    /** @ignore */
    initialize: function () {
      this.views.body = new BodyView({el: $("body")}).render();
      Backbone.history.start({pushState: false, root: App.Config.URL.ROOT});
      return App.Router.prototype.initialize.apply(this, arguments);
    },
    /**
     * @route
     */
    bootstrap: function () {
      this.navigate("audio", {trigger: true});
    },
    /**
     * @route
     */
    audio: function () {
      if (!this.views.audioPlayer) {
        this.views.audioPlayer = new AudioPlayerView();
      }
      this.views.body.setContent(this.views.audioPlayer);
      this.views.audioPlayer.render();
      this.views.audioPlayer.collection.fetch();
    }
  });
});