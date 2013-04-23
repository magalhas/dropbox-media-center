/**
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
requirejs.config({
  baseUrl: "js"
});
require(["app", "jquery", "backbone", "less", "lodash"], function () {
  App.initialize();
});