requirejs.config({
  baseUrl: "js"
});
require(["app", "jquery", "backbone", "less", "lodash"], function () {
  App.initialize();
});