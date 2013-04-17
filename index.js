"use strict";
var config = require("./config.json"),
  DropboxMediaCenter = require("./lib/dropbox-media-center");
new DropboxMediaCenter(config).run();