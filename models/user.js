/**
 * @module models/user
 * @copywrite 2013, "Magalhas" José Magalhães
 * @license MIT <http://opensource.org/licenses/MIT>
 */
var
  db = require("mongoose"),
  UserModel,
  UserSchema;
UserSchema = new db.Schema({
  username: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    trim: true
  },
  token: {
    type: String,
    trim: true
  },
  tokenSecret: {
    type: String,
    trim: true
  }
});
UserModel = db.model("User", UserSchema);
exports = module.exports = UserModel;