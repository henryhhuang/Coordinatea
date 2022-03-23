const { default: mongoose } = require("mongoose");
const { model, Schema } = require("mongoose");

const CommentSchema = new Schema({
    userId: String,
    username: String,
    parentId: String,
    content: String,
    createdAt: String,
});

module.exports = model("Comment", CommentSchema);