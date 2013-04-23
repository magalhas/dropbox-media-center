/**
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
requirejs.config({
  paths: {
    "i18n": "libs/vendor/require-i18n-2.0.2",
    "backbone": "libs/vendor/backbone-1.0.0.min",
    "jquery": "libs/vendor/jquery-1.9.1.min",
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