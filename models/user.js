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
    trim: true,
    unique: true
  },
  password: {
    type: String
  },
  token: {
    type: String
  },
  tokenSecret: {
    type: String
  }
});
UserModel = db.model("User", UserSchema);
exports = module.exports = UserModel;