/**
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
define(function (require) {
  "use strict";
  /**
   * @class module:app~App.View
   * @extends external:Backbone.View
   */
  return Backbone.View.extend(
  /** @lends module:app~App.View.prototype */
  {
    /**
     * Renders loading animation.
     * @listens external:Backbone.Collection#request
     * @listens external:Backbone.Model#request
     * @returns {this}
     * @todo Documentation.
     */
    renderLoading: function (model, xhr, options) {
      options = _.defaults(options || {}, {
        bypass: false
      });
      if (!options.bypass) {
        this.$el[0].innerHTML = "Loading...";
      }
      return this;
    }
  });
});