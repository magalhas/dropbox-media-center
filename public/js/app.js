/**
 * @module app
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
var App = {};
define(["require", "i18n!nls/lang", "collection", "config", "model", "router", "view"],
    function (require, i18n, Collection, Config, Model, Router, View) {
  "use strict";
  /** @namespace module:app~App */
  _.extend(App, Backbone.Events);
  App.Collection = Collection;
  App.Config = Config;
  App.Model = Model;
  App.Router = Router;
  App.View = View;
  /**
   * Tries to automatically detect the URL of the application and store it in
   * App.Config.URL.ROOT.
   * @memberof module:app~App
   * @private
   * @returns {module:app~App}
   */
  var detectUrls = function () {
    var path = window.location.pathname.split('/'),
      apiUrl,
      rootUrl;
    
    // If URL object is undefined
    !App.Config.URL && (App.Config.URL = {});
    
    if (!App.Config.URL.Root) {
      // Automatic detect the URL
      _.each(path, function (pathEntry, index) {
        if (index < path.length - 1) {
          rootUrl += pathEntry + '/';
        }
      });
      App.Config.URL.ROOT = rootUrl;
    }
    return App;
  };
  /**
   * Starts the application.
   * @returns {module:app~App}
   */
  App.initialize = function () {
    var self = this;
    detectUrls();
    require(["routers/main"], function (MainRouter) {
      // Instance the main router
      self.router = new MainRouter();
      // Start the application
      Backbone.history.start({pushState: false, root: App.Config.URL.ROOT});
    });
    return App;
  };
  /**
   * Translates a string.
   * @param {String} key The key to be translated.
   * @returns {String} The translated key or the key itself if no translation found.
   */
  App.i18n = function (key) {
    return i18n[key] || key;
  };
  /**
   * Parses a string such as "example/{1}/{2}", replacing {1} and {2}, etc, by the
   * variable arguments passed into the method.
   * @param {String} string The string to be parsed.
   * @param {...String} [arguments] to replace in the original string.
   * @returns {String} The parsed string.
   */
  App.parseString = function (string) {
    var i, length = arguments.length;
    for (i = 1; i < length; i += 1) {
      string = string.replace('{' + i + '}', arguments[i]);
    }
    return string;
  };
  return App;
});