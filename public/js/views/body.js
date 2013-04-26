/**
 * @module views/body
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:views/body~BodyView
   * @extends module:app~App.View
   */
  var
    AudioPlayerView = require("views/audio-player"),
    html = require("text!templates/body.html");
  return App.View.extend(
  /** @lends module:views/body~BodyView.prototype */
  {
    views: {},
    /** @ignore */
    initialize: function () {
      this.views.audioPlayer = new AudioPlayerView();
      return App.View.prototype.initialize.apply(this, arguments);
    },
    /**
     * Renders the view.
     * @returns {this}
     */
    render: function () {
      this.$el.html(_.template(html));
      this.views.audioPlayer.setElement(this.$("#audio-player")).render();
      return this;
    }
  });
});