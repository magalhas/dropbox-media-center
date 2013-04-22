/**
 * @module routers/main
 */
define(function (require) {
  "use strict";
  /**
   * @class module:routers/main~MainRouter
   * @extends module:app~App.Router
   */
  var View_Body = require("views/body");
  return App.Router.extend(
  /** @lends module:routers/main~MainRouter.prototype */
  {
    routes: {
      "": "bootstrap"
    },
    views: {},
    /** @ignore */
    initialize: function () {
      this.views.body = new View_Body({
        el: $("body")
      }).render();
      return App.Router.prototype.initialize.apply(this, arguments);
    },
    /**
     * @route
     */
    bootstrap: function () {
    }
  });
});