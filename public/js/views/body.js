/**
 * @module views/body
 */
define(function (require) {
  "use strict";
  /**
   * @class module:views/body~BodyView
   * @extends module:app~App.View
   */
  var html = require("text!templates/body.html");
  return App.View.extend(
  /** @lends module:views/body~BodyView.prototype */
  {
    /** @ignore */
    initialize: function () {
      return App.View.prototype.initialize.apply(this, arguments);
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