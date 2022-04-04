const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    createdAt: String,
    description: String,
    followers: [String],
    following: [String], // [username]
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
    journeys: [String]
});

module.exports = model("User", UserSchema);