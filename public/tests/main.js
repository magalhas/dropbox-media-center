/**
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
requirejs.config({
    baseUrl: "js",
	paths: {
		tests: "../tests"
	},
	shim: {
	    "tests/suites": {
	        deps: ["app"]
	    }
	}
});
require(["app", "jquery", "backbone", "lodash", "require"], function (App, $, Backbone, _, require) {
	"use strict";
    require(["tests/suites"], function () {
        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
        jasmine.getEnv().execute();
    });
});