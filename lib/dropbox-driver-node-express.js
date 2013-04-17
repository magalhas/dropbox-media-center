/**
 * @file lib/dropbox-driver-node-express.js
 * @module lib/dropbox-driver-node-express
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
"use strict";
/**
 * @todo Documentation.
 */
function dropboxDriverNode(url, server) {
  return {
    url: function (token) {
      return url + "/authorize";
    },
    doAuthorize: function (authUrl, token, tokenSecret, callback) {
      server.get("*", function (req, res) {
        res.redirect(authUrl);
        server.routes.get = [];
        server.get("/authorize", function (req, res) {
          server.routes.get = [];
          callback();
          res.redirect("/");
        });
      });
    }
  };
};
exports = module.exports = dropboxDriverNode;