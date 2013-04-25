/**
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
      if (token && tokenSecret) {
        callback();
      } else {
        server.get("/authorize", function (req, res) {
          server.routes.get = [];
          callback();
          res.redirect("/");
        });
        server.get("*", function (req, res) {
          res.redirect(authUrl);
        });
      }
    }
  };
};
exports = module.exports = dropboxDriverNode;