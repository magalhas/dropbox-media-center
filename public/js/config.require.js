/**
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
requirejs.config({
  paths: {
    "i18n": "libs/vendor/require-i18n-2.0.2",
    "backbone": "libs/vendor/backbone-1.0.0.min",
    "jquery": "libs/vendor/jquery-2.0.0.min",
    "jquery.dataTables": "libs/vendor/jquery.dataTables-1.9.4/jquery.dataTables.min",
    "jquery.grab": "libs/vendor/jquery.jplayer-2.3.0/jquery.grab",
    "jquery.jplayer": "libs/vendor/jquery.jplayer-2.3.0/jquery.jplayer.min",
    "jquery.jplayer.circle": "libs/vendor/jquery.jplayer-2.3.0/circle.player",
    "jquery.transform2d": "libs/vendor/jquery.jplayer-2.3.0/jquery.transform2d",
    "less": "libs/vendor/less-1.3.3.min",
    "lodash": "libs/vendor/lodash-1.1.1.min",
    "modernizr": "libs/vendor/modernizr-2.6.2",
    "templates": "../templates",
    "text": "libs/vendor/require-text-2.0.5"
  },
  shim: {
    "jquery": {
      exports: "$"
    },
    "jquery.dataTables": {
      deps: ["jquery"]
    },
    "jquery.grab": {
      deps: ["jquery", "jquery.transform2d"]
    },
    "jquery.jplayer": {
      deps: ["jquery"]
    },
    "jquery.jplayer.circle": {
      deps: ["jquery.grab", "jquery.jplayer", "jquery.transform2d", "modernizr"]
    },
    "jquery.transform2d": {
      deps: ["jquery"]
    },
    "less": {
      exports: "less"
    },
    "lodash": {
      exports: "_"
    },
    "backbone": {
      deps: ["jquery", "lodash"],
      exports: "Backbone"
    },
    "app": {
      exports: "App",
      deps: [
        "backbone",
        "less",
        "lodash",
        "jquery",
        "jquery.dataTables",
        "jquery.jplayer.circle",
        "modernizr"
      ]
    }
  },
  config: {
    i18n: {
      locale: "root"
    }
  }
});