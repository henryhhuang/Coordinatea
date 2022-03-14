const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    following: [String], // [username]
    comments: [{ type : mongoose.Schema.Types.ObjectId, ref: 'comments' }]
});

module.exports = model("User", UserSchema);