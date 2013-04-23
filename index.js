/**
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
var config = require("./config.json"),
  DropboxMediaCenter = require("./lib/dropbox-media-center");
new DropboxMediaCenter(config).run();