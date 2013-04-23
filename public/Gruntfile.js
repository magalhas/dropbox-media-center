/**
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
var fs = require("fs-extra");
exports = module.exports = function (grunt) {
  "use strict";
	grunt.initConfig({
		jsdoc: {
			dist: {
				src: ["./js"],
				options: {
					destination: "./docs",
					configure: "jsdoc3.json"
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: "./js",
					out: "./dist/js/main.js",
					name: "main",
					optimize: "uglify2",
					generateSourceMaps: false,
					preserveLicenseComments: false,
          mainConfigFile: "./js/config.require.js",
          deps: ["routers/main"]
				}
			}
		}
	});
  grunt.registerTask("default", ["compile"]);
  /**
   * Documentation tasks
   */
  grunt.loadNpmTasks("grunt-jsdoc");
  grunt.registerTask("documentation", ["cleanDocumentation", "jsdoc"]);
  grunt.registerTask("cleanDocumentation", function () {
    fs.removeSync("./docs");
		grunt.log.ok("Documentation directory was removed.");
  });
  /**
   * Compile tasks
   */
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.registerTask("compile", ["copyResources", "requirejs"]);
  grunt.registerTask("copyResources", ["cleanDist", "copyIndex", "copySkin", "copyTemplates", "copyRequirejs"]);
  grunt.registerTask("cleanDist", function () {
    grunt.log.writeln("Cleaning dist folder...");
    fs.removeSync("dist");
    fs.mkdirsSync("dist/js/libs/vendor");
  });
  grunt.registerTask("copyIndex", function () {
    var done = this.async();
    fs.readFile("index.html", 'utf8', function (err, data) {
      if (err) {
        return grunt.log.error("There was an error copying index.html");
      }
      var result = data.replace(/^.*config\.require\.js.*$/m, "");
      fs.writeFile("dist/index.html", result, "utf8", function (err) {
         if (err) {
           grunt.log.error("There was an error copying index.html");
         } else {
           grunt.log.ok("index.html copied.");
         }
         done();
      });
    });
  });
  grunt.registerTask("copySkin", function () {
    var done = this.async();
    fs.copy("skin", "dist/skin", function (err) {
      if (err) {
        grunt.log.error("There were errors copying the skin directory.");
      } else {
        grunt.log.ok("Skin directory copied.");
      }
      done();
    });
  });
  grunt.registerTask("copyTemplates", function () {
    var done = this.async();
    fs.copy("templates", "dist/templates", function (err) {
      if (err) {
        grunt.log.error("There were errors copying the templates directory.");
      } else {
        grunt.log.ok("Templates directory copied.");
      }
      done();
    });
  });
  grunt.registerTask("copyRequirejs", function () {
    var done = this.async();
    fs.copy(
      "js/libs/vendor/require-2.1.5.min.js",
      "dist/js/libs/vendor/require-2.1.5.min.js",
      function (err) {
        if (err) {
          grunt.log.error("There were errors copying requirejs.");
        } else {
          grunt.log.ok("Requirejs copied.");
        }
        done();
      }
    );
  });
};